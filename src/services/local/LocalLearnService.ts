import AsyncStorage from "@react-native-async-storage/async-storage";
import { ILearnService, LearningPath, Lesson, PathDetail } from "@/services/interfaces/ILearnService";
import { localLearningPaths, localLessons } from "./data/learningPaths";

const ACTIVE_PATH_KEY = "quick_learn_active_path";
const LESSON_COMPLETE_PREFIX = "ll_complete_";
const LESSON_QUIZ_PASSED_PREFIX = "ll_quiz_";

export class LocalLearnService implements ILearnService {
  private async isLessonComplete(lessonId: string): Promise<boolean> {
    const val = await AsyncStorage.getItem(LESSON_COMPLETE_PREFIX + lessonId);
    return val === "1";
  }

  private async isQuizPassed(lessonId: string): Promise<boolean> {
    const val = await AsyncStorage.getItem(LESSON_QUIZ_PASSED_PREFIX + lessonId);
    return val === "1";
  }

  private async resolveLesson(base: Lesson): Promise<Lesson> {
    const [completed, quizPassed] = await Promise.all([
      this.isLessonComplete(base.id),
      this.isQuizPassed(base.id),
    ]);

    // First lesson of each path is always unlocked
    let unlocked = base.order === 1;

    if (!unlocked) {
      // Unlocked when previous lesson's quiz is passed
      const pathLessons = localLessons.filter((l) => l.pathId === base.pathId);
      const prev = pathLessons.find((l) => l.order === base.order - 1);
      if (prev) {
        unlocked = await this.isQuizPassed(prev.id);
      }
    }

    return {
      ...base,
      isCompleted: completed,
      isUnlocked: unlocked,
      quiz: base.quiz
        ? { ...base.quiz, isPassed: quizPassed }
        : undefined,
    };
  }

  async getPaths(): Promise<LearningPath[]> {
    const paths: LearningPath[] = [];

    for (const path of localLearningPaths) {
      const pathLessons = localLessons.filter((l) => l.pathId === path.id);
      let completedLessons = 0;
      let nextLessonId: string | null = null;

      for (const lesson of pathLessons) {
        const completed = await this.isLessonComplete(lesson.id);
        if (completed) completedLessons++;
      }

      // Find next lesson: first incomplete unlocked lesson
      for (const lesson of pathLessons) {
        const resolved = await this.resolveLesson(lesson);
        if (!resolved.isCompleted && resolved.isUnlocked) {
          nextLessonId = lesson.id;
          break;
        }
      }

      const progressPercentage =
        pathLessons.length > 0
          ? Math.round((completedLessons / pathLessons.length) * 100)
          : 0;

      paths.push({
        ...path,
        userProgress: { completedLessons, progressPercentage, nextLessonId },
      });
    }

    return paths;
  }

  async getPathById(pathId: string): Promise<PathDetail> {
    const path = localLearningPaths.find((p) => p.id === pathId);
    if (!path) throw new Error(`Learning path not found: ${pathId}`);

    const baseLessons = localLessons.filter((l) => l.pathId === pathId);
    const lessons = await Promise.all(baseLessons.map((l) => this.resolveLesson(l)));

    const completedLessons = lessons.filter((l) => l.isCompleted).length;
    const nextLesson = lessons.find((l) => !l.isCompleted && l.isUnlocked);
    const progressPercentage =
      lessons.length > 0
        ? Math.round((completedLessons / lessons.length) * 100)
        : 0;

    return {
      ...path,
      lessons,
      userProgress: {
        completedLessons,
        progressPercentage,
        nextLessonId: nextLesson?.id ?? null,
      },
    };
  }

  async getLessonById(lessonId: string): Promise<Lesson> {
    const base = localLessons.find((l) => l.id === lessonId);
    if (!base) throw new Error(`Lesson not found: ${lessonId}`);
    return this.resolveLesson(base);
  }

  async markLessonComplete(lessonId: string): Promise<void> {
    await AsyncStorage.setItem(LESSON_COMPLETE_PREFIX + lessonId, "1");
  }

  async passLessonQuiz(lessonId: string): Promise<void> {
    await AsyncStorage.setItem(LESSON_QUIZ_PASSED_PREFIX + lessonId, "1");
    // Also mark the lesson complete when quiz is passed
    await AsyncStorage.setItem(LESSON_COMPLETE_PREFIX + lessonId, "1");
  }

  async getActivePath(): Promise<string | null> {
    return AsyncStorage.getItem(ACTIVE_PATH_KEY);
  }

  async setActivePath(pathId: string): Promise<void> {
    await AsyncStorage.setItem(ACTIVE_PATH_KEY, pathId);
  }

  async getTodayLesson(): Promise<{ lesson: Lesson; path: LearningPath } | null> {
    const activePathId = await this.getActivePath();

    // If active path set, use it; else pick first path with incomplete lessons
    const pathsToCheck = activePathId
      ? localLearningPaths.filter((p) => p.id === activePathId)
      : localLearningPaths;

    for (const path of pathsToCheck) {
      const pathLessons = localLessons.filter((l) => l.pathId === path.id);
      for (const lesson of pathLessons) {
        const resolved = await this.resolveLesson(lesson);
        if (!resolved.isCompleted && resolved.isUnlocked) {
          return { lesson: resolved, path };
        }
      }
    }

    // All paths complete — return null
    return null;
  }
}

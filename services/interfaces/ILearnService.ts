import { ChapterQuiz } from "./ICourseService";

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string | null;
  totalLessons: number;
  estimatedMinutes: number;
  userProgress?: {
    completedLessons: number;
    progressPercentage: number;
    nextLessonId: string | null;
  };
}

export interface Lesson {
  id: string;
  pathId: string;
  title: string;
  order: number;
  durationSeconds: number;
  videoUrl: string;
  conceptTags: string[];
  keyPoint: string;
  summary: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  quiz?: ChapterQuiz;
}

export interface PathDetail extends LearningPath {
  lessons: Lesson[];
}

export interface ILearnService {
  getPaths(): Promise<LearningPath[]>;
  getPathById(pathId: string): Promise<PathDetail>;
  getLessonById(lessonId: string): Promise<Lesson>;
  markLessonComplete(lessonId: string): Promise<void>;
  passLessonQuiz(lessonId: string): Promise<void>;
  getActivePath(): Promise<string | null>;
  setActivePath(pathId: string): Promise<void>;
  getTodayLesson(): Promise<{ lesson: Lesson; path: LearningPath } | null>;
}

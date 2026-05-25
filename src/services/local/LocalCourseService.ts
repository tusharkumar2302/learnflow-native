import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChapterSummary,
  CourseDetail,
  CourseListParams,
  CourseSummary,
  ICourseService,
  PaginatedResult,
  RecentChapter,
} from "@/services/interfaces/ICourseService";
import { ChapterProgressRecord } from "@/services/interfaces/IProgressService";
import { localCourseDetails, localCourseSummaries } from "./data/courses";
import { localRecentChapters } from "./data/progress";

const PROGRESS_PREFIX = "chapter_progress_";
const RECENT_CHAPTERS_KEY = "local_recent_chapters";

function paginate<T>(items: T[], page: number, limit: number): PaginatedResult<T> {
  const start = (page - 1) * limit;
  return {
    items: items.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
    },
  };
}

async function readChapterProgress(chapterId: string): Promise<ChapterProgressRecord | null> {
  try {
    const stored = await AsyncStorage.getItem(PROGRESS_PREFIX + chapterId);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export class LocalCourseService implements ICourseService {
  async getCourses(params: CourseListParams = {}): Promise<PaginatedResult<CourseSummary>> {
    const { page = 1, limit = 10, category } = params;
    let filtered = localCourseSummaries;
    if (category && category !== "All") {
      filtered = filtered.filter((c) => c.category === category);
    }

    const withProgress = await Promise.all(
      filtered.map(async (c) => {
        const detail = localCourseDetails[c.id];
        if (!detail) return c;
        const chapters = detail.chapters;
        const completionFlags = await Promise.all(
          chapters.map(async (ch) => {
            const record = await readChapterProgress(ch.id);
            return record ? record.completed : ch.isCompleted;
          })
        );
        const completedChapters = completionFlags.filter(Boolean).length;
        const progressPercentage =
          chapters.length > 0
            ? Math.round((completedChapters / chapters.length) * 100)
            : 0;
        return {
          ...c,
          userProgress: { completedChapters, progressPercentage },
        };
      })
    );

    return paginate(withProgress, page, limit);
  }

  async getCourseById(id: string): Promise<CourseDetail> {
    const base = localCourseDetails[id];

    if (!base) {
      const summary = localCourseSummaries.find((c) => c.id === id);
      if (!summary) throw new Error(`Course ${id} not found`);
      return {
        ...summary,
        description: `${summary.title} — comprehensive curriculum designed for ${summary.difficulty.toLowerCase()} level learners.`,
        overview: "Structured learning modules with quizzes and coin rewards for every completed chapter.",
        isEnrolled: false,
        userProgress: {
          totalChapters: summary.chapterCount,
          completedChapters: 0,
          progressPercentage: 0,
        },
        chapters: Array.from({ length: summary.chapterCount }, (_, i) => ({
          id: `${id}-ch-${i + 1}`,
          title: `Chapter ${i + 1}`,
          order: i + 1,
          duration: 720 + Math.floor(Math.random() * 480),
          isCompleted: false,
          videoCompleted: false,
          currentTime: 0,
          coinValue: Math.floor(summary.totalCoins / summary.chapterCount),
          quizCount: 1,
          quizPassed: false,
        } as ChapterSummary)),
      };
    }

    const chaptersWithProgress = await Promise.all(
      base.chapters.map(async (ch) => {
        const record = await readChapterProgress(ch.id);
        if (!record) return ch;
        return {
          ...ch,
          isCompleted: record.completed || ch.isCompleted,
          videoCompleted: record.completed || ch.videoCompleted,
          currentTime: record.completed ? 0 : record.currentTime,
        };
      })
    );

    const completedChapters = chaptersWithProgress.filter((ch) => ch.isCompleted).length;
    const progressPercentage =
      chaptersWithProgress.length > 0
        ? Math.round((completedChapters / chaptersWithProgress.length) * 100)
        : 0;

    return {
      ...base,
      chapters: chaptersWithProgress,
      userProgress: {
        ...base.userProgress,
        completedChapters,
        progressPercentage,
      },
    };
  }

  async searchCourses(query: string, limit = 10): Promise<CourseSummary[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return localCourseSummaries
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.author.toLowerCase().includes(q)
      )
      .slice(0, limit);
  }

  async getRecentlyWatched(limit = 5): Promise<RecentChapter[]> {
    try {
      const stored = await AsyncStorage.getItem(RECENT_CHAPTERS_KEY);
      if (stored) return (JSON.parse(stored) as RecentChapter[]).slice(0, limit);
      return localRecentChapters.slice(0, limit);
    } catch {
      return localRecentChapters.slice(0, limit);
    }
  }

  async enrollCourse(_courseId: string): Promise<void> {}
}

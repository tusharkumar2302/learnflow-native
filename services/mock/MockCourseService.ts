import {
  ChapterSummary,
  CourseDetail,
  CourseListParams,
  CourseSummary,
  ICourseService,
  PaginatedResult,
  RecentChapter,
} from "@/services/interfaces/ICourseService";
import { mockCourseDetails, mockCourseSummaries, MOCK_VIDEO_URL } from "./data/courses";
import { mockRecentChapters } from "./data/progress";

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

export class MockCourseService implements ICourseService {
  async getCourses(params: CourseListParams = {}): Promise<PaginatedResult<CourseSummary>> {
    const { page = 1, limit = 10, category } = params;

    let filtered = mockCourseSummaries;
    if (category && category !== "All") {
      filtered = filtered.filter((c) => c.category === category);
    }

    return paginate(filtered, page, limit);
  }

  async getCourseById(id: string): Promise<CourseDetail> {
    const course = mockCourseDetails[id];
    if (course) return course;

    // For courses without full detail data, build from summary
    const summary = mockCourseSummaries.find((c) => c.id === id);
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

  async searchCourses(query: string, limit = 10): Promise<CourseSummary[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return mockCourseSummaries
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.author.toLowerCase().includes(q)
      )
      .slice(0, limit);
  }

  async getRecentlyWatched(limit = 5): Promise<RecentChapter[]> {
    return mockRecentChapters.slice(0, limit);
  }

  async enrollCourse(_courseId: string): Promise<void> {
    // Mock: enrollment always succeeds
  }
}

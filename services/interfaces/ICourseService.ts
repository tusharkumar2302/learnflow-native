export interface CourseSummary {
  id: string;
  title: string;
  author: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  thumbnail: string | null;
  estimatedDuration: number;
  totalCoins: number;
  price: number;
  chapterCount: number;
  userProgress?: {
    completedChapters: number;
    progressPercentage: number;
  };
}

export interface CourseDetail extends CourseSummary {
  description: string;
  overview: string;
  isEnrolled: boolean;
  chapters: ChapterSummary[];
  userProgress: {
    totalChapters: number;
    completedChapters: number;
    progressPercentage: number;
    lastWatchedChapterId?: string;
  };
}

export interface ChapterSummary {
  id: string;
  title: string;
  order: number;
  duration: number;
  isCompleted: boolean;
  videoCompleted: boolean;
  currentTime: number;
  coinValue: number;
  quizCount: number;
  quizPassed: boolean;
}

export interface RecentChapter {
  courseId: string;
  courseTitle: string;
  courseThumbnail: string | null;
  chapterId: string;
  chapterTitle: string;
  chapterOrder: number;
  currentTime: number;
  progressPercentage: number;
  lastWatchedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CourseListParams {
  page?: number;
  limit?: number;
  category?: string;
  query?: string;
}

export interface ICourseService {
  getCourses(params?: CourseListParams): Promise<PaginatedResult<CourseSummary>>;
  getCourseById(id: string): Promise<CourseDetail>;
  searchCourses(query: string, limit?: number): Promise<CourseSummary[]>;
  getRecentlyWatched(limit?: number): Promise<RecentChapter[]>;
  enrollCourse(courseId: string): Promise<void>;
}

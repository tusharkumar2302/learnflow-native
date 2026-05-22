import { ChapterProgressRecord } from "@/services/interfaces/IProgressService";
import { RecentChapter } from "@/services/interfaces/ICourseService";

// Pre-seeded progress: user is 2m34s into DeFi Chapter 3
export const mockChapterProgress: Record<string, ChapterProgressRecord> = {
  "ch-defi-001": {
    chapterId: "ch-defi-001",
    currentTime: 0,
    completed: true,
    lastUpdatedAt: "2026-05-19T10:15:00Z",
  },
  "ch-defi-002": {
    chapterId: "ch-defi-002",
    currentTime: 0,
    completed: true,
    lastUpdatedAt: "2026-05-20T14:32:00Z",
  },
  "ch-defi-003": {
    chapterId: "ch-defi-003",
    currentTime: 154,
    completed: false,
    lastUpdatedAt: "2026-05-21T09:45:00Z",
  },
};

// What shows in "Continue Watching" on Home
export const mockRecentChapters: RecentChapter[] = [
  {
    courseId: "course-defi-001",
    courseTitle: "Introduction to DeFi",
    courseThumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&q=80",
    chapterId: "ch-defi-003",
    chapterTitle: "Lending and Borrowing Protocols",
    chapterOrder: 3,
    currentTime: 154,
    progressPercentage: 33,
    lastWatchedAt: "2026-05-21T09:45:00Z",
  },
];

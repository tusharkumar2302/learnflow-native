import { ChapterProgressRecord } from "@/services/interfaces/IProgressService";
import { RecentChapter } from "@/services/interfaces/ICourseService";

export const localChapterProgress: Record<string, ChapterProgressRecord> = {
  "ch-ai-001": {
    chapterId: "ch-ai-001",
    currentTime: 0,
    completed: true,
    lastUpdatedAt: "2026-05-19T10:15:00Z",
  },
  "ch-ai-002": {
    chapterId: "ch-ai-002",
    currentTime: 0,
    completed: true,
    lastUpdatedAt: "2026-05-20T14:32:00Z",
  },
  "ch-ai-003": {
    chapterId: "ch-ai-003",
    currentTime: 154,
    completed: false,
    lastUpdatedAt: "2026-05-21T09:45:00Z",
  },
};

export const localRecentChapters: RecentChapter[] = [
  {
    courseId: "course-ai-001",
    courseTitle: "AI Tools for Financial Research",
    courseThumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&q=80",
    category: "Productivity & Finance",
    totalChapters: 6,
    chapterId: "ch-ai-003",
    chapterTitle: "Using ChatGPT for Financial Analysis",
    chapterOrder: 3,
    currentTime: 154,
    progressPercentage: 33,
    lastWatchedAt: "2026-05-21T09:45:00Z",
  },
];

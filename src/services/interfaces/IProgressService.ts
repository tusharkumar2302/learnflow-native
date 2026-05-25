import { RecentChapter } from "@/services/interfaces/ICourseService";

export interface ChapterProgressRecord {
  chapterId: string;
  currentTime: number;
  completed: boolean;
  lastUpdatedAt: string;
}

export interface IProgressService {
  getProgress(chapterId: string): Promise<ChapterProgressRecord | null>;
  saveProgress(chapterId: string, currentTime: number): Promise<void>;
  markChapterComplete(chapterId: string): Promise<void>;
  clearProgress(chapterId: string): Promise<void>;
  updateRecentChapter(entry: RecentChapter): Promise<void>;
  getRecentlyWatched(limit?: number): Promise<RecentChapter[]>;
}

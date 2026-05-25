import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChapterProgressRecord,
  IProgressService,
} from "@/services/interfaces/IProgressService";
import { RecentChapter } from "@/services/interfaces/ICourseService";
import { localChapterProgress, localRecentChapters } from "./data/progress";

const PROGRESS_PREFIX = "chapter_progress_";
const RECENT_CHAPTERS_KEY = "local_recent_chapters";
const MAX_RECENT = 5;

export class LocalProgressService implements IProgressService {
  async getProgress(chapterId: string): Promise<ChapterProgressRecord | null> {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_PREFIX + chapterId);
      if (stored) return JSON.parse(stored);
      return localChapterProgress[chapterId] ?? null;
    } catch {
      return localChapterProgress[chapterId] ?? null;
    }
  }

  async saveProgress(chapterId: string, currentTime: number): Promise<void> {
    const existing = await this.getProgress(chapterId);
    const record: ChapterProgressRecord = {
      chapterId,
      currentTime,
      completed: existing?.completed ?? false,
      lastUpdatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(PROGRESS_PREFIX + chapterId, JSON.stringify(record));
  }

  async markChapterComplete(chapterId: string): Promise<void> {
    const record: ChapterProgressRecord = {
      chapterId,
      currentTime: 0,
      completed: true,
      lastUpdatedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(PROGRESS_PREFIX + chapterId, JSON.stringify(record));
  }

  async clearProgress(chapterId: string): Promise<void> {
    await AsyncStorage.removeItem(PROGRESS_PREFIX + chapterId);
  }

  async updateRecentChapter(entry: RecentChapter): Promise<void> {
    try {
      const existing = await this.getRecentlyWatched(MAX_RECENT);
      const filtered = existing.filter((r) => r.chapterId !== entry.chapterId);
      const updated = [
        { ...entry, lastWatchedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_RECENT);
      await AsyncStorage.setItem(RECENT_CHAPTERS_KEY, JSON.stringify(updated));
    } catch {
      // non-fatal
    }
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
}

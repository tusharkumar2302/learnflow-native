import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ChapterProgressRecord,
  IProgressService,
} from "@/services/interfaces/IProgressService";
import { mockChapterProgress } from "./data/progress";

const PROGRESS_PREFIX = "mock_chapter_progress_";

export class MockProgressService implements IProgressService {
  async getProgress(chapterId: string): Promise<ChapterProgressRecord | null> {
    try {
      const stored = await AsyncStorage.getItem(PROGRESS_PREFIX + chapterId);
      if (stored) return JSON.parse(stored);

      // Fall back to pre-seeded progress
      return mockChapterProgress[chapterId] ?? null;
    } catch {
      return mockChapterProgress[chapterId] ?? null;
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
}

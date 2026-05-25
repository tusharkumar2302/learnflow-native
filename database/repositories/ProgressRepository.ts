// Continue-watching / recent chapters repository stub.
// Will use SQLite when expo-sqlite is integrated.

import { db } from "../sqlite";

export class ProgressRepository {
  async getRecentChapters(_limit = 5): Promise<null[]> {
    if (!db) return [];
    return [];
  }

  async upsertRecentChapter(_courseId: string, _chapterId: string, _currentTime: number): Promise<void> {
    if (!db) return;
  }
}

// Course progress repository stub.
// Will use SQLite when expo-sqlite is integrated.
// Currently all progress goes through LocalProgressService via AsyncStorage.

import { db } from "../sqlite";

export class CourseRepository {
  async getProgress(_chapterId: string): Promise<null> {
    if (!db) return null;
    return null;
  }

  async saveProgress(_chapterId: string, _currentTime: number, _completed: boolean): Promise<void> {
    if (!db) return;
  }
}

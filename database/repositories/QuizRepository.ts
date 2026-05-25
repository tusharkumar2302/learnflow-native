// Quiz history repository stub.
// Will use SQLite when expo-sqlite is integrated.

import { db } from "../sqlite";

export class QuizRepository {
  async hasSubmitted(_quizId: string): Promise<boolean> {
    if (!db) return false;
    return false;
  }

  async saveSubmission(_quizId: string, _score: number, _passed: boolean): Promise<void> {
    if (!db) return;
  }
}

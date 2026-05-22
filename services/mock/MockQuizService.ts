import {
  IQuizService,
  LeaderboardEntry,
  QuizAnswer,
  QuizSubmitResult,
  WeeklyQuizSummary,
} from "@/services/interfaces/IQuizService";
import { mockLeaderboard, mockWeeklyQuiz } from "./data/weeklyQuiz";

export class MockQuizService implements IQuizService {
  async getWeeklyQuiz(): Promise<WeeklyQuizSummary | null> {
    return mockWeeklyQuiz;
  }

  async submitWeeklyQuiz(
    _quizId: string,
    answers: QuizAnswer[]
  ): Promise<QuizSubmitResult> {
    let correct = 0;
    const questions = mockWeeklyQuiz.questions;

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const selected = question.options.find(
        (o) => o.id === answer.selectedOptionId
      );
      if (selected?.isCorrect) correct++;
    }

    const totalScore = correct * 20;
    const maxScore = questions.length * 20;
    const percentageScore = Math.round((totalScore / maxScore) * 100);
    const passed = percentageScore >= mockWeeklyQuiz.passingScore;

    return {
      passed,
      coinsAwarded: passed ? mockWeeklyQuiz.coinReward : 0,
      totalScore,
      maxScore,
      percentageScore,
      correctAnswers: correct,
      totalQuestions: questions.length,
    };
  }

  async getLeaderboard(_quizId: string, limit = 10): Promise<LeaderboardEntry[]> {
    return mockLeaderboard.slice(0, limit);
  }
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  IQuizService,
  LeaderboardEntry,
  QuizAnswer,
  QuizSubmitResult,
  WeeklyQuizSummary,
} from "@/services/interfaces/IQuizService";
import { localLeaderboard, localWeeklyQuiz } from "./data/quizzes";

const QUIZ_SUBMISSION_KEY = "weekly_quiz_submission_";

export class LocalQuizService implements IQuizService {
  async getWeeklyQuiz(): Promise<WeeklyQuizSummary | null> {
    const submissionKey = QUIZ_SUBMISSION_KEY + localWeeklyQuiz.id;
    try {
      const submitted = await AsyncStorage.getItem(submissionKey);
      return { ...localWeeklyQuiz, hasSubmitted: submitted === "true" };
    } catch {
      return localWeeklyQuiz;
    }
  }

  async submitWeeklyQuiz(
    _quizId: string,
    answers: QuizAnswer[]
  ): Promise<QuizSubmitResult> {
    let correct = 0;
    const questions = localWeeklyQuiz.questions;

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
    const passed = percentageScore >= localWeeklyQuiz.passingScore;

    await AsyncStorage.setItem(
      QUIZ_SUBMISSION_KEY + localWeeklyQuiz.id,
      "true"
    );

    return {
      passed,
      coinsAwarded: passed ? localWeeklyQuiz.coinReward : 0,
      totalScore,
      maxScore,
      percentageScore,
      correctAnswers: correct,
      totalQuestions: questions.length,
    };
  }

  async getLeaderboard(_quizId: string, limit = 10): Promise<LeaderboardEntry[]> {
    return localLeaderboard.slice(0, limit);
  }
}

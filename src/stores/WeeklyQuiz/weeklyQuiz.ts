import { create } from "zustand";
import { quizService } from "@/lib/services";
import {
  WeeklyQuizSummary,
  LeaderboardEntry,
  QuizAnswer,
  QuizSubmitResult,
} from "@/services/interfaces/IQuizService";

interface WeeklyQuizState {
  activeQuiz: WeeklyQuizSummary | null;
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;

  fetchActiveQuiz: () => Promise<void>;
  submitAnswer: (quizId: string, answers: QuizAnswer[]) => Promise<QuizSubmitResult>;
  fetchLeaderboard: (quizId: string, limit?: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useWeeklyQuizStore = create<WeeklyQuizState>((set) => ({
  activeQuiz: null,
  leaderboard: [],
  isLoading: false,
  error: null,

  fetchActiveQuiz: async () => {
    set({ isLoading: true, error: null });
    try {
      const quiz = await quizService.getWeeklyQuiz();
      set({ activeQuiz: quiz, isLoading: false });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch quiz",
        isLoading: false,
        activeQuiz: null,
      });
    }
  },

  submitAnswer: async (quizId: string, answers: QuizAnswer[]): Promise<QuizSubmitResult> => {
    set({ isLoading: true, error: null });
    try {
      const result = await quizService.submitWeeklyQuiz(quizId, answers);
      set({ isLoading: false });
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to submit quiz";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  fetchLeaderboard: async (quizId: string, limit = 100) => {
    set({ error: null });
    try {
      const entries = await quizService.getLeaderboard(quizId, limit);
      set({ leaderboard: entries });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch leaderboard",
        leaderboard: [],
      });
    }
  },

  clearError: () => set({ error: null }),

  reset: () => set({ activeQuiz: null, leaderboard: [], isLoading: false, error: null }),
}));

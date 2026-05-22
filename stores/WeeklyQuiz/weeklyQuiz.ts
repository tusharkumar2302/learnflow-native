import { apiClient } from "@/lib/api-client";
import { create } from "zustand";

interface QuestionOption {
  id: string;
  optionText: string;
  optionOrder: number;
}

interface Question {
  id: string;
  questionText: string;
  imageUrl?: string;
  order: number;
  points: number;
  options: QuestionOption[];
}

interface WeeklyQuiz {
  id: string;
  title: string;
  description?: string;
  coinReward: number;
  passingScore: number;
  totalQuestions: number;
  maxScore: number;
  imageUrl?: string;
  category?: string;
  startDate: string;
  endDate: string;
  questions: Question[];
}

interface SubmissionAnswer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsEarned: number;
}

interface Submission {
  id: string;
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  passed: boolean;
  questionsAnswered: number;
  correctAnswers: number;
  submittedAt: string;
  answers: SubmissionAnswer[];
}

interface ActiveQuizData {
  quiz: WeeklyQuiz;
  hasSubmitted: boolean;
  submission: Submission | null;
}

interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    name: string;
    imgUrl?: string;
    subscriptionTier: string;
  };
  score: number;
  percentageScore: number;
  submittedAt: string;
}

interface UserRank {
  rank: number;
  score: number;
  percentageScore: number;
  totalParticipants: number;
  quizTitle: string;
  maxScore: number;
  submittedAt: string;
}

interface AnswerInput {
  questionId: string;
  selectedOptionId: string;
}

interface SubmitResult {
  submissionId: string;
  passed: boolean;
  coinsAwarded: number;
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  correctAnswers: number;
  totalQuestions: number;
  submittedAt: string;
  answers: SubmissionAnswer[];
}

interface WeeklyQuizState {
  activeQuiz: ActiveQuizData | null;
  leaderboard: LeaderboardEntry[];
  userRank: UserRank | null;
  isLoading: boolean;
  error: string | null;

  fetchActiveQuiz: () => Promise<void>;
  submitAnswer: (
    quizId: string,
    answers: AnswerInput[]
  ) => Promise<SubmitResult>;
  fetchLeaderboard: (quizId: string, limit?: number) => Promise<void>;
  fetchUserRank: (quizId: string) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useWeeklyQuizStore = create<WeeklyQuizState>((set, get) => ({
  activeQuiz: null,
  leaderboard: [],
  userRank: null,
  isLoading: false,
  error: null,

  fetchActiveQuiz: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.get("/api/user/weekly-quiz/active");

      if (response.data && response.data.quiz) {
        set({
          activeQuiz: {
            quiz: response.data.quiz,
            hasSubmitted: response.data.hasSubmitted,
            submission: response.data.submission || null,
          },
          isLoading: false,
        });
      } else {
        set({ activeQuiz: null, isLoading: false });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch quiz";
      set({ error: errorMessage, isLoading: false, activeQuiz: null });
      console.error("Fetch active quiz error:", error);
    }
  },

  submitAnswer: async (
    quizId: string,
    answers: AnswerInput[]
  ): Promise<SubmitResult> => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.post(
        `/api/user/weekly-quiz/${quizId}/submit`,
        { answers }
      );

      set({ isLoading: false });

      // Refresh active quiz to update submission status
      get().fetchActiveQuiz();

      return {
        submissionId: response.data.submissionId,
        passed: response.data.passed,
        coinsAwarded: response.data.coinsAwarded,
        totalScore: response.data.totalScore,
        maxScore: response.data.maxScore,
        percentageScore: response.data.percentageScore,
        correctAnswers: response.data.correctAnswers,
        totalQuestions: response.data.totalQuestions,
        submittedAt: response.data.submittedAt,
        answers: response.data.answers,
      };
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit quiz";
      set({ error: errorMessage, isLoading: false });
      console.error("Submit answer error:", error);
      throw error;
    }
  },

  fetchLeaderboard: async (quizId: string, limit = 100) => {
    set({ error: null });
    try {
      const response = await apiClient.get(
        `/api/user/weekly-quiz/${quizId}/leaderboard?limit=${limit}`
      );

      if (Array.isArray(response.data)) {
        set({ leaderboard: response.data });
      } else {
        set({ leaderboard: [] });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leaderboard";
      set({ error: errorMessage, leaderboard: [] });
      console.error("Fetch leaderboard error:", error);
    }
  },

  fetchUserRank: async (quizId: string) => {
    set({ error: null });
    try {
      const response = await apiClient.get(
        `/api/user/weekly-quiz/${quizId}/rank`
      );

      if (response.data) {
        set({ userRank: response.data });
      } else {
        set({ userRank: null });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch user rank";
      set({ error: errorMessage, userRank: null });
      console.error("Fetch user rank error:", error);
    }
  },

  clearError: () => set({ error: null }),

  reset: () =>
    set({
      activeQuiz: null,
      leaderboard: [],
      userRank: null,
      isLoading: false,
      error: null,
    }),
}));

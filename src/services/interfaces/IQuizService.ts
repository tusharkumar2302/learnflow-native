export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  imageUrl?: string;
  order: number;
  points: number;
  options: QuizOption[];
}

export interface WeeklyQuizSummary {
  id: string;
  title: string;
  description?: string;
  coinReward: number;
  passingScore: number;
  totalQuestions: number;
  startDate: string;
  endDate: string;
  hasSubmitted: boolean;
  questions: QuizQuestion[];
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  imgUrl?: string;
  score: number;
  percentageScore: number;
  submittedAt: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionId: string;
}

export interface QuizSubmitResult {
  passed: boolean;
  coinsAwarded: number;
  totalScore: number;
  maxScore: number;
  percentageScore: number;
  correctAnswers: number;
  totalQuestions: number;
}

export interface IQuizService {
  getWeeklyQuiz(): Promise<WeeklyQuizSummary | null>;
  submitWeeklyQuiz(quizId: string, answers: QuizAnswer[]): Promise<QuizSubmitResult>;
  getLeaderboard(quizId: string, limit?: number): Promise<LeaderboardEntry[]>;
}

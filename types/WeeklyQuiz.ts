export interface WeeklyQuizQuestion {
  id: string;
  questionText: string;
  imageUrl?: string;
  order: number;
  points: number;
  options: WeeklyQuizOption[];
}

export interface WeeklyQuizOption {
  id: string;
  optionText: string;
  optionOrder: number;
}

export interface WeeklyQuiz {
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
  questions: WeeklyQuizQuestion[];
}

export interface LeaderboardEntry {
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

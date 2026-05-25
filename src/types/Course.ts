export interface Document {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  chapterId?: string;
  courseId?: string;
  uploadedAt?: string;
}

export interface Quiz {
  id: string;
  title?: string;
  chapterId?: string;
  coinValue: number;
  passScore?: number;
  duration?: number;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  isPassed?: boolean;
  questions?: {
    id: string;
    quizId: string;
    text: string;
    imgUrl: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
    options: {
      id: string;
      questionId: string;
      text: string;
      isCorrect: boolean;
      createdAt: string;
    }[];
  }[];
  userResult?: {
    quizId: string;
    score: number;
    passed: boolean;
    attemptedAt: string;
  };
  results?: {
    passed: boolean;
  };
}

export interface ChapterProgress {
  id: string;
  userId: string;
  chapterId: string;
  completed: boolean;
  currentTime: number;
  watchedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Chapter {
  id: string;
  title: string;
  duration: number;
  order: number;
  isCompleted: boolean;
  videoCompleted?: boolean;
  chapterCompleted?: boolean;
  quizzes: Quiz[];
  videoUrl?: string;
  description?: string;
  currentTime?: number;
  documents?: Document[];
  coinValue?: number;
  muxAssetId?: string;
  muxPlaybackId?: string;
  videoStatus?: string;
  isPublished?: boolean;
  createdAt?: string;
  updatedAt?: string;
  progress?: ChapterProgress[];
}

export interface UserProgress {
  totalChapters: number;
  completedChapters: number;
  totalQuizzes?: number;
  completedQuizzes?: number;
  progressPercentage: number;
  lastWatchedChapter?: {
    chapterId: string;
    completed: boolean;
    watchedAt: string;
  };
}

export interface Course {
  id: string;
  title: string;
  thumbnail: string | null;
  chapters: Chapter[];
  difficulty?: string;
  estimatedDuration?: number;
  author?: string;
  category?: string;
  description?: string;
  overview?: string;
  documents?: Document[];
  userProgress: UserProgress;
  isEnrolled: boolean;
  totalCoins: number;
}

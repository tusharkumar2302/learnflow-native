import { USE_MOCK } from "@/config";
import { ICourseService } from "@/services/interfaces/ICourseService";
import { IProgressService } from "@/services/interfaces/IProgressService";
import { IAuthService } from "@/services/interfaces/IAuthService";
import { IWalletService } from "@/services/interfaces/IWalletService";
import { IQuizService } from "@/services/interfaces/IQuizService";
import { MockCourseService } from "@/services/mock/MockCourseService";
import { MockProgressService } from "@/services/mock/MockProgressService";
import { MockAuthService } from "@/services/mock/MockAuthService";
import { MockWalletService } from "@/services/mock/MockWalletService";
import { MockQuizService } from "@/services/mock/MockQuizService";

// Live service stubs — implement when connecting real backend
class LiveCourseService implements ICourseService {
  getCourses = () => { throw new Error("Live course service not implemented"); };
  getCourseById = () => { throw new Error("Live course service not implemented"); };
  searchCourses = () => { throw new Error("Live course service not implemented"); };
  getRecentlyWatched = () => { throw new Error("Live course service not implemented"); };
  enrollCourse = () => { throw new Error("Live course service not implemented"); };
}

class LiveProgressService implements IProgressService {
  getProgress = () => { throw new Error("Live progress service not implemented"); };
  saveProgress = () => { throw new Error("Live progress service not implemented"); };
  markChapterComplete = () => { throw new Error("Live progress service not implemented"); };
  clearProgress = () => { throw new Error("Live progress service not implemented"); };
}

class LiveAuthService implements IAuthService {
  requestOTP = () => { throw new Error("Live auth service not implemented"); };
  verifyOTP = () => { throw new Error("Live auth service not implemented"); };
  getProfile = () => { throw new Error("Live auth service not implemented"); };
  signOut = () => { throw new Error("Live auth service not implemented"); };
}

class LiveWalletService implements IWalletService {
  getWallet = () => { throw new Error("Live wallet service not implemented"); };
}

class LiveQuizService implements IQuizService {
  getWeeklyQuiz = () => { throw new Error("Live quiz service not implemented"); };
  submitWeeklyQuiz = () => { throw new Error("Live quiz service not implemented"); };
  getLeaderboard = () => { throw new Error("Live quiz service not implemented"); };
}

export const courseService: ICourseService = USE_MOCK
  ? new MockCourseService()
  : new LiveCourseService();

export const progressService: IProgressService = USE_MOCK
  ? new MockProgressService()
  : new LiveProgressService();

export const authService: IAuthService = USE_MOCK
  ? new MockAuthService()
  : new LiveAuthService();

export const walletService: IWalletService = USE_MOCK
  ? new MockWalletService()
  : new LiveWalletService();

export const quizService: IQuizService = USE_MOCK
  ? new MockQuizService()
  : new LiveQuizService();

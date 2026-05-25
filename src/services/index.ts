import { LocalCourseService } from "@/services/local/LocalCourseService";
import { LocalProgressService } from "@/services/local/LocalProgressService";
import { LocalAuthService } from "@/services/local/LocalAuthService";
import { LocalWalletService } from "@/services/local/LocalWalletService";
import { LocalQuizService } from "@/services/local/LocalQuizService";
import { LocalLearnService } from "@/services/local/LocalLearnService";

export const courseService = new LocalCourseService();
export const progressService = new LocalProgressService();
export const authService = new LocalAuthService();
export const walletService = new LocalWalletService();
export const quizService = new LocalQuizService();
export const learnService = new LocalLearnService();

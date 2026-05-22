import AsyncStorage from "@react-native-async-storage/async-storage";
import { mockUser, mockAuthToken } from "./data/user";
import { mockCourseSummaries, mockCourseDetails } from "./data/courses";
import { mockWallet } from "./data/wallet";
import { mockChapterProgress, mockRecentChapters } from "./data/progress";
import { mockWeeklyQuiz, mockLeaderboard } from "./data/weeklyQuiz";

// Bump version string to force re-seed when data schema changes
const SEED_VERSION = "zuperlearn_mock_v1";

export async function seedIfNeeded(): Promise<void> {
  try {
    const seeded = await AsyncStorage.getItem(SEED_VERSION);
    if (seeded === "true") return;

    await AsyncStorage.multiSet([
      ["mock_user", JSON.stringify(mockUser)],
      ["mock_auth_token", mockAuthToken],
      ["mock_courses", JSON.stringify(mockCourseSummaries)],
      ["mock_course_details", JSON.stringify(mockCourseDetails)],
      ["mock_wallet", JSON.stringify(mockWallet)],
      ["mock_chapter_progress", JSON.stringify(mockChapterProgress)],
      ["mock_recent_chapters", JSON.stringify(mockRecentChapters)],
      ["mock_weekly_quiz", JSON.stringify(mockWeeklyQuiz)],
      ["mock_leaderboard", JSON.stringify(mockLeaderboard)],
    ]);

    await AsyncStorage.setItem(SEED_VERSION, "true");
  } catch (error) {
    console.error("Seed error:", error);
  }
}

// Call during development to force re-seed on next launch
export async function clearSeed(): Promise<void> {
  if (__DEV__) {
    await AsyncStorage.removeItem(SEED_VERSION);
  }
}

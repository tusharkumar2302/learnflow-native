import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { USE_MOCK } from "@/config";
import { mockUser, mockAuthToken } from "./data/user";
import { mockCourseSummaries, mockCourseDetails } from "./data/courses";
import { mockWallet } from "./data/wallet";
import { mockChapterProgress, mockRecentChapters } from "./data/progress";
import { mockWeeklyQuiz, mockLeaderboard } from "./data/weeklyQuiz";

const SEED_VERSION = "learnflow_mock_v2";

export async function seedIfNeeded(): Promise<void> {
  if (!USE_MOCK) return;

  try {
    const seeded = await AsyncStorage.getItem(SEED_VERSION);
    if (seeded === "true") return;

    // Seed mock auth so app auto-authenticates in demo mode
    await SecureStore.setItemAsync("authToken", mockAuthToken);
    await AsyncStorage.setItem("authToken", mockAuthToken);

    // Seed app data
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

    // Also set authStore name for display
    await AsyncStorage.setItem("mock_user_name", mockUser.name);

    await AsyncStorage.setItem(SEED_VERSION, "true");
  } catch (error) {
    console.error("[SeedService] Failed to seed:", error);
  }
}

// Dev-only: call to force re-seed on next launch
export async function clearSeed(): Promise<void> {
  if (!__DEV__) return;
  await AsyncStorage.removeItem(SEED_VERSION);
  await SecureStore.deleteItemAsync("authToken").catch(() => {});
  await AsyncStorage.removeItem("authToken");
}

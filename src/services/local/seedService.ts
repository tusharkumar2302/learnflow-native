import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { localUser, localAuthToken } from "./data/user";
import { localCourseSummaries, localCourseDetails } from "./data/courses";
import { localWallet } from "./data/wallet";
import { localChapterProgress, localRecentChapters } from "./data/progress";
import { localWeeklyQuiz, localLeaderboard } from "./data/quizzes";

const SEED_VERSION = "zuperlearn_local_v1";

export async function seedIfNeeded(): Promise<void> {
  try {
    const seeded = await AsyncStorage.getItem(SEED_VERSION);
    if (seeded === "true") return;

    await SecureStore.setItemAsync("authToken", localAuthToken);
    await AsyncStorage.setItem("authToken", localAuthToken);

    await AsyncStorage.multiSet([
      ["local_wallet", JSON.stringify(localWallet)],
      ["local_chapter_progress", JSON.stringify(localChapterProgress)],
      ["local_recent_chapters", JSON.stringify(localRecentChapters)],
    ]);

    await AsyncStorage.setItem(SEED_VERSION, "true");
  } catch (error) {
    console.error("[SeedService] Failed to seed:", error);
  }
}

export async function clearSeed(): Promise<void> {
  if (!__DEV__) return;
  await AsyncStorage.removeItem(SEED_VERSION);
  await SecureStore.deleteItemAsync("authToken").catch(() => {});
  await AsyncStorage.removeItem("authToken");
}

export { localUser, localAuthToken, localCourseSummaries, localCourseDetails, localWallet, localChapterProgress, localRecentChapters, localWeeklyQuiz, localLeaderboard };

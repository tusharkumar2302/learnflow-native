import LoadingSpinner from "@/components/common/LoadingSpinner";
import VideoPlayer3 from "@/components/Courses_Player/VideoPlayer3";
import VideoPlayerRNV from "@/components/Courses_Player/VideoPlayerRNV";
import { progressService, walletService } from "@/services";
import { useCourseStore } from "@/stores/courseStore";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle01Icon, HelpCircleIcon } from "@hugeicons/core-free-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const PROGRESS_SYNC_DEBOUNCE_MS = 5000;

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

type VideoScreenParams = {
  videoUrl?: string;
  chapterId?: string;
  thumbnail?: string;
  courseId?: string;
  description?: string;
  title?: string;
  duration?: string;
};

type VideoScreenNavigation = NavigationProp<{
  "Authenticated/VideoScreen": VideoScreenParams;
}>;

export default function VideoScreen() {
  const { chapterId, thumbnail, courseId } = useLocalSearchParams<VideoScreenParams>();
  const navigation = useNavigation<VideoScreenNavigation>();
  const router = useRouter();

  const { currentCourse, currentChapter, updateChapterCompletion } = useCourseStore();

  const [initialPositionMillis, setInitialPositionMillis] = useState<number>(0);
  const [isLoadingChapter, setIsLoadingChapter] = useState<boolean>(true);

  const { height: screenHeight } = useWindowDimensions();

  const lastSyncTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (chapterId) {
      setIsLoadingChapter(true);
      useCourseStore.getState().setCurrentChapter(chapterId);
      setIsLoadingChapter(false);
    }
  }, [chapterId]);

  useEffect(() => {
    if (!currentChapter || !currentCourse || !chapterId) return;
    progressService.updateRecentChapter({
      courseId: currentCourse.id,
      courseTitle: currentCourse.title,
      courseThumbnail: currentCourse.thumbnail ?? null,
      category: currentCourse.category ?? "",
      totalChapters: currentCourse.chapters.length,
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      chapterOrder: currentChapter.order,
      currentTime: currentChapter.currentTime ?? 0,
      progressPercentage: currentCourse.userProgress?.progressPercentage ?? 0,
      lastWatchedAt: new Date().toISOString(),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChapter?.id, currentCourse?.id]);

  const progressKey = React.useMemo(() => {
    return courseId && chapterId ? `videoProgress:${courseId}:${chapterId}` : undefined;
  }, [courseId, chapterId]);

  const loadSavedProgress = useCallback(async () => {
    if (!progressKey) return;
    try {
      const local = await AsyncStorage.getItem(progressKey);
      const parsed = local ? parseInt(local, 10) : 0;
      setInitialPositionMillis(Number.isFinite(parsed) ? parsed : 0);
    } catch {
      setInitialPositionMillis(0);
    }
  }, [progressKey]);

  useEffect(() => {
    loadSavedProgress();
  }, [loadSavedProgress]);

  const syncProgressToBackend = useCallback(
    async (currentTime: number) => {
      if (!chapterId) return;
      lastSyncTimeRef.current = Date.now();
      await progressService.saveProgress(chapterId, currentTime);
    },
    [chapterId]
  );

  const handleVideoProgress = useCallback(
    async (currentTime: number) => {
      if (!courseId || !chapterId) return;
      const roundedMillis = Math.max(0, Math.floor(currentTime * 1000));
      lastProgressRef.current = currentTime;

      if (progressKey) {
        try { await AsyncStorage.setItem(progressKey, String(roundedMillis)); } catch {}
      }

      const now = Date.now();
      const timeSinceLastSync = now - lastSyncTimeRef.current;
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      if (timeSinceLastSync >= PROGRESS_SYNC_DEBOUNCE_MS) {
        syncProgressToBackend(currentTime);
      } else {
        syncTimeoutRef.current = setTimeout(() => {
          syncProgressToBackend(lastProgressRef.current);
        }, PROGRESS_SYNC_DEBOUNCE_MS - timeSinceLastSync) as unknown as NodeJS.Timeout;
      }
    },
    [courseId, chapterId, progressKey, syncProgressToBackend]
  );

  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      if (lastProgressRef.current > 0) syncProgressToBackend(lastProgressRef.current);
    };
  }, [syncProgressToBackend]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", async (e: any) => {
      e.preventDefault();
      if (lastProgressRef.current > 0) await syncProgressToBackend(lastProgressRef.current);
      if (courseId) {
        router.push({
          pathname: "/Authenticated/(tabs)/Courses/CourseDetail",
          params: { id: courseId },
        });
      } else {
        navigation.dispatch(e.data.action);
      }
    });
    return unsubscribe;
  }, [navigation, courseId, syncProgressToBackend, router]);

  const chapterIndex = React.useMemo(() => {
    if (!currentCourse || !currentChapter) return null;
    const index = currentCourse.chapters.findIndex((ch) => ch.id === currentChapter.id);
    return index >= 0 ? index + 1 : null;
  }, [currentCourse, currentChapter]);

  const handleVideoComplete = useCallback(async () => {
    if (!currentChapter || !chapterId || currentChapter.isCompleted) return;
    updateChapterCompletion(chapterId, true);
    await progressService.markChapterComplete(chapterId);
    if ((currentChapter.coinValue ?? 0) > 0) {
      await walletService.addTransaction({
        type: "EARNED",
        amount: currentChapter.coinValue ?? 0,
        note: `${currentChapter.title} — Chapter Complete`,
        course: currentCourse?.title ?? null,
      });
    }
  }, [currentChapter, currentCourse, chapterId, updateChapterCompletion]);

  if (!chapterId || !thumbnail || !courseId) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f6f0ff", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: "#666" }}>
          Missing required parameters
        </Text>
      </View>
    );
  }

  if (!currentChapter || !currentCourse) return <LoadingSpinner size={80} color="#CAA2FC" />;

  if (!currentChapter.videoUrl) {
    if (isLoadingChapter) return <LoadingSpinner size={80} color="#CAA2FC" />;
    return (
      <View style={{ flex: 1, backgroundColor: "#f6f0ff", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: "#666" }}>
          No video available for this chapter
        </Text>
      </View>
    );
  }

  const hasQuiz = currentChapter.quizzes.length > 0;
  const allQuizzesPassed = hasQuiz && currentChapter.quizzes.every((q) => q.userResult?.passed || q.isPassed);

  return (
    <View style={vs.container}>
      {Platform.OS === "ios" ? (
        <VideoPlayerRNV
          key={`video-rnv-${chapterId}-${currentChapter.videoUrl}`}
          videoUrl={currentChapter.videoUrl}
          startPositionMillis={initialPositionMillis}
          onProgress={handleVideoProgress}
          onComplete={handleVideoComplete}
          isCompleted={currentChapter.videoCompleted ?? false}
        />
      ) : (
        <VideoPlayer3
          key={`video-${chapterId}-${currentChapter.videoUrl}`}
          videoUrl={currentChapter.videoUrl}
          startPositionMillis={initialPositionMillis}
          onProgress={handleVideoProgress}
          onComplete={handleVideoComplete}
          isCompleted={currentChapter.videoCompleted ?? false}
        />
      )}

      <ScrollView style={vs.scroll} contentContainerStyle={{ paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        <View style={vs.chapterHeader}>
          <View style={vs.chapterMeta}>
            <Text style={vs.chapterLabel}>
              Ch.{chapterIndex} · {formatDuration(currentChapter.duration)}
              {currentCourse?.title ? `  ·  ${currentCourse.title}` : ""}
            </Text>
          </View>
          <View style={vs.titleRow}>
            <Text style={vs.chapterTitle} numberOfLines={2}>{currentChapter.title}</Text>
            {(currentChapter.coinValue ?? 0) > 0 && (
              <View style={vs.coinPill}>
                <Image source={require("@/assets/icons/CourseVdo/iconLogo.png")} style={vs.coinIcon} />
                <Text style={vs.coinText}>{currentChapter.coinValue}</Text>
              </View>
            )}
          </View>
          <View style={vs.statusRow}>
            {currentChapter.videoCompleted && (
              <View style={vs.statusBadge}>
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} color="#16A34A" strokeWidth={1.5} />
                <Text style={[vs.statusText, { color: "#16A34A" }]}>Watched</Text>
              </View>
            )}
            {hasQuiz && allQuizzesPassed && (
              <View style={vs.statusBadge}>
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={13} color="#16A34A" strokeWidth={1.5} />
                <Text style={[vs.statusText, { color: "#16A34A" }]}>Quiz passed</Text>
              </View>
            )}
            {hasQuiz && !allQuizzesPassed && currentChapter.videoCompleted && (
              <View style={[vs.statusBadge, { backgroundColor: "rgba(86,63,165,0.07)" }]}>
                <HugeiconsIcon icon={HelpCircleIcon} size={13} color="#563FA5" strokeWidth={1.5} />
                <Text style={[vs.statusText, { color: "#563FA5" }]}>Quiz pending</Text>
              </View>
            )}
          </View>
        </View>

        {currentChapter.description ? (
          <View style={vs.descCard}>
            <Text style={vs.descLabel}>About this lesson</Text>
            <Text style={vs.descText}>{currentChapter.description}</Text>
          </View>
        ) : (
          <View style={vs.descCard}>
            <Text style={vs.descText}>Watch the video to complete this chapter and unlock coins.</Text>
          </View>
        )}
      </ScrollView>

      <View style={vs.actions}>
        <Pressable
          onPress={async () => {
            if (lastProgressRef.current > 0) await syncProgressToBackend(lastProgressRef.current);
            if (courseId) {
              router.push({ pathname: "/Authenticated/(tabs)/Courses/CourseDetail", params: { id: courseId } });
            } else {
              router.back();
            }
          }}
          style={vs.backBtn}
        >
          <Text style={vs.backBtnText}>Back</Text>
        </Pressable>

        <Pressable
          onPress={() => { if (currentChapter.videoCompleted) router.push("/Authenticated/SummaryScreen"); }}
          disabled={!currentChapter.videoCompleted}
          style={[vs.summaryBtn, !currentChapter.videoCompleted && vs.disabledBtn]}
        >
          <Text style={[vs.summaryBtnText, !currentChapter.videoCompleted && vs.disabledBtnText]}>
            Chapter Notes
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const vs = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F3FF" },
  scroll: { flex: 1 },
  chapterHeader: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  chapterMeta: { marginBottom: 4 },
  chapterLabel: { fontFamily: "Poppins-Regular", fontSize: 11, color: "rgba(0,0,0,0.38)", letterSpacing: 0.2 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 10 },
  chapterTitle: { fontFamily: "Poppins-SemiBold", fontSize: 17, color: "#0D0D0D", lineHeight: 25, flex: 1 },
  coinPill: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(115,10,150,0.08)", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5, gap: 4, flexShrink: 0, marginTop: 3 },
  coinIcon: { width: 14, height: 14 },
  coinText: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: "#730A96" },
  statusRow: { flexDirection: "row", gap: 8, marginTop: 8, flexWrap: "wrap" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(22,163,74,0.07)", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontFamily: "Poppins-Medium", fontSize: 11 },
  descCard: { marginHorizontal: 16, marginBottom: 12, backgroundColor: "#FFFFFF", borderRadius: 14, padding: 16 },
  descLabel: { fontFamily: "Poppins-SemiBold", fontSize: 12, color: "rgba(0,0,0,0.45)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  descText: { fontFamily: "Teachers-Medium", fontSize: 15, color: "#333", lineHeight: 24 },
  actions: { flexDirection: "row", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 30, backgroundColor: "#F5F3FF", gap: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "rgba(0,0,0,0.06)" },
  backBtn: { flex: 1, paddingVertical: 14, borderRadius: 13, borderWidth: 1, borderColor: "rgba(0,0,0,0.12)", alignItems: "center", backgroundColor: "#fff" },
  backBtnText: { fontFamily: "Poppins-Medium", fontSize: 15, color: "#333" },
  summaryBtn: { flex: 1, paddingVertical: 14, borderRadius: 13, backgroundColor: "#563FA5", alignItems: "center" },
  summaryBtnText: { fontFamily: "Poppins-Medium", fontSize: 15, color: "#FFFFFF" },
  disabledBtn: { backgroundColor: "rgba(0,0,0,0.08)" },
  disabledBtnText: { color: "rgba(0,0,0,0.30)" },
});

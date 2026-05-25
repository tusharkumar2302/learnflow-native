import QuizSheet from "@/components/ui/Learn/QuizSheet";
import { useLesson } from "@/hooks/useLearn";
import { learnService } from "@/lib/services";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArrowLeft01Icon,
  CheckmarkCircle01Icon,
  PlayCircleIcon,
} from "@hugeicons/core-free-icons";
import { StatusBar } from "expo-status-bar";

// How much of the video must be watched before key point fades in (0.0–1.0)
const KEY_POINT_THRESHOLD = 0.70;

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { lesson, isLoading, refresh } = useLesson(lessonId ?? null);

  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [videoComplete, setVideoComplete] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const keyPointOpacity = useRef(new Animated.Value(0)).current;
  const completionOpacity = useRef(new Animated.Value(0)).current;

  const isMountedRef = useRef(true);
  const maxWatchedRef = useRef(0);
  const durationRef = useRef(0);
  const keyPointShownRef = useRef(false);
  const videoFinishedRef = useRef(false);

  const player = useVideoPlayer(lesson?.videoUrl ?? "", (p) => {
    p.loop = false;
    p.volume = 1;
    p.muted = false;
    p.staysActiveInBackground = false;
  });

  const { status } = useEvent(player, "statusChange", { status: player.status });
  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: player.currentTime,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: player.bufferedPosition,
  });

  // Player ready → auto-play
  useEffect(() => {
    if (status === "readyToPlay" && !isPlayerReady && !videoFinishedRef.current) {
      durationRef.current = player.duration;
      setIsPlayerReady(true);
      player.play();
    }

    if (status === "idle" && isPlayerReady && !videoFinishedRef.current) {
      handleVideoEnd();
    }
  }, [status, isPlayerReady]);

  // Track progress, show key point
  useEffect(() => {
    if (!isPlayerReady || currentTime === undefined) return;

    if (currentTime > maxWatchedRef.current) maxWatchedRef.current = currentTime;

    if (!keyPointShownRef.current && durationRef.current > 0) {
      const pct = maxWatchedRef.current / durationRef.current;
      if (pct >= KEY_POINT_THRESHOLD) {
        keyPointShownRef.current = true;
        Animated.timing(keyPointOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }
    }
  }, [currentTime, isPlayerReady]);

  // iOS: playToEnd event
  useEffect(() => {
    if (!player || !isPlayerReady) return;
    const sub = player.addListener("playToEnd", () => {
      if (!videoFinishedRef.current) handleVideoEnd();
    });
    return () => sub.remove();
  }, [player, isPlayerReady]);

  const handleVideoEnd = () => {
    if (videoFinishedRef.current) return;
    videoFinishedRef.current = true;
    try { player.pause(); } catch {}
    setVideoComplete(true);
    // Ensure key point shown on completion
    if (!keyPointShownRef.current) {
      keyPointShownRef.current = true;
      Animated.timing(keyPointOpacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    }
    // Fade in completion overlay
    Animated.timing(completionOpacity, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  };

  const handleMarkComplete = async () => {
    if (!lesson) return;
    await learnService.markLessonComplete(lesson.id);
    if (lesson.quiz) {
      setQuizVisible(true);
    } else {
      setLessonFinished(true);
    }
  };

  const handleQuizPass = async () => {
    if (!lesson) return;
    setQuizVisible(false);
    await learnService.passLessonQuiz(lesson.id);
    await refresh();
    setLessonFinished(true);
  };

  const handleQuizDismiss = () => {
    setQuizVisible(false);
    setLessonFinished(true);
  };

  const handleContinue = () => {
    router.back();
  };

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  if (isLoading || !lesson) {
    return (
      <View style={[s.root, s.centered]}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#A78BFA" />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* ── Video ── */}
      <VideoView
        player={player}
        style={{ width, height }}
        contentFit="cover"
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        requiresLinearPlayback={true}
      />

      {/* ── Loading overlay ── */}
      {!isPlayerReady && (
        <View style={s.loadingOverlay}>
          <ActivityIndicator size="large" color="#A78BFA" />
          <Text style={s.loadingText}>Loading lesson…</Text>
        </View>
      )}

      {/* ── Top bar (always visible) ── */}
      <View style={[s.topBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color="#FFFFFF" strokeWidth={2} />
        </Pressable>

        {/* Concept tags */}
        <View style={s.tagsRow}>
          {lesson.conceptTags.slice(0, 2).map((tag) => (
            <View key={tag} style={s.tag}>
              <Text style={s.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Key point card (fades in at 70%) ── */}
      <Animated.View style={[s.keyPointCard, { opacity: keyPointOpacity, bottom: videoComplete ? 200 : insets.bottom + 32 }]}>
        <Text style={s.keyPointLabel}>KEY POINT</Text>
        <Text style={s.keyPointText}>{lesson.keyPoint}</Text>
      </Animated.View>

      {/* ── Completion overlay ── */}
      {videoComplete && !lessonFinished && (
        <Animated.View style={[s.completionOverlay, { opacity: completionOpacity, paddingBottom: insets.bottom + 24 }]}>
          <View style={s.completionContent}>
            <View style={s.completionIcon}>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={36} color="#A78BFA" strokeWidth={1.5} />
            </View>
            <Text style={s.completionTitle}>Lesson complete!</Text>
            <Text style={s.completionSub} numberOfLines={3}>{lesson.title}</Text>

            {lesson.quiz && (
              <View style={s.coinPreview}>
                <Text style={s.coinPreviewText}>🪙 {lesson.quiz.coinValue} coins for passing the quiz</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleMarkComplete}
              style={s.quizBtn}
              activeOpacity={0.85}
            >
              <Text style={s.quizBtnText}>
                {lesson.quiz ? "Test your knowledge →" : "Mark complete →"}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* ── Finished state (no quiz / after quiz) ── */}
      {lessonFinished && (
        <View style={[s.finishedOverlay, { paddingBottom: insets.bottom + 24 }]}>
          <View style={s.completionContent}>
            <View style={[s.completionIcon, { backgroundColor: "rgba(5,150,105,0.20)" }]}>
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={36} color="#34D399" strokeWidth={1.5} />
            </View>
            <Text style={s.completionTitle}>Well done!</Text>
            <Text style={s.completionSub}>Next lesson is now unlocked.</Text>
            <TouchableOpacity onPress={handleContinue} style={[s.quizBtn, { backgroundColor: "#059669" }]} activeOpacity={0.85}>
              <Text style={s.quizBtnText}>Back to path →</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Quiz sheet ── */}
      {lesson.quiz && (
        <QuizSheet
          quiz={lesson.quiz}
          visible={quizVisible}
          onPass={handleQuizPass}
          onDismiss={handleQuizDismiss}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000000",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0A0614",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.50)",
  },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    gap: 10,
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
    paddingTop: 4,
  },
  tag: {
    backgroundColor: "rgba(124,58,237,0.75)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  keyPointCard: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "rgba(10,6,20,0.82)",
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#A78BFA",
    gap: 6,
    zIndex: 8,
  },
  keyPointLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 9,
    color: "#A78BFA",
    letterSpacing: 1.5,
  },
  keyPointText: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.90)",
    lineHeight: 20,
  },
  completionOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,6,20,0.72)",
    justifyContent: "flex-end",
    zIndex: 20,
  },
  finishedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,6,20,0.82)",
    justifyContent: "flex-end",
    zIndex: 20,
  },
  completionContent: {
    backgroundColor: "#1A0F2E",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  completionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(167,139,250,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  completionTitle: {
    fontFamily: "Teachers-Bold",
    fontSize: 24,
    color: "#FFFFFF",
  },
  completionSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.60)",
    textAlign: "center",
    lineHeight: 20,
  },
  coinPreview: {
    backgroundColor: "rgba(167,139,250,0.12)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  coinPreviewText: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.70)",
  },
  quizBtn: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: "stretch",
    alignItems: "center",
    marginTop: 4,
  },
  quizBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
});

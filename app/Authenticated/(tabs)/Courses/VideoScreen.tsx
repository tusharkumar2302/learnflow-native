import LoadingSpinner from "@/components/common/LoadingSpinner";
import VideoPlayer3 from "@/components/Courses_Player/VideoPlayer3";
import VideoPlayerRNV from "@/components/Courses_Player/VideoPlayerRNV";
import { authStore } from "@/stores/authStore";
import { useCourseStore } from "@/stores/Course/courseStore";
import { Chapter } from "@/types/Course";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
// import { usePreventScreenCapture } from "expo-screen-capture";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

// ============================================================================
// Constants (moved outside component to avoid recreation)
// ============================================================================

// Debounce interval for backend progress sync (in milliseconds)
const PROGRESS_SYNC_DEBOUNCE_MS = 5000;

/**
 * Format file size from bytes to human-readable string
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

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
  // usePreventScreenCapture();
  const { chapterId, thumbnail, courseId } =
    useLocalSearchParams<VideoScreenParams>();
  const navigation = useNavigation<VideoScreenNavigation>();
  const router = useRouter();

  const { token } = authStore();
  const {
    currentCourse,
    currentChapter,
    setCurrentChapter,
    updateChapterCompletion,
  } = useCourseStore();

  const [activeTab, setActiveTab] = useState<"Summary" | "resources">(
    "Summary"
  );
  const [initialPositionMillis, setInitialPositionMillis] = useState<number>(0);
  const [isLoadingChapter, setIsLoadingChapter] = useState<boolean>(true);

  // Use responsive dimensions that update on orientation change
  const { height: screenHeight } = useWindowDimensions();

  // Refs for debounced progress syncing
  const lastSyncTimeRef = useRef<number>(0);
  const lastProgressRef = useRef<number>(0);
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleDocumentDownload = useCallback(
    async (document: NonNullable<Chapter["documents"]>[number]) => {
      try {
        const supported = await Linking.canOpenURL(document.fileUrl);
        if (supported) {
          await Linking.openURL(document.fileUrl);
        } else {
          Alert.alert(
            "Cannot Open Document",
            `Unable to open ${document.title}. The file type may not be supported on this device.`
          );
        }
      } catch {
        Alert.alert("Error", "Failed to open the document. Please try again.");
      }
    },
    []
  );

  const fetchChapterData = useCallback(async () => {
    if (!chapterId || !token) return;

    setIsLoadingChapter(true);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/chapters/${chapterId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const chapterData = res.data.data.chapter;
      console.log("📄 Fetched chapter data:", chapterData);
      console.log("📊 Chapter completion status:", {
        isCompleted: chapterData.isCompleted,
        chapterCompleted: chapterData.chapterCompleted,
        hasQuizzes: chapterData.quizzes?.length > 0,
        quizzes: chapterData.quizzes,
        result: chapterData.quizzes?.map((q: any) => q.userResult).passed,
      });

      if (!chapterData.videoUrl) {
        Alert.alert("Error", "No video URL available for this chapter.");
        return;
      }

      useCourseStore.getState().setCurrentChapterDirect(chapterData);
    } catch {
      Alert.alert("Error", "Failed to load chapter data. Please try again.");
    } finally {
      setIsLoadingChapter(false);
    }
  }, [chapterId, token]);

  useEffect(() => {
    if (chapterId) {
      fetchChapterData();
    }
  }, [chapterId, fetchChapterData]);

  // Local progress helpers
  const progressKey = React.useMemo(() => {
    return courseId && chapterId
      ? `videoProgress:${courseId}:${chapterId}`
      : undefined;
  }, [courseId, chapterId]);

  const loadSavedProgress = useCallback(async () => {
    if (!courseId || !chapterId) return;
    try {
      // Try remote first
      const baseUrl = process.env.EXPO_PUBLIC_API_URL;
      let remoteMillis: number | undefined;
      if (baseUrl && token) {
        try {
          const res = await axios.get(`${baseUrl}/api/video/progress`, {
            params: { courseId, chapterId },
            headers: { Authorization: `Bearer ${token}` },
          });
          const m = res?.data?.data?.positionMillis;
          if (typeof m === "number" && m >= 0) remoteMillis = m;
        } catch {
          // ignore remote errors
        }
      }

      if (typeof remoteMillis === "number") {
        setInitialPositionMillis(remoteMillis);
        if (progressKey)
          await AsyncStorage.setItem(progressKey, String(remoteMillis));
        return;
      }

      // Fallback to local
      if (progressKey) {
        const local = await AsyncStorage.getItem(progressKey);
        const parsed = local ? parseInt(local, 10) : 0;
        setInitialPositionMillis(Number.isFinite(parsed) ? parsed : 0);
      }
    } catch {
      setInitialPositionMillis(0);
    }
  }, [courseId, chapterId, progressKey, token]);

  useEffect(() => {
    loadSavedProgress();
  }, [loadSavedProgress]);

  // Separate function for backend sync to keep handleVideoProgress clean
  const syncProgressToBackend = useCallback(
    async (currentTime: number) => {
      if (!chapterId || !token) return;

      lastSyncTimeRef.current = Date.now();

      try {
        const baseUrl = process.env.EXPO_PUBLIC_API_URL;
        if (baseUrl) {
          await axios.put(
            `${baseUrl}/api/user/chapters/${chapterId}/progress`,
            {
              currentTime: currentTime,
              completed: false,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
      } catch (error: any) {
        console.error(
          "❌ Failed to save progress:",
          error.response?.data || error.message
        );
      }
    },
    [chapterId, token]
  );

  const handleVideoProgress = useCallback(
    async (currentTime: number) => {
      if (!courseId || !chapterId) return;

      const roundedMillis = Math.max(0, Math.floor(currentTime * 1000));
      lastProgressRef.current = currentTime;

      // Save locally for instant resume (this is fast, do it every time)
      if (progressKey) {
        try {
          await AsyncStorage.setItem(progressKey, String(roundedMillis));
        } catch {}
      }

      // Debounce backend sync to avoid excessive API calls
      const now = Date.now();
      const timeSinceLastSync = now - lastSyncTimeRef.current;

      // Clear any pending sync timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }

      // If enough time has passed, sync immediately
      if (timeSinceLastSync >= PROGRESS_SYNC_DEBOUNCE_MS) {
        syncProgressToBackend(currentTime);
      } else {
        // Schedule a sync for later to ensure we don't miss the final position
        syncTimeoutRef.current = setTimeout(() => {
          syncProgressToBackend(lastProgressRef.current);
        }, PROGRESS_SYNC_DEBOUNCE_MS - timeSinceLastSync) as unknown as NodeJS.Timeout;
      }
    },
    [courseId, chapterId, progressKey, syncProgressToBackend]
  );

  // Cleanup effect: sync final progress and clear timeout on unmount
  useEffect(() => {
    return () => {
      // Clear any pending sync timeout
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      // Sync final progress on unmount
      if (lastProgressRef.current > 0) {
        syncProgressToBackend(lastProgressRef.current);
      }
    };
  }, [syncProgressToBackend]);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      "beforeRemove",
      async (e: any) => {
        e.preventDefault();

        // Sync final progress before leaving
        if (lastProgressRef.current > 0) {
          await syncProgressToBackend(lastProgressRef.current);
        }

        if (courseId) {
          router.push({
            pathname: "/Authenticated/(tabs)/Courses/CouseVideos",
            params: { id: courseId },
          });
        } else {
          navigation.dispatch(e.data.action);
        }
      }
    );
    return unsubscribe;
  }, [navigation, courseId, syncProgressToBackend, router]);

  // handleNextVideo is kept for potential future use but currently unused
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleNextVideo = useCallback(async () => {
    if (!courseId || !chapterId || !currentCourse || !currentChapter) return;

    if (!currentChapter.isCompleted) {
      Alert.alert(
        "Incomplete Chapter",
        "Please complete the current chapter before proceeding."
      );
      return;
    }

    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/courses/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const courseData = res.data.data;
      const currentIndex = courseData.chapters.findIndex(
        (ch: Chapter) => ch.id === chapterId
      );
      const nextChapter: Chapter | undefined =
        courseData.chapters[currentIndex + 1];

      if (nextChapter) {
        const nextChapterRes = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/user/chapters/${nextChapter.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const nextChapterData = nextChapterRes.data.data;

        navigation.setParams({
          chapterId: nextChapterData.id,
          thumbnail: courseData.thumbnail ?? "",
          courseId,
          title: courseData.title,
          description: courseData.description ?? courseData.overview ?? "",
          duration: nextChapterData.duration.toString(),
        });
        setCurrentChapter(nextChapterData.id);
        // Modal is commented out, so no need to call setShowModal
      } else {
        // Modal is commented out, so no need to call setShowModal
        router.push({
          pathname: "/Authenticated/(tabs)/Coins",
          params: { id: courseId, screenType: "courseComplete" },
        });
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to load the next chapter. Please try again."
      );
    }
  }, [
    currentCourse,
    currentChapter,
    chapterId,
    courseId,
    token,
    setCurrentChapter,
    navigation,
    router,
  ]);

    const chapterIndex = React.useMemo(() => {
  if (!currentCourse || !currentChapter) return null;

  const index = currentCourse.chapters.findIndex(
    (ch: Chapter) => ch.id === currentChapter.id
  );

  return index >= 0 ? index + 1 : null;
}, [currentCourse, currentChapter]);

  const handleVideoComplete = useCallback(async () => {
    console.log("🎯 handleVideoComplete called!");
    console.log("Current chapter:", currentChapter);
    console.log("Chapter ID:", chapterId);

    if (!currentChapter || !chapterId) {
      console.log("⚠️ Exiting early - missing chapter or chapterId:", {
        hasCurrentChapter: !!currentChapter,
        hasChapterId: !!chapterId,
      });
      return;
    }

    if (currentChapter.isCompleted) {
      console.log("⚠️ Video already marked as completed");

      const hasUnpassedQuizzes = currentChapter.quizzes.some(
        (q) => !q.userResult?.passed
      );

      if (hasUnpassedQuizzes) {
        console.log("📝 Has unpassed quizzes - user should complete them");
        // TODO: Uncomment when modal is re-enabled
        // setShowModal(true);
        return;
      }

      // FIXED: No auto-advance; stay on completed video
      console.log("✅ Chapter already complete - staying on video");
      return;
    }

    try {
      console.log("🔄 Calling chapter complete API...");
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/chapters/${chapterId}/watch`,
        { completed: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Chapter completion API response:", response.data);

      updateChapterCompletion(chapterId, true);

      await fetchChapterData();

      // Check if there are quizzes to take
      const hasQuizzes =
        currentChapter.quizzes && currentChapter.quizzes.length > 0;
      const allQuizzesPassed = currentChapter.quizzes?.every(
        (q) => q.userResult?.passed
      );

      console.log("Quiz status:", {
        hasQuizzes,
        allQuizzesPassed,
        quizzes: currentChapter.quizzes,
      });

      if (hasQuizzes && !allQuizzesPassed) {
        console.log("📝 Has quizzes to complete");
        // TODO: Uncomment when modal is re-enabled
        // setShowModal(true);
      } else {
        // FIXED: No auto-advance; log completion and stay
        console.log("✅ Video completed - staying on chapter for review");
        // handleNextVideo(); // Commented out to prevent auto-advance
      }
    } catch (error: any) {
      console.error("❌ Error marking chapter as completed:", error);
      console.error("Error response:", error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to mark chapter as completed. Please try again."
      );
    }
  }, [
    currentChapter,
    chapterId,
    token,
    updateChapterCompletion,
    // handleNextVideo, // Removed dependency
    fetchChapterData,
  ]);

  if (!chapterId || !thumbnail || !courseId) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f6f0ff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: "#666" }}
        >
          Missing required parameters
        </Text>
      </View>
    );
  }

  if (!currentChapter || !currentCourse) {
    return <LoadingSpinner size={80} color="#CAA2FC" />;
  }

  // Show loader while fetching chapter data, not the error message
  if (!currentChapter.videoUrl) {
    if (isLoadingChapter) {
      return <LoadingSpinner size={80} color="#CAA2FC" />;
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#f6f0ff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{ fontFamily: "Poppins-Medium", fontSize: 16, color: "#666" }}
        >
          No video available for this chapter
        </Text>
      </View>
    );
  }


  return (
    <View style={{ flex: 1, backgroundColor: "#E5E8F1", position: "relative" }}>
      {/* Use react-native-video on iOS for reliable completion detection */}
      {/* Use expo-video on Android where it works correctly */}
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

      {/* <VideoPlayer
        ref={videoRef}
        videoUrl={currentChapter.videoUrl}
        chapter={currentChapter}
        onVideoComplete={handleVideoComplete}
        onVideoProgress={handleVideoProgress}
        startPositionMillis={initialPositionMillis}
      /> */}
      <ScrollView style={{ paddingHorizontal: 12, paddingVertical: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ width: "70%" }}>
            <Text
              numberOfLines={3}
              style={{
                fontFamily: "Poppins-Medium",
                fontSize: 18,
                marginVertical: 8,
                marginRight: 2,
              }}
            >
             {`Chapter ${chapterIndex}: ${currentChapter.title}`}
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#FFFFFF73",
            borderRadius: 16,
            paddingVertical: 12,
            minHeight: "30%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#E5E5E5",
            }}
          >
            <TouchableOpacity
              onPress={() => setActiveTab("Summary")}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: activeTab === "Summary" ? 2 : 0,
                borderBottomColor: "#730A96",
              }}
            >
              <Text
                style={{
                  fontFamily: "HelveticaNeue",
                  fontSize: 14,
                  color: activeTab === "Summary" ? "#000000" : "#00000059",
                  fontWeight: activeTab === "Summary" ? "600" : "400",
                }}
              >
                Overview
              </Text>
            </TouchableOpacity>

            {/* No resources for now  */}

            {/* <TouchableOpacity
              onPress={() => setActiveTab("resources")}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: activeTab === "resources" ? 2 : 0,
                borderBottomColor: "#730A96",
              }}
            >
              <Text
                style={{
                  fontFamily: "HelveticaNeue",
                  fontSize: 14,
                  color: activeTab === "resources" ? "#000000" : "#00000059",
                  fontWeight: activeTab === "resources" ? "600" : "400",
                }}
              >
                Resources ({currentChapter.documents?.length || 0})
              </Text>
            </TouchableOpacity> */}
          </View>

          <View style={{ padding: 16 }}>
            {activeTab === "Summary" ? (
              <View style={{ borderRadius: 15, height: 0.31 * screenHeight }}>
                <Text className="font-teachers-medium text-[#0000008C] text-[16px] leading-[27px]">
                  {currentChapter.description}
                </Text>
              </View>
            ) : (
              <View>
                {currentChapter.documents &&
                currentChapter.documents.length > 0 ? (
                  currentChapter.documents.map((document) => (
                    <TouchableOpacity
                      key={document.id}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        backgroundColor: "#F8F9FA",
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                      onPress={() => handleDocumentDownload(document)}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          backgroundColor: "#730A96",
                          borderRadius: 8,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 12,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: "600",
                          }}
                        >
                          {document.fileType.toUpperCase()}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "500",
                            color: "#333",
                            marginBottom: 4,
                          }}
                        >
                          {document.title}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#666",
                          }}
                        >
                          {formatFileSize(document.fileSize)} •{" "}
                          {document.uploadedAt
                            ? new Date(document.uploadedAt).toLocaleDateString()
                            : "Unknown"}
                        </Text>
                      </View>
                      <AntDesign name="download" size={20} color="#730A96" />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View
                    style={{
                      alignItems: "center",
                      paddingVertical: 40,
                    }}
                  >
                    <AntDesign name="filetext1" size={48} color="#CCC" />
                    <Text
                      style={{
                        marginTop: 12,
                        fontSize: 16,
                        color: "#666",
                        textAlign: "center",
                      }}
                    >
                      No resources available for this chapter
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      {/* Bottom Buttons */}
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 25,
          backgroundColor: "#E5E8F1",
          gap: 12,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,

            borderRadius: 13,
            borderWidth: 1,
            borderColor: "#00000026",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 16,
              color: "#000000",
            }}
          >
            Back
          </Text>
        </Pressable>

        <Pressable
          onPress={() => {
            // if (!currentChapter.isCompleted) return;
            router.push("/Authenticated/SummaryScreen");
          }}
          disabled={!currentChapter.isCompleted}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: !currentChapter.isCompleted
              ? "#CCCCCC"
              : "#563FA5",
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
            opacity: !currentChapter.isCompleted ? 0.6 : 1,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 16,
              color: !currentChapter.isCompleted ? "#666666" : "#FFFFFF",
            }}
          >
            View Summary
          </Text>
        </Pressable>
      </View> */}

      {/* Bottom Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 25,
          backgroundColor: "#E5E8F1",
          gap: 12,
        }}
      >
        {/* Back Button */}
        <Pressable
          onPress={async () => {
            // Sync final progress before leaving
            if (lastProgressRef.current > 0) {
              await syncProgressToBackend(lastProgressRef.current);
            }
            if (courseId) {
              router.push({
                pathname: "/Authenticated/(tabs)/Courses/CouseVideos",
                params: { id: courseId },
              });
            } else {
              router.back();
            }
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 13,
            borderWidth: 1,
            borderColor: "#00000026",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 16,
              color: "#000000",
            }}
          >
            Back
          </Text>
        </Pressable>

        {/* View Summary Button - FIXED: Only enable after video completion */}
        <Pressable
          onPress={() => {
            if (currentChapter.videoCompleted) {
              router.push("/Authenticated/SummaryScreen");
            }
          }}
          disabled={!currentChapter.videoCompleted}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 20,
            backgroundColor: currentChapter.videoCompleted
              ? "#563FA5"
              : "#CCCCCC",
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
            opacity: currentChapter.videoCompleted ? 1 : 0.6,
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Medium",
              fontSize: 16,
              color: currentChapter.videoCompleted ? "#FFFFFF" : "#666666",
            }}
          >
            View Summary
          </Text>
        </Pressable>
      </View>
      {/* {showModal && (
        <ProcessToQuizPopUp
          coins={
            currentChapter.quizzes[0]?.coinValue ??
            currentChapter.coinValue ??
            0
          }
          onStartQuiz={() => {
            router.push({
              pathname: "/Authenticated/QuizesPoint/HowQuizWorks",
              params: {
                coins:
                  currentChapter.quizzes[0]?.coinValue ??
                  currentChapter.coinValue ??
                  0,
                quizData: JSON.stringify({ quizzes: currentChapter.quizzes }),
                quizId: currentChapter.quizzes[0]?.id,
              },
            });
          }}
        />
      )} */}
    </View>
  );
}

import { authStore } from "@/stores/authStore";
import currentVid from "@/stores/currentVid";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

interface Course {
  id: string;
  title: string;
  description: string;
  overview: string;
  thumbnail: string;
  category: string;
  tags: string[];
  author: string;
  price: number;
  difficulty: string;
  isPublished: boolean;
  estimatedDuration: number;
  createdAt: string;
  updatedAt: string;
  chapters: { id: string; title: string; duration: number }[];
  totalCoins: number;
}

interface LastWatchedChapter {
  id: string;
  title: string;
  courseId: string;
}

interface CourseProgress {
  course: Course;
  lastWatchedChapter: LastWatchedChapter;
  lastWatchedAt: string;
  currentTime: number;
  isCompleted: boolean;
  progress: {
    totalChapters: number;
    completedChapters: number;
    videosWatched: number;
    videoProgressPercentage: number;
    chapterProgressPercentage: number;
    totalQuizzes: number;
    completedQuizzes: number;
    quizProgressPercentage: number;
  };
}

const ContinueWatchingCard = ({
  continueTxt = true,
}: {
  continueTxt?: boolean;
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const cardHeight = screenHeight * 0.16;
  const totalSectionHeight = cardHeight + screenHeight * 0.05;
  const router = useRouter();
  const { token } = authStore();
  const { setVidId } = currentVid();
  const [activeCourse, setActiveCourse] = useState(false);
  const [vidData, setVidData] = useState<CourseProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFetchingRef = useRef(false);

  const fetchVid = useCallback(async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/recently-watched?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        }
      );

      const arr = res.data?.data ?? [];
      console.log("Fetched Recently Watched Videos:", arr);
      if (arr.length > 0) {
        const validatedData = arr.map((item: any) => ({
          ...item,
          progress: item.progress || {
            totalChapters: 0,
            completedChapters: 0,
            videosWatched: 0,
            videoProgressPercentage: 0,
            chapterProgressPercentage: 0,
            totalQuizzes: 0,
            completedQuizzes: 0,
            quizProgressPercentage: 0,
          },
        }));
        setVidData(validatedData);
        setActiveCourse(true);
      } else {
        setVidData([]);
        setActiveCourse(false);
      }
    } catch (err) {
      console.error(err);
      setVidData([]);
      setActiveCourse(false);
    } finally {
      isFetchingRef.current = false;
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      if (token) fetchVid();
    }, [token])
  );

  // FIXED: Calculate display progress based on actual completion state
  const calculateDisplayProgress = (item: CourseProgress) => {
    const { progress } = item;

    // Check if ALL chapters are truly completed (video watched AND all quizzes passed)
    // The backend returns chapterProgressPercentage which accounts for BOTH video + quiz completion
    const allChaptersFullyCompleted =
      progress.completedChapters === progress.totalChapters;

    if (allChaptersFullyCompleted) {
      return 100;
    }

    // Otherwise, calculate weighted progress:
    // - Video watching contributes 70%
    // - Quiz completion contributes 30%
    const videoWeight = 0.7;
    const quizWeight = 0.3;

    const videoContribution = progress.videoProgressPercentage * videoWeight;
    const quizContribution = progress.quizProgressPercentage * quizWeight;

    return Math.round(videoContribution + quizContribution);
  };

  // Alternative simpler approach - just use the backend's chapterProgressPercentage
  // since it already accounts for both video AND quiz completion:
  const calculateDisplayProgressSimple = (item: CourseProgress) => {
    // The backend's chapterProgressPercentage already factors in:
    // - Video must be watched (90% threshold)
    // - All quizzes must be passed
    // So we can use it directly
    return Math.round(item.progress.chapterProgressPercentage);
  };
  if (isLoading) {
    return (
      <View
        className="mt-2 self-center mb-[20px]"
        style={{ width: screenWidth * 0.875, height: totalSectionHeight }}
      >
        {continueTxt && (
          <Text
            className="mb-2"
            style={{
              fontFamily: "Teachers-Medium",
              fontWeight: "500",
              fontSize: 18,
            }}
          >
            Continue Watching
          </Text>
        )}

        <FlashList
          data={[1, 2, 3]} // three skeleton items
          horizontal
          renderItem={() => (
            <View
              className="bg-white p-[2px] rounded-[15px] flex-row"
              style={{
                width: screenWidth * 0.875,
                height: screenHeight * 0.19,
                marginRight: 12,
              }}
            >
              {/* Thumbnail skeleton */}
              <View className="w-[50%] h-full p-2">
                <View className="h-full w-full bg-gray-200 rounded-md animate-pulse" />
              </View>

              {/* Right side skeleton */}
              <View className="w-[50%] h-full flex-col gap-2 p-2">
                <View className="h-4 w-[80%] bg-gray-200 rounded-md animate-pulse" />
                <View className="h-4 w-[60%] bg-gray-200 rounded-md animate-pulse" />

                <View className="w-full h-[8px] bg-gray-200 rounded-md animate-pulse" />

                <View className="flex-row justify-between mt-1">
                  <View className="h-3 w-16 bg-gray-200 rounded-md animate-pulse" />
                  <View className="h-3 w-10 bg-gray-200 rounded-md animate-pulse" />
                </View>

                <View className="h-4 w-20 bg-gray-200 rounded-md animate-pulse mt-2" />
              </View>
            </View>
          )}
        />
      </View>
    );
  }

  return vidData && vidData.length !== 0 ? (
    <View
      className="mt-2 mb-[10px] self-center relative"
      style={{ width: screenWidth * 0.875, height: totalSectionHeight }}
    >
      {continueTxt && (
        <Text
          className="mb-1"
          style={{
            fontFamily: "Teachers-Medium",
            fontWeight: "500",
            fontSize: 18,
          }}
        >
          Continue Watching
        </Text>
      )}
      <FlashList
        data={vidData}
        horizontal
        pagingEnabled
        keyExtractor={(item, index) =>
          `${item.course.id}-${item.lastWatchedAt}-${index}`
        }
        style={{ backgroundColor: "transparent" }}
        extraData={vidData}
        renderItem={({ item }) => {
          // FIXED: Use the dynamic progress calculation
          const progress = calculateDisplayProgress(item);

          return (
            <View
              className="mt-2 mb-[20px] self-center"
              style={{
                width: screenWidth * 0.875,
                height: screenHeight * 0.19,
              }}
            >
              <Pressable
                style={{ width: "100%" }}
                onPress={() => {
                  setVidId(item.course.id);
                  router.push({
                    pathname: "/Authenticated/(tabs)/Courses/CouseVideos",
                    params: { id: item.course.id },
                  });
                }}
              >
                <View className="bg-white p-[2px] h-full w-full flex-row items-center justify-center rounded-[15px]">
                  <View className="w-[50%] h-full p-2">
                    <Image
                      source={{ uri: item.course.thumbnail }}
                      className="h-full w-full rounded-md"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="w-[50%] h-full flex-col gap-1 p-2">
                    <Text
                      className="font-poppins-medium"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={{ fontSize: screenHeight * 0.016 }}
                    >
                      {item.course.title}
                    </Text>
                    <View className="w-full h-[8px] bg-[#ECE9F4] rounded-[8px] flex justify-center px-[1px]">
                      <View
                        style={{
                          width: `${Math.min(100, Math.max(0, progress))}%`,
                          height: 6,
                          backgroundColor:
                            progress === 100 ? "#4ACC48" : "#730A96",
                          borderRadius: 4,
                        }}
                      />
                    </View>
                    <View className="flex flex-row justify-between w-full">
                      <Text className="font-teachers-medium text-[#0000008C]">
                        Progress
                      </Text>
                      <Text className="font-teachers-medium text-[#0000008C]">
                        {progress}%
                      </Text>
                    </View>
                    <View className="flex flex-row items-center">
                      <Image
                        source={require("@/assets/icons/Coins/coin.png")}
                        className="h-5 w-4 mr-1"
                      />
                      <Text className="font-teachers-semibold text-[#730A96]">
                        {item.course.totalCoins || 0} coins
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  ) : (
    <View
      className="mt-2 self-center mb-[20px]"
      style={{ width: screenWidth * 0.875, height: totalSectionHeight }}
    >
      {continueTxt && (
        <Text
          className="mb-2"
          style={{
            fontFamily: "Teachers-Medium",
            fontWeight: "500",
            fontSize: 18,
          }}
        >
          Continue Watching
        </Text>
      )}
      <View className="bg-white flex-1 w-full flex items-center justify-center rounded-[15px]">
        <Image
          source={require("@/assets/icons/Coins/no-coin.png")}
          style={{ height: "50%", width: "50%" }}
          resizeMode="contain"
        />
        <Text
          className="font-teachers-medium text-[#0000008C]"
          style={{ fontSize: 0.016 * screenHeight }}
        >
          No Active Course right now
        </Text>
      </View>
    </View>
  );
};

export default ContinueWatchingCard;

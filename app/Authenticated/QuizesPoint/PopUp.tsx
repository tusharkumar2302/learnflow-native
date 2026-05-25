import PopUpBg from "@/components/Courses_Player/PopUpBg";
import { useCourseStore } from "@/stores/Course/courseStore";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PopUpProps = {
  coins: string | string[];
  onClose: () => void;
  score: number;
  total: number;
};

const PopUp = ({ coins, onClose, score, total }: PopUpProps) => {
  const [isPassed, setIsPassed] = useState(false);
  const { currentCourse, currentChapter, setCurrentChapterDirect } =
    useCourseStore();
  const [color, setColor] = useState("red");
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  const router = useRouter();
  const percentage = total > 0 ? (score / total) * 100 : 0;

  // Determine if the current chapter is the last one
  const isLastChapter = currentCourse?.chapters
    ? currentCourse.chapters.findIndex((ch) => ch.id === currentChapter?.id) ===
      currentCourse.chapters.length - 1
    : false;

  useEffect(() => {
    // Pass only if all answers are correct
    if (score === total && total > 0) {
      setIsPassed(true);
      setColor("#22c55e"); // Green for pass
    } else {
      setIsPassed(false);
      setColor("red"); // Red for fail
    }
  }, [score, total]);

  const handleNextChapter = () => {
    if (!currentCourse || !currentChapter?.id) {
      Alert.alert("Error", "Missing course or chapter data.");
      return;
    }

    const currentIndex = currentCourse.chapters.findIndex(
      (ch) => ch.id === currentChapter.id
    );
    const nextChapter = currentCourse.chapters[currentIndex + 1];

    if (nextChapter) {
      // Update currentChapter in the store
      setCurrentChapterDirect(nextChapter);
      onClose();
      router.push({
        pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
        params: {
          chapterId: nextChapter.id,
          thumbnail: currentCourse.thumbnail ?? "",
          courseId: currentCourse.id,
          title: currentCourse.title,
          description:
            currentCourse.description ?? currentCourse.overview ?? "",
          duration: nextChapter.duration.toString(),
        },
      });
    } else {
      onClose();
      router.push({
        pathname: "/Authenticated/(tabs)/Coins",
        params: { id: currentCourse.id, screenType: "courseComplete" },
      });
    }
  };

  return (
    <PopUpBg>
      <View style={styles.container}>
        <View className="w-[40%] bg-[#00000040] self-center h-[6px] rounded-md"></View>
        <View className="relative">
          <Image
            source={require("@/assets/icons/HowItWorks/coins-icon.png")}
            className="my-10 z-20"
            style={{ width: screenWidth * 0.4, height: screenHeight * 0.148 }}
            resizeMode="contain"
          />
          <Image
            className="absolute bottom-10 right-10 z-10"
            source={require("@/assets/icons/Coins/coin.png")}
          />
        </View>

        <Text className="text-black font-helvetica-bold text-[20px] text-center">
          {isPassed ? "Quiz Completed!" : "Quiz Failed!"}
        </Text>

        <View style={styles.info}>
          <Text style={styles.description}>
            {isPassed
              ? "You have earned Zuper Coins"
              : "You need to answer all questions correctly to pass the quiz."}
          </Text>
        </View>

        <View style={styles.scoreContainer}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreText}>Your Score:</Text>
            <Text style={[styles.scoreValue, { color: color }]}>
              {score}/{total} ({percentage.toFixed(0)}%)
            </Text>
          </View>

          <View style={[styles.progressBar, { overflow: "hidden" }]}>
            <View
              style={{
                width: `${Math.min(100, Math.max(0, percentage))}%`,
                height: "100%",
                backgroundColor: color,
                borderRadius: 4,
              }}
            />
          </View>
        </View>

        {isPassed && (
          <View style={styles.bannerWrapper}>
            <View style={styles.bannerLeft}>
              <Image
                source={require("@/assets/icons/Coins/coin.png")}
                style={styles.coinImage}
              />
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Coins Earned</Text>
                <Text style={styles.bannerDescription}>
                  Added to your Wallet
                </Text>
              </View>
            </View>
            <Text style={styles.rewardAmount}>+{coins}</Text>
          </View>
        )}

        {isPassed ? (
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => {
                onClose();
                router.push("/Authenticated/(tabs)/Coins");
              }}
              style={styles.reviewButton}
            >
              <Text style={styles.reviewButtonText}>Go to Wallet</Text>
            </Pressable>
            {isLastChapter ? (
              <></>
            ) : (
              <TouchableOpacity
                onPress={handleNextChapter}
                style={styles.walletButton}
              >
                <Text style={styles.walletButtonText}>Next Chapter</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                if (!currentChapter?.id || !currentCourse?.id) {
                  Alert.alert("Error", "Cannot navigate to video. Missing course or chapter data.");
                  return;
                }
                onClose();
                router.push({
                  pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
                  params: {
                    chapterId: currentChapter.id,
                    thumbnail: currentCourse.thumbnail ?? "",
                    courseId: currentCourse.id,
                    title: currentCourse.title,
                    description: currentCourse.description ?? currentCourse.overview ?? "",
                    duration: currentChapter.duration.toString(),
                  },
                });
              }}
              style={styles.walletButton}
            >
              <Text style={styles.walletButtonText}>Watch Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </PopUpBg>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    minHeight: 500,
  },
  info: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  description: {
    color: "#0000008C",
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Teachers-Medium",
    textAlign: "center",
    lineHeight: 22,
    marginTop: 4,
  },
  scoreContainer: {
    width: "100%",
    backgroundColor: "#f9fafc",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  scoreBox: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 12,
    backgroundColor: "#E5E5E5",
  },
  bannerWrapper: {
    backgroundColor: "#F3F0FF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: "100%",
  },
  bannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  coinImage: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  bannerDescription: {
    fontSize: 12,
    color: "#6C6C6C",
  },
  rewardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6C3CFF",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    gap: 12,
  },
  reviewButton: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#00000026",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  walletButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#563FA5",
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  walletButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
});

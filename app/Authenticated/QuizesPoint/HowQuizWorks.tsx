import QuizHeader from "@/components/Quiz/Header";
import { useCourseStore } from "@/stores/courseStore";
import quizStore from "@/stores/quizStore";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface QuizParams {
  coins?: string;
  quizId?: string;
}

export default function HowQuizWorks() {
  const { coins } = useLocalSearchParams();
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  const router = useRouter();
  const { currentCourse } = useCourseStore();
  const { pendingQuiz } = quizStore();

  const currentQuiz = pendingQuiz?.quiz ?? null;
  const quizId = pendingQuiz?.quizId ?? null;
  const coinValue = pendingQuiz?.coinValue ?? Number(coins) ?? 0;
  const totalScore = coinValue;

  const passScore = currentQuiz?.passScore ?? 0;
  const questions = currentQuiz?.questions ?? [];

  if (!currentQuiz || !quizId) {
    return (
      <View className="flex-1 bg-[#E5E8F1] justify-center items-center">
        <Text className="text-[#666] text-[16px] font-helveticaNeue">
          Invalid quiz data
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#E5E8F1]">
      <View
        className="self-center w-full"
        style={{ width: screenWidth * 0.875 }}
      >
        <QuizHeader
          score={0}
          title={currentCourse?.title ?? ""}
          onBack={() => {
            router.back();
          }}
          totalScore={totalScore}
        />
      </View>
      {currentQuiz?.userResult?.passed ? (
        <View className="mt-16">
          <View
            className="bg-white self-center px-8 rounded-2xl py-2 items-center"
            style={{ width: screenWidth * 0.875 }}
          >
            <View className="w-[40%] bg-[#00000040] self-center h-[6px] rounded-md" />
            <View className="relative">
              <Image
                source={require("@/assets/icons/HowItWorks/coins-icon.png")}
                className="my-10 z-20"
                style={{
                  width: screenWidth * 0.4,
                  height: screenHeight * 0.148,
                }}
                resizeMode="contain"
              />
              <Image
                className="absolute bottom-10 right-10 z-10"
                source={require("@/assets/icons/Coins/coin.png")}
              />
            </View>

            <Text className="text-black font-helvetica-bold text-[20px] text-center">
              Quiz Completed!
            </Text>
            <View style={styles.info}>
              <Text style={styles.description}>
                You have earned Zuper Coins
              </Text>
            </View>

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
          </View>
        </View>
      ) : (
        <View className="mt-16">
          <View
            className="bg-white self-center px-8 rounded-2xl py-2 items-center"
            style={{ width: screenWidth * 0.875 }}
          >
            <View className="w-[40%] bg-[#00000040] self-center h-[6px] rounded-md" />
            <View className="relative">
              <Image
                source={require("@/assets/icons/HowItWorks/coins-icon.png")}
                className="my-10 z-20"
                style={{
                  width: screenWidth * 0.4,
                  height: screenHeight * 0.148,
                }}
                resizeMode="contain"
              />
              <Image
                className="absolute bottom-10 right-10 z-10"
                source={require("@/assets/icons/Coins/coin.png")}
              />
            </View>

            <Text className="text-black font-helvetica-bold text-[20px] text-center">
              How Quiz Works?
            </Text>
            {/*<Text className="text-[#0000007c] text-[14px] text-center font-helveticaNeue px-2 pt-1">
            You have to pass the quiz with minimum {currentQuiz.passScore}%
            correct answers
          </Text>*/}
            <View className="flex-row justify-between w-[94%] mt-3">
              <Text className="font-teachers-medium text-[16px]">
                You have to pass:
              </Text>
              <Text className="text-[#5cb44a] font-semibold text-[13px]">
                {Math.max(
                  1,
                  Math.ceil((passScore / 100) * questions.length)
                )}{" "}
                / {questions.length} ({passScore}%)
              </Text>
            </View>

            <View className="w-[94%] bg-[#0000000b] h-[7px] mt-1 mb-3 rounded-md justify-center">
              <View
                className="bg-[#5cb44a] h-[4px] rounded-md"
                style={{ width: `${passScore}%` }}
              />
            </View>

            <View className="flex-row justify-between px-3 py-4 bg-[#E5E8F1] rounded-lg w-full">
              <View className="flex-row items-center">
                <Image
                  source={require("@/assets/icons/Coins/coin.png")}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
                <View className="flex-col">
                  <Text className="font-semibold text-[12px] text-black">
                    You'll earn coins
                  </Text>
                  <Text className="font-semibold text-[12px] text-[#00000085]">
                    Added to your Wallet
                  </Text>
                </View>
              </View>
              <View className="justify-center">
                <Text className="text-[#563FA5] text-[16px] font-semibold">
                  +{coinValue}
                </Text>
              </View>
            </View>
            <View className="flex-row w-full justify-between mb-4">
              <Pressable
                onPress={() => router.back()}
                className="border-[1px] border-[#00000026] rounded-[13px] px-5 py-2 mr-3 mt-4 w-[48%]"
              >
                <Text className="py-2 text-center">Back</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/Authenticated/QuizesPoint/Quiz",
                    params: { coins: coinValue.toString(), quizId },
                  });
                }}
                className="bg-[#563FA5] rounded-[13px] px-5 py-2 mr-3 mt-4 w-[48%]"
              >
                <Text className="text-white py-2 text-center">Start Quiz</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

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

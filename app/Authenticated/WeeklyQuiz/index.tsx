import { useWeeklyQuizStore } from "@/stores/weeklyQuizStore";
import { QuizSubmitResult } from "@/services/interfaces/IQuizService";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import QuizFooter from "@/components/Quiz/Footer";
import OptionButton from "@/components/Quiz/Options";
import QuizQuestion from "@/components/Quiz/Questions";

const { width: screenWidth } = Dimensions.get("window");

export default function WeeklyQuizScreen() {
  const { activeQuiz, submitAnswer, isLoading, fetchActiveQuiz } = useWeeklyQuizStore();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitResult, setSubmitResult] = useState<QuizSubmitResult | null>(null);
  const { height: screenHeight } = Dimensions.get("window");

  const questions = activeQuiz?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    if (!activeQuiz) fetchActiveQuiz();
  }, []);

  if (activeQuiz?.hasSubmitted || submitResult) {
    const passed = submitResult?.passed ?? false;
    const totalScore = submitResult?.totalScore ?? 0;
    const maxScore = submitResult?.maxScore ?? (activeQuiz ? activeQuiz.totalQuestions * 20 : 0);
    const percentage = submitResult?.percentageScore ?? 0;
    const coinReward = activeQuiz?.coinReward ?? 0;
    const passingScore = activeQuiz?.passingScore ?? 70;

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="#000000BF" strokeWidth={2} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Weekly Quiz</Text>
          <View style={{ width: 48 }} />
        </View>

        <ScrollView contentContainerStyle={resultStyles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={resultStyles.resultCard}>
            <View className="w-[40%] bg-[#00000040] self-center h-[6px] rounded-md" />
            <View className="relative">
              <Image
                source={require("@/assets/icons/Coins/coins-flying.png")}
                className="my-10 z-20"
                style={{ width: screenWidth * 0.4, height: screenHeight * 0.148 }}
                resizeMode="contain"
              />
              <Image className="absolute bottom-10 right-10 z-10" source={require("@/assets/icons/Coins/coin.png")} />
            </View>

            <Text className="text-black font-helvetica-bold text-[20px] text-center w-[250px]">
              {passed ? "Quiz Completed!" : "Quiz Failed! Try again next time!"}
            </Text>

            <View style={resultStyles.info}>
              <Text style={resultStyles.description}>
                {passed
                  ? "You have earned Zuper Coins"
                  : "You need to answer all questions correctly to pass the quiz."}
              </Text>
            </View>

            <View style={resultStyles.scoreContainer}>
              <View style={resultStyles.scoreBox}>
                <Text style={resultStyles.scoreText}>Your Score:</Text>
                <Text style={[resultStyles.scoreValue, { color: "#000000" }]}>
                  {totalScore}/{maxScore} ({percentage.toFixed(0)}%)
                </Text>
              </View>
              <View style={[resultStyles.progressBar, { overflow: "hidden" }]}>
                <View
                  style={{
                    width: `${Math.min(100, Math.max(0, percentage))}%`,
                    height: "100%",
                    backgroundColor: "#000000",
                    borderRadius: 4,
                  }}
                />
              </View>
              <View style={resultStyles.scoreBox}>
                <Text className="text-gray-500" style={resultStyles.passingText}>
                  Passing: {passingScore}%
                </Text>
                <Text style={resultStyles.passingText}>Your score: ({percentage.toFixed(0)}%)</Text>
              </View>
            </View>

            {passed && (
              <View style={resultStyles.bannerWrapper}>
                <View style={resultStyles.bannerLeft}>
                  <Image source={require("@/assets/icons/Coins/coin.png")} style={resultStyles.coinImage} />
                  <View style={resultStyles.bannerTextContainer}>
                    <Text style={resultStyles.bannerTitle}>Coins Earned</Text>
                    <Text style={resultStyles.bannerDescription}>Added to your Wallet</Text>
                  </View>
                </View>
                <Text style={resultStyles.rewardAmount}>+{coinReward}</Text>
              </View>
            )}

            {passed ? (
              <View style={resultStyles.buttonContainer}>
                <Pressable
                  onPress={() => router.push("/Authenticated/(tabs)/Coins")}
                  style={resultStyles.reviewButton}
                >
                  <Text style={resultStyles.reviewButtonText}>Go to Wallet</Text>
                </Pressable>
                <TouchableOpacity onPress={() => router.back()} style={resultStyles.walletButton}>
                  <Text style={resultStyles.walletButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={resultStyles.buttonContainer}>
                <TouchableOpacity onPress={() => router.back()} style={resultStyles.walletButton}>
                  <Text style={resultStyles.walletButtonText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (isLoading || !activeQuiz || questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#563FA5" />
        <Text style={styles.loadingText}>Loading ...</Text>
      </View>
    );
  }

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleUnselect = () => {
    setAnswers((prev) => {
      const { [currentQuestion.id]: _, ...rest } = prev;
      return rest;
    });
  };

  const allAnswered = questions.every((q) => answers[q.id]);

  const handleSubmit = async () => {
    if (!allAnswered) {
      Alert.alert("Incomplete", "Please answer all questions before submitting.");
      return;
    }
    const answersArray = questions.map((q) => ({
      questionId: q.id,
      selectedOptionId: answers[q.id],
    }));
    try {
      const result = await submitAnswer(activeQuiz.id, answersArray);
      setSubmitResult(result);
    } catch (err: unknown) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to submit quiz");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} color="#000000BF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Weekly Quiz</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.body}>
        <QuizQuestion
          question={currentQuestion.text}
          number={currentQuestionIndex + 1}
          total={questions.length}
        />
        {currentQuestion.options.map((opt, idx) => (
          <OptionButton
            key={opt.id}
            label={opt.text}
            index={idx}
            isSelected={answers[currentQuestion.id] === opt.id}
            onPress={() => handleSelect(opt.id)}
            onDoubleTap={handleUnselect}
          />
        ))}
      </View>

      <View className="mx-[25px]">
        <QuizFooter
          nextDisabled={!answers[currentQuestion.id]}
          backLabel={currentQuestionIndex === 0 ? "Back" : "Previous"}
          nextLabel={currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
          onBack={() => {
            if (currentQuestionIndex === 0) {
              router.back();
            } else {
              setCurrentQuestionIndex((prev) => prev - 1);
            }
          }}
          onNext={() => {
            if (currentQuestionIndex < questions.length - 1) {
              setCurrentQuestionIndex((prev) => prev + 1);
            } else if (allAnswered) {
              handleSubmit();
            }
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5E8F1" },
  header: {
    width: screenWidth,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: screenWidth * 0.0625,
  },
  backButton: {
    padding: 8,
    backgroundColor: "#FFFFFF59",
    borderRadius: 24,
    height: 48,
    width: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontFamily: "Poppins-Medium", color: "#000000" },
  loadingContainer: { flex: 1, backgroundColor: "#E5E8F1", justifyContent: "center", alignItems: "center" },
  body: {
    flex: 1,
    backgroundColor: "#E1DEF3",
    borderRadius: 15,
    marginHorizontal: 25,
    marginVertical: 10,
    padding: 20,
    paddingTop: 30,
  },
  loadingText: { marginTop: 16, color: "#563FA5", fontFamily: "Poppins-Medium" },
});

const resultStyles = StyleSheet.create({
  resultCard: { backgroundColor: "#fff", borderRadius: 16, padding: 16, alignItems: "center" },
  info: { alignItems: "center", marginBottom: 20, paddingHorizontal: 10 },
  description: { color: "#0000008C", fontSize: 18, fontWeight: "500", fontFamily: "Teachers-Medium", textAlign: "center", lineHeight: 22, marginTop: 4 },
  scoreContainer: { width: "100%", backgroundColor: "#f9fafc", borderRadius: 12, padding: 16, marginBottom: 16 },
  scoreBox: { flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center" },
  scoreText: { fontSize: 14, fontWeight: "500", color: "#000" },
  passingText: { fontSize: 14, fontWeight: "500", color: "#00000070" },
  leaderboardContainer: { width: "100%" },
  scoreValue: { fontSize: 14, fontWeight: "600" },
  progressBar: { height: 8, borderRadius: 4, marginVertical: 12, backgroundColor: "#E5E5E5" },
  scrollContent: { paddingHorizontal: 25, paddingBottom: 40, marginTop: 20, flexGrow: 1 },
  bannerWrapper: { backgroundColor: "#F3F0FF", flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 16, paddingVertical: 16, borderRadius: 12, marginBottom: 20, width: "100%" },
  bannerLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  coinImage: { width: 32, height: 32, marginRight: 12 },
  bannerTextContainer: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: "600", color: "#000", marginBottom: 2 },
  bannerDescription: { fontSize: 12, color: "#6C6C6C" },
  rewardAmount: { fontSize: 18, fontWeight: "bold", color: "#6C3CFF" },
  buttonContainer: { flexDirection: "row", width: "100%", justifyContent: "space-between", gap: 12 },
  reviewButton: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: "#00000026", paddingVertical: 14, paddingHorizontal: 12, alignItems: "center" },
  reviewButtonText: { fontSize: 14, fontWeight: "500", color: "#000" },
  walletButton: { flex: 1, borderRadius: 10, backgroundColor: "#563FA5", paddingVertical: 14, paddingHorizontal: 12, alignItems: "center" },
  walletButtonText: { fontSize: 14, fontWeight: "500", color: "#fff" },
});

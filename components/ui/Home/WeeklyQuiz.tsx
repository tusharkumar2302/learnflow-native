import { USE_MOCK } from "@/config";
import { useWeeklyQuizStore } from "@/stores/WeeklyQuiz/weeklyQuiz";
import { formatDate, isQuizLive, isQuizUpcoming, timeLeft } from "@/utils/date";
import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function WeeklyQuizCard() {
  const { activeQuiz, fetchActiveQuiz, isLoading } = useWeeklyQuizStore();
  const quiz = activeQuiz?.quiz;

  useEffect(() => {
    // Skip in mock/demo mode — store uses legacy axios, would throw error toast
    if (USE_MOCK) return;
    if (!activeQuiz) fetchActiveQuiz();
  }, []);

  // No quiz data in mock mode — render nothing cleanly
  if (USE_MOCK) return null;

  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { width: screenWidth * 0.88, alignSelf: "center" },
        ]}
      >
        <ActivityIndicator size="small" color="#563FA5" />
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  if (!quiz) {
    return <></>;
  }

  const live = isQuizLive(quiz.startDate, quiz.endDate);
  const upcoming = isQuizUpcoming(quiz.startDate);
  const countdown = upcoming ? timeLeft(quiz.startDate) : null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/Authenticated/WeeklyQuiz")}
      activeOpacity={0.92}
      style={{ width: screenWidth * 0.88, alignSelf: "center" }}
    >
      <View style={styles.container}>
        {/* Title & Description */}
        <Text style={styles.title} numberOfLines={1}>
          {quiz.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {quiz.description || "Weekly challenge – earn coins!"}
        </Text>

        {/* Date */}
        <Text style={styles.dateTime}>
          {formatDate(quiz.startDate, "d MMM, h:mm a")} –{" "}
          {formatDate(quiz.endDate, "h:mm a")}
        </Text>

        {/* Info Row */}
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            {quiz.totalQuestions}{" "}
            {quiz.totalQuestions === 1 ? "Question" : "Questions"}
          </Text>
          <Text style={styles.infoText}>
            {quiz.maxScore} Points • {quiz.passingScore}% Pass
          </Text>
        </View>

        {/* Bottom Row: Award + Status Badge */}
        <View style={styles.bottomRow}>
          {/* Award Box */}
          <View style={styles.rewardBox}>
            <Image
              source={require("@/assets/icons/Coins/trophy.png")}
              style={styles.trophy}
            />
            <Text style={styles.rewardLabel}>Award</Text>
            <View style={styles.coinBadge}>
              <Image
                source={require("@/assets/icons/Coins/coin.png")}
                style={styles.coinIcon}
              />
              <Text style={styles.coinText}>{quiz.coinReward}</Text>
            </View>
          </View>

          {/* Right Side: LIVE or Countdown */}
          <View style={styles.statusBadgeContainer}>
            {live && (
              <View style={[styles.badge, styles.liveBadge]}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}

            {upcoming && (
              <View style={[styles.badge, styles.upcomingBadge]}>
                <Text style={styles.upcomingText}>Starts in</Text>
                <Text style={styles.countdownText}>{countdown}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Completed Badge (Top Right) */}
        {activeQuiz?.hasSubmitted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>
              {activeQuiz.submission?.passed ? "Passed" : "Completed"}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    marginVertical: 12,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#1a1a1a",
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Teachers-Medium",
    fontSize: 13.5,
    color: "#666666",
    lineHeight: 20,
    marginBottom: 10,
  },
  dateTime: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "#555",
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  infoText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#555",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rewardBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FBF7F1",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 10,
  },
  trophy: {
    width: 26,
    height: 30,
  },
  rewardLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14.5,
    color: "#333",
  },
  coinBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(115,10,150,0.12)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  coinIcon: {
    width: 18,
    height: 18,
  },
  coinText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#730A96",
  },

  // Unified Badge Style (Same Height!)
  badge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    minHeight: 48, // ← Ensures same height
    gap: 8,
  },
  statusBadgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  liveBadge: {
    backgroundColor: "#FF3B30",
  },
  liveDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  liveText: {
    color: "white",
    fontFamily: "Poppins-Bold",
    fontSize: 13,
    letterSpacing: 0.5,
  },
  upcomingBadge: {
    backgroundColor: "#F2F1FB",
    paddingHorizontal: 16,
  },
  upcomingText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    color: "#666",
  },
  countdownText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#563FA5",
  },

  completedBadge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completedText: {
    color: "white",
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
  },
  loadingContainer: {
    padding: 30,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontFamily: "Poppins-Regular",
  },
  noQuizText: {
    textAlign: "center",
    color: "#999",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
    padding: 30,
  },
});

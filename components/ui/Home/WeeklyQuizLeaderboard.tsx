// components/WeeklyQuizLeaderboard.tsx
import { useWeeklyQuizStore } from "@/stores/WeeklyQuiz/weeklyQuiz";
import React, { useEffect } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";

export default function WeeklyQuizLeaderboard({ quizId }: { quizId: string }) {
  const { leaderboard, userRank, fetchLeaderboard, fetchUserRank } =
    useWeeklyQuizStore();

  useEffect(() => {
    fetchLeaderboard(quizId);
    fetchUserRank(quizId);
  }, [quizId]);

  return (
    <View style={styles.container}>
      {/* User's Rank Card */}
      {userRank && (
        <View style={styles.userRankCard}>
          <Text style={styles.userRankTitle}>Your Rank</Text>
          <View style={styles.userRankDetails}>
            <Text style={styles.rankNumber}>#{userRank.rank}</Text>
            <Text style={styles.score}>
              {userRank.score} / {userRank.maxScore} points
            </Text>
            <Text style={styles.percentage}>
              {userRank.percentageScore.toFixed(1)}%
            </Text>
          </View>
          <Text style={styles.participants}>
            out of {userRank.totalParticipants} participants
          </Text>
        </View>
      )}

      {/* Leaderboard */}
      <Text style={styles.leaderboardTitle}>Top 100</Text>
      <FlatList
        data={leaderboard}
        keyExtractor={(item) => item.user.id}
        renderItem={({ item }) => (
          <View style={styles.leaderboardItem}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>{item.rank}</Text>
            </View>
            <Image
              source={{ uri: item.user.imgUrl || "default-avatar.png" }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.user.name}</Text>
              <Text style={styles.subscriptionTier}>
                {item.user.subscriptionTier}
              </Text>
            </View>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreValue}>{item.score}</Text>
              <Text style={styles.percentageValue}>
                {item.percentageScore.toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderStyle: "dashed",
    marginTop: 20,
  },
  userRankCard: {
    backgroundColor: "#563FA5",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  userRankTitle: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  userRankDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  rankNumber: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
  },
  score: {
    color: "#fff",
    fontSize: 18,
  },
  percentage: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  participants: {
    color: "#E5E8F1",
    fontSize: 14,
    marginTop: 10,
  },
  leaderboardTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  rankBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E5FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#563FA5",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  subscriptionTier: {
    fontSize: 12,
    color: "#666",
  },
  scoreContainer: {
    alignItems: "flex-end",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#563FA5",
  },
  percentageValue: {
    fontSize: 14,
    color: "#666",
  },
});

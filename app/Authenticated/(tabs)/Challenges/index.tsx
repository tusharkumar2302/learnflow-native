import WeeklyQuizCard from "@/components/ui/Home/WeeklyQuiz";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const COMING_SOON = [
  {
    title: "Daily Market Quiz",
    description: "3 questions every morning. Track streaks, earn coins daily.",
    tag: "Daily",
  },
  {
    title: "Portfolio Challenge",
    description: "Pick 5 stocks for a virtual ₹1 lakh portfolio. Compete with other learners over 30 days.",
    tag: "Monthly",
  },
  {
    title: "Chart Reading Sprint",
    description: "Identify candlestick patterns under time pressure. Sharpen your chart reading speed.",
    tag: "Skill",
  },
];

export default function ChallengesTab() {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Challenges</Text>
        <Text style={s.headerSubtitle}>Test your knowledge. Earn coins.</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        <Text style={s.sectionLabel}>THIS WEEK</Text>
        <WeeklyQuizCard />

        <Text style={[s.sectionLabel, { marginTop: 24 }]}>COMING SOON</Text>
        {COMING_SOON.map((item, idx) => (
          <View key={idx} style={s.comingSoonCard}>
            <View style={s.tagRow}>
              <View style={s.tag}>
                <Text style={s.tagText}>{item.tag}</Text>
              </View>
            </View>
            <Text style={s.comingSoonTitle}>{item.title}</Text>
            <Text style={s.comingSoonDesc}>{item.description}</Text>
            <View style={s.comingSoonFooter}>
              <Text style={s.comingSoonHint}>Available soon</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E5E8F1" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    color: "#0D0D0D",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.45)",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "rgba(0,0,0,0.38)",
    letterSpacing: 1,
    marginBottom: 4,
  },

  comingSoonCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    opacity: 0.72,
  },
  tagRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  tag: {
    backgroundColor: "#F3F0FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    color: "#563FA5",
    letterSpacing: 0.3,
  },
  comingSoonTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#0D0D0D",
    marginBottom: 6,
  },
  comingSoonDesc: {
    fontFamily: "Teachers-Regular",
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
    marginBottom: 14,
  },
  comingSoonFooter: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.08)",
    paddingTop: 10,
  },
  comingSoonHint: {
    fontFamily: "Poppins-Medium",
    fontSize: 12,
    color: "rgba(0,0,0,0.28)",
  },
});

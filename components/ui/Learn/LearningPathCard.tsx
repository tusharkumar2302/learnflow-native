import { LearningPath } from "@/services/interfaces/ILearnService";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "#059669",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

export default function LearningPathCard({ path }: { path: LearningPath }) {
  const router = useRouter();
  const progress = path.userProgress;
  const pct = progress?.progressPercentage ?? 0;
  const levelColor = LEVEL_COLOR[path.level] ?? "#7C3AED";
  const nextId = progress?.nextLessonId;

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/Authenticated/LearningPath/[pathId]",
      params: { pathId: path.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.94 }]}
    >
      {/* Thumbnail */}
      <View style={s.thumbWrap}>
        {path.thumbnail ? (
          <Image source={{ uri: path.thumbnail }} style={s.thumb} resizeMode="cover" />
        ) : (
          <View style={[s.thumb, { backgroundColor: "#2D1B69" }]} />
        )}
        <View style={s.thumbOverlay} />
        {pct === 100 && (
          <View style={s.completedBadge}>
            <Text style={s.completedBadgeText}>✓ Done</Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={s.content}>
        <View style={s.metaRow}>
          <View style={[s.levelPill, { backgroundColor: levelColor + "18" }]}>
            <Text style={[s.levelText, { color: levelColor }]}>{path.level}</Text>
          </View>
          <Text style={s.lessonCount}>{path.totalLessons} lessons · {path.estimatedMinutes} min</Text>
        </View>

        <Text style={s.title} numberOfLines={2}>{path.title}</Text>
        <Text style={s.desc} numberOfLines={2}>{path.description}</Text>

        {/* Progress bar */}
        {pct > 0 && (
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View style={[s.progressFill, { width: `${pct}%` }]} />
            </View>
            <Text style={s.progressLabel}>{pct}% complete</Text>
          </View>
        )}

        {/* CTA */}
        <Text style={s.cta}>
          {pct === 0 ? "Start path →" : pct === 100 ? "Review →" : nextId ? "Continue →" : "Continue →"}
        </Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 14,
  },
  thumbWrap: {
    height: 120,
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,6,20,0.25)",
  },
  completedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(5,150,105,0.85)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  completedBadgeText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#FFFFFF",
  },
  content: {
    padding: 14,
    gap: 6,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  levelPill: {
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  levelText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
  },
  lessonCount: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(0,0,0,0.38)",
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#0D0D0D",
    lineHeight: 20,
  },
  desc: {
    fontFamily: "Poppins-Regular",
    fontSize: 11.5,
    color: "rgba(0,0,0,0.50)",
    lineHeight: 17,
  },
  progressWrap: {
    gap: 4,
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(86,63,165,0.10)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#7C3AED",
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(0,0,0,0.38)",
  },
  cta: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 12,
    color: "#7C3AED",
    marginTop: 2,
  },
});

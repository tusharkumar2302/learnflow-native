import { Lesson, LearningPath } from "@/services/interfaces/ILearnService";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  lesson: Lesson;
  path: LearningPath;
};

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  return `${m} min`;
}

export default function TodayLessonCard({ lesson, path }: Props) {
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/Authenticated/Lesson/[lessonId]",
      params: { lessonId: lesson.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.93 }]}
      accessibilityRole="button"
    >
      {/* Thumbnail */}
      <View style={s.thumbWrap}>
        {path.thumbnail ? (
          <Image source={{ uri: path.thumbnail }} style={s.thumb} resizeMode="cover" />
        ) : (
          <View style={[s.thumb, { backgroundColor: "#2D1B69" }]} />
        )}
        <View style={s.thumbOverlay} />
        {/* Path label */}
        <View style={s.pathPill}>
          <Text style={s.pathPillText} numberOfLines={1}>{path.title}</Text>
        </View>
        {/* Duration pill */}
        <View style={s.durationPill}>
          <Text style={s.durationText}>{formatSeconds(lesson.durationSeconds)}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={s.content}>
        <View style={s.topRow}>
          <Text style={s.badge}>TODAY'S LESSON</Text>
          <Text style={s.lessonNum}>{lesson.order} / {path.totalLessons}</Text>
        </View>
        <Text style={s.title} numberOfLines={2}>{lesson.title}</Text>
        <View style={s.tagsRow}>
          {lesson.conceptTags.slice(0, 3).map((tag) => (
            <View key={tag} style={s.tag}>
              <Text style={s.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={s.cta}>
          <Text style={s.ctaText}>Start lesson →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 20,
    shadowColor: "#563FA5",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  thumbWrap: {
    height: 160,
    position: "relative",
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,6,20,0.35)",
  },
  pathPill: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(124,58,237,0.85)",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pathPillText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  durationPill: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.50)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  durationText: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
  },
  content: {
    padding: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 9,
    color: "#7C3AED",
    letterSpacing: 1.2,
  },
  lessonNum: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.38)",
  },
  title: {
    fontFamily: "Teachers-Bold",
    fontSize: 18,
    color: "#0D0D0D",
    lineHeight: 24,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#F0EBFF",
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "#563FA5",
  },
  cta: {
    alignSelf: "flex-start",
    marginTop: 2,
  },
  ctaText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#7C3AED",
  },
});

import { Lesson } from "@/services/interfaces/ILearnService";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle01Icon, LockIcon, PlayCircleIcon } from "@hugeicons/core-free-icons";

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return sec > 0 ? `${m}m ${sec}s` : `${m} min`;
}

export default function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
  const router = useRouter();
  const locked = !lesson.isUnlocked;

  const handlePress = () => {
    if (locked) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/Authenticated/Lesson/[lessonId]",
      params: { lessonId: lesson.id },
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={locked}
      style={({ pressed }) => [s.row, locked && s.rowLocked, pressed && !locked && { opacity: 0.85 }]}
    >
      {/* Order indicator */}
      <View style={[s.orderWrap, lesson.isCompleted && s.orderDone, locked && s.orderLocked]}>
        {lesson.isCompleted ? (
          <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color="#059669" strokeWidth={2} />
        ) : locked ? (
          <HugeiconsIcon icon={LockIcon} size={16} color="rgba(0,0,0,0.28)" strokeWidth={1.5} />
        ) : (
          <Text style={s.orderNum}>{index + 1}</Text>
        )}
      </View>

      {/* Content */}
      <View style={s.content}>
        <Text
          style={[s.title, locked && s.titleLocked]}
          numberOfLines={2}
        >
          {lesson.title}
        </Text>
        <View style={s.meta}>
          <Text style={s.metaText}>{formatSeconds(lesson.durationSeconds)}</Text>
          {lesson.quiz && (
            <>
              <Text style={s.metaDot}>·</Text>
              <Text style={[s.metaText, lesson.quiz.isPassed && s.quizPassed]}>
                {lesson.quiz.isPassed ? "Quiz passed" : `Quiz · ${lesson.quiz.coinValue} coins`}
              </Text>
            </>
          )}
        </View>
        {lesson.conceptTags.length > 0 && !locked && (
          <View style={s.tagsRow}>
            {lesson.conceptTags.slice(0, 2).map((tag) => (
              <View key={tag} style={s.tag}>
                <Text style={s.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Right icon */}
      {!locked && !lesson.isCompleted && (
        <HugeiconsIcon icon={PlayCircleIcon} size={28} color="#7C3AED" strokeWidth={1.5} />
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
  },
  rowLocked: {
    opacity: 0.55,
  },
  orderWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EBFF",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  orderDone: {
    backgroundColor: "#ECFDF5",
  },
  orderLocked: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  orderNum: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#7C3AED",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#0D0D0D",
    lineHeight: 18,
  },
  titleLocked: {
    color: "rgba(0,0,0,0.40)",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
  },
  metaText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.42)",
  },
  metaDot: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.28)",
  },
  quizPassed: {
    color: "#059669",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
  },
  tag: {
    backgroundColor: "#F0EBFF",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    fontFamily: "Poppins-Regular",
    fontSize: 9.5,
    color: "#563FA5",
  },
});

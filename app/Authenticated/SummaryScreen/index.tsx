import ScreenHeader from "@/components/common/ScreenHeader";
import { localNotes } from "@/services/local/data/notes";
import { useCourseStore } from "@/stores/Course/courseStore";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function SummaryIndex() {
  const router = useRouter();
  const currentCourse = useCourseStore((state) => state.currentCourse);
  const currentChapter = useCourseStore((state) => state.currentChapter);
  const setCurrentChapter = useCourseStore((state) => state.setCurrentChapter);

  if (!currentChapter) {
    return (
      <View style={s.flex}>
        <ScreenHeader title="Chapter Notes" />
        <View style={s.center}>
          <Text style={s.emptyText}>No chapter selected</Text>
        </View>
      </View>
    );
  }

  const note = localNotes[currentChapter.id] ?? null;

  const hasQuiz =
    currentChapter.quizzes &&
    currentChapter.quizzes.length > 0 &&
    currentChapter.quizzes[0]?.id;

  const getNextChapter = () => {
    if (!currentCourse?.chapters || !currentChapter) return null;
    const idx = currentCourse.chapters.findIndex((ch) => ch.id === currentChapter.id);
    if (idx === -1 || idx >= currentCourse.chapters.length - 1) return null;
    return currentCourse.chapters[idx + 1];
  };

  const nextChapter = getNextChapter();

  const handleNextChapter = () => {
    if (!nextChapter) return;
    setCurrentChapter(nextChapter.id);
    router.push({
      pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
      params: {
        chapterId: nextChapter.id,
        thumbnail: currentCourse?.thumbnail ?? "",
        courseId: currentCourse?.id,
        title: currentCourse?.title,
        description: currentCourse?.description ?? currentCourse?.overview ?? "",
        duration: nextChapter.duration?.toString() ?? "0",
      },
    });
  };

  return (
    <View style={s.flex}>
      <ScreenHeader title="Chapter Notes" />

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Chapter title */}
        <View style={s.titleCard}>
          <Text style={s.chapterLabel}>
            {currentCourse?.title ?? ""}
          </Text>
          <Text style={s.chapterTitle}>{currentChapter.title}</Text>
        </View>

        {note ? (
          <>
            {/* Summary */}
            <View style={s.card}>
              <Text style={s.sectionLabel}>SUMMARY</Text>
              <Text style={s.summaryText}>{note.summary}</Text>
            </View>

            {/* Key Concepts */}
            {note.concepts.length > 0 && (
              <View style={s.card}>
                <Text style={s.sectionLabel}>KEY CONCEPTS</Text>
                {note.concepts.map((concept, idx) => (
                  <View
                    key={idx}
                    style={[s.conceptRow, idx < note.concepts.length - 1 && s.conceptBorder]}
                  >
                    <Text style={s.conceptTerm}>{concept.term}</Text>
                    <Text style={s.conceptDef}>{concept.definition}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Key Points */}
            {note.keyPoints.length > 0 && (
              <View style={s.card}>
                <Text style={s.sectionLabel}>KEY POINTS</Text>
                {note.keyPoints.map((point, idx) => (
                  <View key={idx} style={s.pointRow}>
                    <View style={s.bullet} />
                    <Text style={s.pointText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Practical Tip */}
            <View style={[s.card, s.tipCard]}>
              <View style={s.calloutHeader}>
                <Text style={s.tipEmoji}>💡</Text>
                <Text style={[s.sectionLabel, { color: "#7C3AED", marginBottom: 0 }]}>
                  PRACTICAL TIP
                </Text>
              </View>
              <Text style={s.tipText}>{note.practicalTip}</Text>
            </View>

            {/* Common Mistake */}
            <View style={[s.card, s.mistakeCard]}>
              <View style={s.calloutHeader}>
                <Text style={s.tipEmoji}>⚠️</Text>
                <Text style={[s.sectionLabel, { color: "#B45309", marginBottom: 0 }]}>
                  COMMON MISTAKE
                </Text>
              </View>
              <Text style={s.mistakeText}>{note.commonMistake}</Text>
            </View>
          </>
        ) : (
          <View style={s.card}>
            <Text style={s.emptyText}>
              Notes for this chapter are coming soon.
            </Text>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom actions */}
      <View style={s.actions}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
              params: {
                chapterId: currentChapter.id,
                thumbnail: currentCourse?.thumbnail ?? "",
                courseId: currentCourse?.id,
                title: currentCourse?.title,
                description: currentCourse?.description ?? currentCourse?.overview ?? "",
                duration: currentChapter.duration.toString(),
              },
            })
          }
          style={s.outlineBtn}
        >
          <Text style={s.outlineBtnText}>Replay</Text>
        </Pressable>

        {hasQuiz ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/Authenticated/QuizesPoint/HowQuizWorks",
                params: {
                  coins:
                    currentChapter.quizzes[0]?.coinValue ??
                    (currentChapter as any).coinValue ??
                    0,
                  quizData: JSON.stringify({ quizzes: currentChapter.quizzes }),
                  quizId: currentChapter.quizzes[0].id,
                },
              })
            }
            style={s.primaryBtn}
          >
            <Text style={s.primaryBtnText}>Take Quiz</Text>
          </Pressable>
        ) : nextChapter ? (
          <Pressable onPress={handleNextChapter} style={s.primaryBtn}>
            <Text style={s.primaryBtnText}>Next Chapter</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => router.push("/Authenticated/(tabs)/Courses")}
            style={s.primaryBtn}
          >
            <Text style={s.primaryBtnText}>Done</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1, backgroundColor: "#E5E8F1" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 },

  titleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  chapterLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.38)",
    letterSpacing: 0.4,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  chapterTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
    color: "#0D0D0D",
    lineHeight: 26,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
  },
  sectionLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
    color: "rgba(0,0,0,0.40)",
    letterSpacing: 1,
    marginBottom: 12,
  },
  summaryText: {
    fontFamily: "Teachers-Regular",
    fontSize: 15.5,
    color: "#1A1A1A",
    lineHeight: 26,
  },

  conceptRow: {
    paddingVertical: 12,
  },
  conceptBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.08)",
  },
  conceptTerm: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 14,
    color: "#563FA5",
    marginBottom: 4,
  },
  conceptDef: {
    fontFamily: "Teachers-Regular",
    fontSize: 14.5,
    color: "#333",
    lineHeight: 22,
  },

  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#563FA5",
    marginTop: 8,
    flexShrink: 0,
  },
  pointText: {
    fontFamily: "Teachers-Regular",
    fontSize: 15,
    color: "#1A1A1A",
    lineHeight: 24,
    flex: 1,
  },

  tipCard: { backgroundColor: "#F5F0FF" },
  mistakeCard: { backgroundColor: "#FFFBEB" },
  calloutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  tipEmoji: { fontSize: 16 },
  tipText: {
    fontFamily: "Teachers-Regular",
    fontSize: 15,
    color: "#3B1F8C",
    lineHeight: 24,
  },
  mistakeText: {
    fontFamily: "Teachers-Regular",
    fontSize: 15,
    color: "#78350F",
    lineHeight: 24,
  },

  emptyText: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#888",
    textAlign: "center",
    lineHeight: 24,
  },

  actions: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 36,
    backgroundColor: "#E5E8F1",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.06)",
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  outlineBtnText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#333",
  },
  primaryBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 13,
    backgroundColor: "#563FA5",
    alignItems: "center",
  },
  primaryBtnText: {
    fontFamily: "Poppins-Medium",
    fontSize: 15,
    color: "#FFFFFF",
  },
});

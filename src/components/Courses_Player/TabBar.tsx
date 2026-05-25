import { Course } from "@/types/Course";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LessonItem from "./LessonItem";
import OverViewTxt from "./OverViewTxt";
import ResourceComp from "./ResourceComp";

const tabs = ["Content", "Overview", "Summary", "Resources"];
const courseTabs = ["Lessons"];

interface TabBarProps {
  courseData: Course | null;
  onPlayChapter: (chapterId: string) => void;
  screen?: string;
  onStartQuiz?: (chapterId: string, quizId: string) => void;
}

function formatRemainingTime(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `~${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `~${h}h ${m}m` : `~${h}h`;
}

const TabBar: React.FC<TabBarProps> = ({ courseData, onPlayChapter, screen, onStartQuiz }) => {
  const [activetab, setactivetab] = useState(courseTabs[0]);

  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Course data failed to load</Text>
      </View>
    );
  }

  // Progress summary for course screen
  const completedCount = courseData.chapters?.filter((ch) => ch.isCompleted).length ?? 0;
  const totalCount = courseData.chapters?.length ?? 0;
  const remainingSeconds = courseData.chapters
    ?.filter((ch) => !ch.isCompleted)
    .reduce((sum, ch) => sum + ch.duration, 0) ?? 0;

  return (
    <View style={styles.container}>
      {/* Tabs row */}
      <View style={[styles.headTab, screen === "course" && { justifyContent: "flex-start" }]}>
        {(screen === "course" ? courseTabs : tabs).map((tab) => (
          <TouchableOpacity key={tab} onPress={() => setactivetab(tab)}>
            <Text style={[styles.tab, activetab === tab && styles.activeTab]}>{tab}</Text>
            {activetab === tab && <View style={styles.indicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.baseLineHead} />

      {/* Progress summary — only on Lessons tab in course mode */}
      {screen === "course" && activetab === "Lessons" && totalCount > 0 && (
        <View style={styles.progressHeader}>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${Math.round((completedCount / totalCount) * 100)}%` as any },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>
            {completedCount} / {totalCount} chapters complete
            {remainingSeconds > 0 ? `  ·  ${formatRemainingTime(remainingSeconds)} remaining` : ""}
          </Text>
        </View>
      )}

      {/* Tab content */}
      <View style={styles.body}>
        {activetab === "Lessons" && (
          <View>
            {courseData.chapters?.map((chapter, idx: number) => {
              const isInProgress = (chapter.currentTime ?? 0) > 0 && !chapter.isCompleted;
              const hasQuiz = chapter.quizzes.length > 0;
              const quizPassed = hasQuiz && chapter.quizzes.every(
                (q) => q.userResult?.passed || q.isPassed
              );

              return (
                <LessonItem
                  key={chapter.id || idx}
                  order={chapter.order}
                  title={chapter.title}
                  estimatedDuration={chapter.duration}
                  coinValue={chapter.coinValue || 0}
                  completed={chapter.isCompleted}
                  isInProgress={isInProgress}
                  hasQuiz={hasQuiz}
                  quizPassed={quizPassed}
                  onPlay={() => onPlayChapter(chapter.id)}
                  onStartQuiz={
                    onStartQuiz && hasQuiz
                      ? () => chapter.quizzes.forEach((quiz) => onStartQuiz(chapter.id, quiz.id))
                      : undefined
                  }
                />
              );
            })}
          </View>
        )}

        {activetab === "Overview" && (
          <View style={styles.overViewContent}>
            <OverViewTxt title="Skill Level" value={courseData.difficulty ?? "N/A"} />
            <OverViewTxt title="Lectures" value={`${courseData.chapters?.length || 0} Lectures`} />
            <OverViewTxt
              title="Duration"
              value={
                courseData.estimatedDuration
                  ? `${Math.floor(courseData.estimatedDuration / 60)} hrs ${courseData.estimatedDuration % 60} mins`
                  : "0 hrs 0 mins"
              }
            />
            <OverViewTxt title="Author" value={courseData.author ?? "Unknown"} />
            <OverViewTxt title="Category" value={courseData.category ?? "N/A"} />
          </View>
        )}

        {activetab === "Summary" && (
          <Text style={styles.summaryContent}>
            {courseData.description || courseData.overview || "No summary available"}
          </Text>
        )}

        {activetab === "Resources" && (
          <View style={styles.resourceContent}>
            {Array.isArray(courseData.documents) && courseData.documents.length > 0 ? (
              courseData.documents.map((doc, idx: number) => (
                <ResourceComp key={doc.id || idx} title={doc.title} />
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#888", padding: 20 }}>
                No resources available
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF73",
    borderRadius: 15,
    paddingVertical: 20,
  },
  tab: {
    fontSize: 14,
    fontWeight: "500",
    color: "#888",
    paddingHorizontal: 10,
    fontFamily: "HelveticaNeue-Medium",
  },
  activeTab: { color: "#000", fontWeight: "bold" },
  indicator: { height: 3, backgroundColor: "#730A96", marginTop: 10 },
  headTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  baseLineHead: {
    backgroundColor: "#0000000D",
    height: 1,
    width: "100%",
  },
  progressHeader: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 6,
  },
  progressBarTrack: {
    height: 3,
    backgroundColor: "rgba(86,63,165,0.12)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 3,
    backgroundColor: "#563FA5",
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "rgba(0,0,0,0.45)",
  },
  body: {},
  overViewContent: {
    gap: 8,
    paddingVertical: 15,
  },
  summaryContent: {
    color: "#000000A6",
    fontWeight: "500",
    fontSize: 15,
    fontFamily: "Teachers-Medium",
    padding: 16,
    lineHeight: 24,
  },
  resourceContent: {
    marginTop: 16,
    gap: 12,
  },
  emptyText: {
    color: "#999",
    textAlign: "center",
    padding: 20,
    fontFamily: "Teachers-Medium",
  },
});

export default TabBar;

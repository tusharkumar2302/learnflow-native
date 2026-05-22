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

const TabBar: React.FC<TabBarProps> = ({
  courseData,
  onPlayChapter,
  screen,
  onStartQuiz,
}) => {
  const [activetab, setactivetab] = useState(courseTabs[0]);

  // Early return if courseData is null
  if (!courseData) {
    return (
      <View style={styles.container}>
        <Text style={styles.SummaryContent}>Course Data Failed to Load</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View
        style={[
          styles.headTab,
          screen === "course" && { justifyContent: "flex-start" },
        ]}
      >
        {screen === "course"
          ? courseTabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setactivetab(tab)}>
                <Text
                  style={[styles.tab, activetab === tab && styles.activeTab]}
                >
                  {tab}
                </Text>
                {activetab === tab && <View style={styles.indicator}></View>}
              </TouchableOpacity>
            ))
          : tabs.map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setactivetab(tab)}>
                <Text
                  style={[styles.tab, activetab === tab && styles.activeTab]}
                >
                  {tab}
                </Text>
                {activetab === tab && <View style={styles.indicator}></View>}
              </TouchableOpacity>
            ))}
      </View>

      <View style={styles.baseLineHead}></View>

      {/* Tab Content */}
      <View style={styles.body}>
        {/* Content Tab */}
        {activetab === "Lessons" && (
          <View>
            {courseData.chapters?.map((chapter, idx: number) => {
              courseData.chapters?.forEach((ch, i) => {});

              return (
                <LessonItem
                  coinValue={chapter.coinValue || 0}
                  key={chapter.id || idx}
                  title={chapter.title}
                  estimatedDuration={chapter.duration}
                  completed={chapter.chapterCompleted || false}
                  onPlay={() => onPlayChapter(chapter.id)}
                  onStartQuiz={
                    onStartQuiz
                      ? () =>
                          chapter.quizzes.forEach((quiz) =>
                            onStartQuiz(chapter.id, quiz.id)
                          )
                      : undefined
                  }
                />
              );
            })}
          </View>
        )}

        {/* Overview Tab */}
        {activetab === "Overview" && (
          <View style={styles.overViewContent}>
            <OverViewTxt
              title={"Skill Level"}
              value={courseData.difficulty ?? "N/A"}
            />
            <OverViewTxt
              title={"Lectures"}
              value={`${courseData.chapters?.length || 0} Lectures`}
            />
            <OverViewTxt
              title={"Duration"}
              value={
                courseData.estimatedDuration
                  ? `${Math.floor(courseData.estimatedDuration / 60)} hrs ${
                      courseData.estimatedDuration % 60
                    } mins`
                  : "0 hrs 0 mins"
              }
            />
            <OverViewTxt
              title={"Author"}
              value={courseData.author ?? "Unknown"}
            />
            <OverViewTxt
              title={"Category"}
              value={courseData.category ?? "N/A"}
            />
          </View>
        )}

        {/* Summary Tab */}
        {activetab === "Summary" && (
          <Text style={styles.SummaryContent}>
            {courseData.description ||
              courseData.overview ||
              "No summary available"}
          </Text>
        )}

        {/* Resources Tab */}
        {activetab === "Resources" && (
          <View style={styles.resourceContent}>
            {Array.isArray(courseData.documents) &&
            courseData.documents.length > 0 ? (
              courseData.documents.map((doc, idx: number) => (
                <ResourceComp
                  key={doc.id || idx}
                  title={`${doc.title} (${doc.size})`}
                />
              ))
            ) : (
              <Text style={{ textAlign: "center", color: "#888" }}>
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
  body: {},
  baseLineHead: {
    backgroundColor: "#0000000D",
    height: 1,
    width: "100%",
  },
  overViewContent: {
    gap: 8,
    paddingVertical: 15,
  },
  SummaryContent: {
    color: "#000000A6",
    fontWeight: "500",
    fontSize: 16,
    fontFamily: "Teachers-Medium",
    textAlign: "center",
    marginTop: 16,
  },
  resourceContent: {
    marginTop: 16,
    gap: 12,
  },
});

export default TabBar;

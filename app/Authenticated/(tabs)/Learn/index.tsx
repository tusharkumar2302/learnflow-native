import LearningPathCard from "@/components/ui/Learn/LearningPathCard";
import TodayLessonCard from "@/components/ui/Learn/TodayLessonCard";
import { useLearningPaths, useTodayLesson } from "@/hooks/useLearn";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LearningPath } from "@/services/interfaces/ILearnService";

type Section =
  | { id: "header"; type: "header" }
  | { id: "today"; type: "today" }
  | { id: "paths-header"; type: "paths-header" }
  | { id: string; type: "path"; path: LearningPath };

export default function LearnScreen() {
  const insets = useSafeAreaInsets();
  const { todayLesson, isLoading: loadingToday } = useTodayLesson();
  const { paths, isLoading: loadingPaths } = useLearningPaths();

  const isLoading = loadingToday || loadingPaths;

  const sections: Section[] = [
    { id: "header", type: "header" },
    { id: "today", type: "today" },
    { id: "paths-header", type: "paths-header" },
    ...paths.map((p): Section => ({ id: p.id, type: "path", path: p })),
  ];

  const renderItem: ListRenderItem<Section> = ({ item }) => {
    if (item.type === "header") {
      return (
        <View style={s.pageHeader}>
          <Text style={s.pageTitle}>Quick Learn</Text>
          <Text style={s.pageSubtitle}>Master trading, one lesson at a time</Text>
        </View>
      );
    }

    if (item.type === "today") {
      if (isLoading) {
        return (
          <View style={s.shimmer} />
        );
      }
      if (!todayLesson) {
        return (
          <View style={s.allDoneCard}>
            <Text style={s.allDoneEmoji}>🎉</Text>
            <Text style={s.allDoneTitle}>All paths complete!</Text>
            <Text style={s.allDoneSub}>Review any path or lesson below.</Text>
          </View>
        );
      }
      return (
        <TodayLessonCard lesson={todayLesson.lesson} path={todayLesson.path} />
      );
    }

    if (item.type === "paths-header") {
      return (
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Learning Paths</Text>
          <Text style={s.sectionSub}>Structured curriculum — complete in order</Text>
        </View>
      );
    }

    if (item.type === "path") {
      return (
        <View style={s.pathWrap}>
          <LearningPathCard path={item.path} />
        </View>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <View style={[s.root, s.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  centered: {
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingBottom: 40,
  },
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
  },
  pageTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    color: "#0D0D0D",
    marginBottom: 2,
  },
  pageSubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.42)",
  },
  shimmer: {
    height: 240,
    backgroundColor: "rgba(255,255,255,0.70)",
    borderRadius: 20,
    marginHorizontal: 20,
  },
  allDoneCard: {
    marginHorizontal: 20,
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    gap: 8,
  },
  allDoneEmoji: { fontSize: 36 },
  allDoneTitle: {
    fontFamily: "Teachers-Bold",
    fontSize: 20,
    color: "#065F46",
  },
  allDoneSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.50)",
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontFamily: "Teachers-SemiBold",
    fontSize: 17,
    color: "#0D0D0D",
  },
  sectionSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.42)",
    marginTop: 2,
  },
  pathWrap: {
    paddingHorizontal: 20,
  },
});

import LessonRow from "@/components/ui/Learn/LessonRow";
import { useLearningPath } from "@/hooks/useLearn";
import { learnService } from "@/lib/services";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, PlayCircleIcon } from "@hugeicons/core-free-icons";
import { Lesson } from "@/services/interfaces/ILearnService";

const LEVEL_COLOR: Record<string, string> = {
  Beginner: "#059669",
  Intermediate: "#D97706",
  Advanced: "#DC2626",
};

type ListItem =
  | { id: "header"; type: "header" }
  | { id: string; type: "lesson"; lesson: Lesson; index: number };

export default function LearningPathScreen() {
  const { pathId } = useLocalSearchParams<{ pathId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { path, isLoading, refresh } = useLearningPath(pathId ?? "");

  // Refresh when screen regains focus (e.g. returning from a lesson)
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const handleStartPath = async () => {
    if (!path) return;
    await learnService.setActivePath(path.id);
    const nextId = path.userProgress?.nextLessonId ?? path.lessons[0]?.id;
    if (nextId) {
      router.push({
        pathname: "/Authenticated/Lesson/[lessonId]",
        params: { lessonId: nextId },
      });
    }
  };

  if (isLoading || !path) {
    return (
      <View style={[s.root, s.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const pct = path.userProgress?.progressPercentage ?? 0;
  const nextId = path.userProgress?.nextLessonId;
  const levelColor = LEVEL_COLOR[path.level] ?? "#7C3AED";

  const data: ListItem[] = [
    { id: "header", type: "header" },
    ...path.lessons.map((l, i): ListItem => ({ id: l.id, type: "lesson", lesson: l, index: i })),
  ];

  const renderItem: ListRenderItem<ListItem> = ({ item }) => {
    if (item.type === "header") {
      return (
        <View style={s.pathHeader}>
          {/* Thumbnail hero */}
          <View style={s.heroWrap}>
            {path.thumbnail ? (
              <Image source={{ uri: path.thumbnail }} style={s.hero} resizeMode="cover" />
            ) : (
              <View style={[s.hero, { backgroundColor: "#2D1B69" }]} />
            )}
            <View style={s.heroOverlay} />
          </View>

          {/* Meta */}
          <View style={s.meta}>
            <View style={[s.levelPill, { backgroundColor: levelColor + "18" }]}>
              <Text style={[s.levelText, { color: levelColor }]}>{path.level}</Text>
            </View>
            <Text style={s.metaDetail}>{path.totalLessons} lessons · {path.estimatedMinutes} min</Text>
          </View>

          <Text style={s.title}>{path.title}</Text>
          <Text style={s.description}>{path.description}</Text>

          {/* Progress */}
          {pct > 0 && (
            <View style={s.progressWrap}>
              <View style={s.progressTrack}>
                <View style={[s.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={s.progressLabel}>{pct}% complete · {path.userProgress?.completedLessons}/{path.totalLessons} lessons</Text>
            </View>
          )}

          {/* CTA button */}
          {nextId && (
            <TouchableOpacity
              onPress={handleStartPath}
              style={s.ctaBtn}
              activeOpacity={0.85}
            >
              <HugeiconsIcon icon={PlayCircleIcon} size={18} color="#FFFFFF" strokeWidth={2} />
              <Text style={s.ctaBtnText}>
                {pct === 0 ? "Start path" : "Continue learning"}
              </Text>
            </TouchableOpacity>
          )}

          <Text style={s.lessonsLabel}>LESSONS</Text>
        </View>
      );
    }

    return <LessonRow lesson={item.lesson} index={item.index} />;
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      {/* Back button */}
      <View style={s.backRow}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
          <HugeiconsIcon icon={ArrowLeft01Icon} size={22} color="#0D0D0D" strokeWidth={2} />
        </Pressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F5F3FF" },
  centered: { alignItems: "center", justifyContent: "center" },
  backRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.70)",
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  pathHeader: {
    gap: 12,
    marginBottom: 20,
  },
  heroWrap: {
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  hero: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,6,20,0.30)",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  levelPill: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  levelText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
  },
  metaDetail: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.42)",
  },
  title: {
    fontFamily: "Teachers-Bold",
    fontSize: 24,
    color: "#0D0D0D",
    lineHeight: 30,
  },
  description: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
    lineHeight: 20,
  },
  progressWrap: { gap: 5 },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(86,63,165,0.10)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 4,
    backgroundColor: "#7C3AED",
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.42)",
  },
  ctaBtn: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  ctaBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  lessonsLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "rgba(0,0,0,0.38)",
    letterSpacing: 1.5,
    marginTop: 8,
    marginBottom: 4,
  },
});

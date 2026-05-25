import currentVid from "@/stores/currentVid";
import { useRecentlyWatched } from "@/hooks/useRecentlyWatched";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CARD_HEIGHT = 120;
const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_WIDTH = SCREEN_WIDTH * 0.875;

function formatMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return m > 0 ? `${m}m in` : "";
}

function ContinueSkeleton() {
  return (
    <View style={{ width: CARD_WIDTH, alignSelf: "center", marginTop: 16, marginBottom: 4 }}>
      <View style={[styles.sectionHeader, { backgroundColor: "#E8E4F5", width: 140, height: 16, borderRadius: 6 }]} />
      <View style={[styles.card, { height: CARD_HEIGHT }]}>
        <View style={{ width: "42%", height: CARD_HEIGHT, backgroundColor: "#EDE9F9" }} />
        <View style={{ flex: 1, padding: 12, gap: 8, justifyContent: "center" }}>
          <View style={{ height: 10, width: "50%", backgroundColor: "#EDE9F9", borderRadius: 4 }} />
          <View style={{ height: 13, width: "90%", backgroundColor: "#EDE9F9", borderRadius: 4 }} />
          <View style={{ height: 10, width: "70%", backgroundColor: "#EDE9F9", borderRadius: 4 }} />
          <View style={{ height: 3, width: "100%", backgroundColor: "#EDE9F9", borderRadius: 2, marginTop: 6 }} />
        </View>
      </View>
    </View>
  );
}

const ContinueWatchingCard = ({ continueTxt = true }: { continueTxt?: boolean }) => {
  const router = useRouter();
  const { setVidId } = currentVid();
  const { items: vidData, isLoading } = useRecentlyWatched(1);

  if (isLoading) {
    return continueTxt ? <ContinueSkeleton /> : null;
  }

  if (!vidData || vidData.length === 0) {
    return null;
  }

  const item = vidData[0];
  const timeSaved = formatMinutes(item.currentTime);
  const progress = Math.round(item.progressPercentage);

  const handleResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVidId(item.courseId);
    router.push({
      pathname: "/Authenticated/(tabs)/Courses/CourseDetail",
      params: { id: item.courseId },
    });
  };

  return (
    <View style={{ width: CARD_WIDTH, alignSelf: "center", marginTop: 16, marginBottom: 4 }}>
      {continueTxt && (
        <Text style={styles.sectionHeader}>Continue Learning</Text>
      )}

      <Pressable
        onPress={handleResume}
        style={({ pressed }) => [
          styles.card,
          { height: CARD_HEIGHT, opacity: pressed ? 0.96 : 1 },
        ]}
      >
        {/* ── Thumbnail ── */}
        <View style={{ width: "42%", height: CARD_HEIGHT, overflow: "hidden" }}>
          {item.courseThumbnail ? (
            <Image
              source={{ uri: item.courseThumbnail }}
              style={{ width: "100%", height: CARD_HEIGHT }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ width: "100%", height: CARD_HEIGHT, backgroundColor: "#EDE9F9" }} />
          )}
        </View>

        {/* ── Content ── */}
        <View style={{ flex: 1, height: CARD_HEIGHT, paddingHorizontal: 12, paddingVertical: 10, justifyContent: "space-between" }}>

          {/* Top row: category + time saved */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {item.category}
              </Text>
            </View>
            {timeSaved !== "" && (
              <Text style={styles.timeSaved}>{timeSaved}</Text>
            )}
          </View>

          {/* Course title */}
          <Text style={styles.courseTitle} numberOfLines={2}>
            {item.courseTitle}
          </Text>

          {/* Chapter context */}
          <Text style={styles.chapterText} numberOfLines={1}>
            Ch.{item.chapterOrder} of {item.totalChapters} · {item.chapterTitle}
          </Text>

          {/* Progress + Resume */}
          <View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, Math.max(0, progress))}%` },
                ]}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 5 }}>
              <Text style={styles.progressLabel}>{progress}% complete</Text>
              <View style={styles.resumeBtn}>
                <Text style={styles.resumeText}>Resume →</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    fontFamily: "Teachers-SemiBold",
    fontSize: 17,
    color: "#0D0D0D",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#563FA5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 2,
  },
  categoryBadge: {
    backgroundColor: "rgba(86,63,165,0.08)",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    maxWidth: "70%",
  },
  categoryText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#563FA5",
  },
  timeSaved: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(0,0,0,0.35)",
  },
  courseTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13,
    color: "#0D0D0D",
    lineHeight: 18,
  },
  chapterText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.45)",
  },
  progressTrack: {
    height: 3,
    backgroundColor: "rgba(86,63,165,0.10)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: 3,
    backgroundColor: "#563FA5",
    borderRadius: 2,
  },
  progressLabel: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(0,0,0,0.38)",
  },
  resumeBtn: {
    backgroundColor: "#563FA5",
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  resumeText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    color: "#FFFFFF",
  },
});

export default ContinueWatchingCard;

import currentVid from "@/stores/currentVid";
import { useRecentlyWatched } from "@/hooks/useRecentlyWatched";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = screenWidth * 0.875;

function formatMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60);
  return m > 0 ? `${m}m` : "<1m";
}

function ContinueSkeleton() {
  return (
    <View style={{ width: CARD_WIDTH, alignSelf: "center", marginTop: 16, marginBottom: 8 }}>
      <View
        style={{
          height: 16,
          width: 140,
          backgroundColor: "#E8E4F5",
          borderRadius: 6,
          marginBottom: 10,
        }}
      />
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          height: 116,
          flexDirection: "row",
          overflow: "hidden",
          shadowColor: "#563FA5",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <View style={{ width: "42%", backgroundColor: "#EDE9F9" }} />
        <View style={{ flex: 1, padding: 14, gap: 8, justifyContent: "center" }}>
          <View style={{ height: 10, width: "50%", backgroundColor: "#EDE9F9", borderRadius: 4 }} />
          <View style={{ height: 14, width: "90%", backgroundColor: "#EDE9F9", borderRadius: 4 }} />
          <View style={{ height: 11, width: "70%", backgroundColor: "#EDE9F9", borderRadius: 4 }} />
          <View style={{ height: 3, width: "100%", backgroundColor: "#EDE9F9", borderRadius: 4, marginTop: 4 }} />
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
  const savedTime = formatMinutes(item.currentTime);
  const progress = Math.round(item.progressPercentage);

  const handleResume = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVidId(item.courseId);
    router.push({
      pathname: "/Authenticated/(tabs)/Courses/CouseVideos",
      params: { id: item.courseId },
    });
  };

  return (
    <View style={{ width: CARD_WIDTH, alignSelf: "center", marginTop: 16, marginBottom: 4 }}>
      {continueTxt && (
        <Text
          style={{
            fontFamily: "Teachers-SemiBold",
            fontSize: 17,
            color: "#0D0D0D",
            marginBottom: 10,
          }}
        >
          Continue Learning
        </Text>
      )}

      <Pressable
        onPress={handleResume}
        style={({ pressed }) => ({
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          flexDirection: "row",
          overflow: "hidden",
          shadowColor: "#563FA5",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: pressed ? 0.12 : 0.07,
          shadowRadius: 10,
          elevation: pressed ? 4 : 2,
          opacity: pressed ? 0.97 : 1,
        })}
      >
        {/* Thumbnail */}
        <View style={{ width: "42%", minHeight: 116 }}>
          {item.courseThumbnail ? (
            <Image
              source={{ uri: item.courseThumbnail }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: "#EDE9F9" }} />
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1, padding: 14, justifyContent: "space-between" }}>
          {/* Top: category + time saved */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View
              style={{
                backgroundColor: "rgba(86,63,165,0.08)",
                borderRadius: 6,
                paddingHorizontal: 7,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Medium",
                  fontSize: 10,
                  color: "#563FA5",
                }}
                numberOfLines={1}
              >
                {item.category}
              </Text>
            </View>
            {item.currentTime > 0 && (
              <Text
                style={{
                  fontFamily: "Poppins-Regular",
                  fontSize: 10,
                  color: "rgba(0,0,0,0.35)",
                }}
              >
                {savedTime} in
              </Text>
            )}
          </View>

          {/* Course title */}
          <Text
            style={{
              fontFamily: "Poppins-SemiBold",
              fontSize: 13,
              color: "#0D0D0D",
              lineHeight: 18,
              marginTop: 4,
            }}
            numberOfLines={2}
          >
            {item.courseTitle}
          </Text>

          {/* Chapter context */}
          <Text
            style={{
              fontFamily: "Poppins-Regular",
              fontSize: 11,
              color: "rgba(0,0,0,0.45)",
              marginTop: 2,
            }}
            numberOfLines={1}
          >
            Ch.{item.chapterOrder} of {item.totalChapters} · {item.chapterTitle}
          </Text>

          {/* Progress row */}
          <View style={{ marginTop: 8 }}>
            <View
              style={{
                height: 3,
                backgroundColor: "rgba(86,63,165,0.10)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${Math.min(100, Math.max(0, progress))}%`,
                  height: "100%",
                  backgroundColor: "#563FA5",
                  borderRadius: 2,
                }}
              />
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <Text style={{ fontFamily: "Poppins-Regular", fontSize: 10, color: "rgba(0,0,0,0.40)" }}>
                {progress}% complete
              </Text>
              <View
                style={{
                  backgroundColor: "#563FA5",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text style={{ fontFamily: "Poppins-Medium", fontSize: 11, color: "#FFFFFF" }}>
                  Resume →
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default ContinueWatchingCard;

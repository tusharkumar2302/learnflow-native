import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CourseHeaderProps {
  title: string;
  points: number;
  Totalpoints: number;
  totalChapters?: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  points,
  Totalpoints,
  totalChapters,
}) => {
  const router = useRouter();
  const showProgress = totalChapters !== undefined && totalChapters > 0;
  const progressPct = showProgress ? Math.round((points / totalChapters) * 100) : 0;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.replace("/Authenticated/(tabs)/Courses")}
        style={styles.backButton}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} size={24} color="black" strokeWidth={2} />
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.titleBlock}>
          <Text style={styles.title} ellipsizeMode="tail" numberOfLines={2}>
            {title}
          </Text>
          {showProgress && (
            <Text style={styles.progressLabel}>
              {points} / {totalChapters} chapters{progressPct === 100 ? " · Complete" : ""}
            </Text>
          )}
        </View>

        <View style={styles.coinsBlock}>
          <Image
            style={styles.headerCoin}
            source={require("@/assets/icons/CourseVdo/iconLogo.png")}
          />
          <Text style={styles.points}>{Totalpoints}</Text>
        </View>
      </View>

      {showProgress && progressPct > 0 && (
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPct}%` as any }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: "#f6f0ff",
    flexDirection: "column",
    gap: 0,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    backgroundColor: "#FFFFFF59",
    borderRadius: 20,
    height: 46,
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    alignSelf: "flex-start",
    marginTop: 0,
    position: "absolute",
    left: 16,
    top: 0,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingLeft: 58,
    minHeight: 46,
  },
  titleBlock: {
    flex: 1,
    gap: 2,
    justifyContent: "center",
    minHeight: 46,
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
    color: "#0D0D0D",
    lineHeight: 22,
  },
  progressLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: "rgba(0,0,0,0.40)",
  },
  coinsBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
    paddingTop: 4,
    paddingLeft: 8,
  },
  headerCoin: {
    height: 18,
    width: 18,
  },
  points: {
    fontSize: 14,
    color: "#730A96",
    fontWeight: "700",
    fontFamily: "HelveticaNeue-Bold",
  },
  progressBarTrack: {
    height: 2,
    backgroundColor: "rgba(86,63,165,0.12)",
    borderRadius: 1,
    overflow: "hidden",
    marginTop: 8,
    marginLeft: 58,
  },
  progressBarFill: {
    height: 2,
    backgroundColor: "#563FA5",
    borderRadius: 1,
  },
});

export default CourseHeader;

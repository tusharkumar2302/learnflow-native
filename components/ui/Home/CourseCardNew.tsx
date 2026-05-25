import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LockIcon } from "@hugeicons/core-free-icons";
import currentVid from "@/stores/currentVid";

function formatDuration(minutes: number): string {
  if (!minutes || minutes <= 0) return "";
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

type CourseCardProps = {
  title: string;
  author: string;
  category: string;
  price: string;
  duration: { hours: string; seconds: string };
  image: string | null;
  orientation?: string;
  id: string;
  totalCoins: number;
  isUnlocked?: boolean | null;
  onLockedPress?: () => void;
  progressPercentage?: number;
};

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  author,
  category,
  duration,
  image,
  orientation,
  id,
  totalCoins,
  isUnlocked,
  onLockedPress,
  progressPercentage = 0,
}) => {
  const router = useRouter();
  const { setVidId } = currentVid();
  const isVertical = orientation === "vertical";

  const handlePress = () => {
    if (isUnlocked === false) {
      onLockedPress?.();
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setVidId(id);
    router.push({
      pathname: "/Authenticated/(tabs)/Courses/CourseDetail",
      params: { id },
    });
  };

  const durationMinutes = parseInt(duration.hours, 10);

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        s.card,
        isVertical ? s.cardVertical : s.cardHorizontal,
        isUnlocked === false && s.locked,
        pressed && { opacity: 0.93 },
      ]}
    >
      {/* Thumbnail */}
      <View style={[s.thumbWrap, isVertical ? s.thumbVertical : s.thumbHorizontal]}>
        {image ? (
          <Image source={{ uri: image }} style={s.thumb} resizeMode="cover" />
        ) : (
          <View style={[s.thumb, s.thumbFallback]} />
        )}
        {/* Category pill overlaid on thumbnail */}
        <View style={s.categoryPill}>
          <Text style={s.categoryText} numberOfLines={1}>{category}</Text>
        </View>
        {/* Lock overlay */}
        {isUnlocked === false && (
          <View style={s.lockOverlay}>
            <HugeiconsIcon icon={LockIcon} size={22} color="#FFFFFF" strokeWidth={1.5} />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={s.content}>
        <Text style={s.title} numberOfLines={2}>{title}</Text>

        <View style={s.metaRow}>
          <Text style={s.metaText}>{author}</Text>
          {durationMinutes > 0 && (
            <>
              <Text style={s.metaDot}>·</Text>
              <Text style={s.metaText}>{formatDuration(durationMinutes)}</Text>
            </>
          )}
        </View>

        {/* Coins badge */}
        {totalCoins > 0 && (
          <View style={s.coinRow}>
            <Image
              source={require("@/assets/icons/Coins/coin.png")}
              style={s.coinIcon}
            />
            <Text style={s.coinText}>{totalCoins} coins</Text>
          </View>
        )}

        {/* Progress bar */}
        {progressPercentage > 0 && (
          <View style={s.progressWrap}>
            <View style={s.progressTrack}>
              <View
                style={[
                  s.progressFill,
                  { width: `${Math.min(100, progressPercentage)}%` },
                ]}
              />
            </View>
            <Text style={s.progressLabel}>
              {progressPercentage >= 100 ? "Completed" : `${progressPercentage}%`}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default CourseCard;

const THUMB_HEIGHT_H = 140;
const THUMB_HEIGHT_V = 148;

const s = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
  },
  cardVertical: {
    flexDirection: "row",
    marginBottom: 12,
  },
  cardHorizontal: {
    flexDirection: "column",
    width: 220,
    marginRight: 14,
  },
  locked: {
    opacity: 0.65,
  },

  // ── Thumbnail ──────────────────────────────────────────
  thumbWrap: {
    position: "relative",
    overflow: "hidden",
  },
  thumbVertical: {
    width: "38%",
    height: THUMB_HEIGHT_V,
  },
  thumbHorizontal: {
    width: "100%",
    height: THUMB_HEIGHT_H,
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  thumbFallback: {
    backgroundColor: "#EDE9F9",
  },
  categoryPill: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    maxWidth: "85%",
  },
  categoryText: {
    fontFamily: "Poppins-Medium",
    fontSize: 10,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.40)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Content ────────────────────────────────────────────
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
    gap: 5,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 13.5,
    color: "#0D0D0D",
    lineHeight: 20,
  },
  metaRow: {
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

  // ── Coins ──────────────────────────────────────────────
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  coinIcon: {
    width: 13,
    height: 13,
  },
  coinText: {
    fontFamily: "Poppins-Medium",
    fontSize: 11,
    color: "#730A96",
  },

  // ── Progress ───────────────────────────────────────────
  progressWrap: {
    gap: 4,
    marginTop: 2,
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
});

import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  CheckmarkCircle01Icon,
  PlayCircleIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface LessonItemProps {
  order: number;
  title: string;
  estimatedDuration: number;
  coinValue: number;
  completed: boolean;
  isInProgress?: boolean;
  hasQuiz?: boolean;
  quizPassed?: boolean;
  onPlay: () => void;
  onStartQuiz?: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

const LessonItem: React.FC<LessonItemProps> = ({
  order,
  title,
  estimatedDuration,
  coinValue,
  completed,
  isInProgress = false,
  hasQuiz = false,
  quizPassed = false,
  onPlay,
  onStartQuiz,
}) => {
  const stateColor = completed ? "#16A34A" : isInProgress ? "#563FA5" : "#AAAAAA";

  return (
    <View>
      <Pressable style={styles.container} onPress={onPlay}>
        {/* Chapter order circle */}
        <View style={[styles.orderCircle, { borderColor: stateColor, backgroundColor: completed ? stateColor : "transparent" }]}>
          {completed ? (
            <HugeiconsIcon icon={Tick01Icon} size={13} color="#fff" strokeWidth={2.5} />
          ) : (
            <Text style={[styles.orderNum, { color: stateColor }]}>{order}</Text>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, isInProgress && styles.titleInProgress]} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>

          <View style={styles.meta}>
            {/* Duration */}
            <Text style={styles.duration}>{formatDuration(estimatedDuration)}</Text>

            {/* Coins */}
            <View style={styles.coinRow}>
              <Image style={styles.coinIcon} source={require("@/assets/icons/CourseVdo/iconLogo.png")} />
              <Text style={styles.coinText}>{coinValue}</Text>
            </View>

            {/* Quiz badge */}
            {hasQuiz && (
              <View style={[styles.quizBadge, quizPassed && styles.quizBadgePassed]}>
                {quizPassed ? (
                  <HugeiconsIcon icon={Tick01Icon} size={10} color="#16A34A" strokeWidth={2.5} />
                ) : null}
                <Text style={[styles.quizText, quizPassed && styles.quizTextPassed]}>
                  Quiz
                </Text>
              </View>
            )}

            {/* In progress label */}
            {isInProgress && !completed && (
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>In progress</Text>
              </View>
            )}
          </View>
        </View>

        {/* State icon */}
        <View style={styles.iconContainer}>
          {completed ? (
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={26} color="#16A34A" strokeWidth={1.5} />
          ) : isInProgress ? (
            <HugeiconsIcon icon={PlayCircleIcon} size={26} color="#563FA5" strokeWidth={1.5} />
          ) : (
            <HugeiconsIcon icon={PlayCircleIcon} size={26} color="#CCCCCC" strokeWidth={1.5} />
          )}
        </View>
      </Pressable>
      <View style={styles.divider} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  orderCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  orderNum: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    lineHeight: 14,
  },
  content: {
    flex: 1,
    gap: 5,
  },
  title: {
    fontSize: 14,
    fontFamily: "Teachers-Medium",
    color: "#1A1A1A",
    lineHeight: 20,
  },
  titleInProgress: {
    color: "#563FA5",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  duration: {
    fontSize: 12,
    color: "#00000066",
    fontFamily: "Poppins-Regular",
  },
  coinRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  coinIcon: {
    height: 13,
    width: 14,
  },
  coinText: {
    fontSize: 12,
    fontFamily: "Poppins-SemiBold",
    color: "#730A96",
  },
  quizBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: "rgba(86,63,165,0.08)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  quizBadgePassed: {
    backgroundColor: "rgba(22,163,74,0.08)",
  },
  quizText: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
    color: "#563FA5",
  },
  quizTextPassed: {
    color: "#16A34A",
  },
  progressBadge: {
    backgroundColor: "rgba(86,63,165,0.10)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  progressBadgeText: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
    color: "#563FA5",
  },
  iconContainer: {
    width: 30,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  divider: {
    height: 1,
    backgroundColor: "#0000000D",
    marginLeft: 52,
  },
});

export default LessonItem;

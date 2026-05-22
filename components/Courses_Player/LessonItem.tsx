import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

interface LessonItemProps {
  title: string;
  estimatedDuration: number;
  coinValue: number;
  completed: boolean;
  onPlay: () => void;
  onStartQuiz?: () => void;
}

const LessonItem: React.FC<LessonItemProps> = ({
  title,
  estimatedDuration,
  coinValue,
  completed,
  onPlay,
  onStartQuiz,
}) => {
  function formatSeconds(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <View>
      <Pressable style={styles.container} onPress={onPlay}>
        <View style={styles.leftCorner}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <View style={styles.meta}>
            <Image
              style={styles.badge}
              source={require("@/assets/icons/CourseVdo/iconLogo.png")}
            />
            <Text style={styles.point}>{coinValue}</Text>
            <Text style={styles.duration}>
              {formatSeconds(estimatedDuration)}min
            </Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          {completed ? (
            <Ionicons name="checkmark-circle" size={24} color="#9F11F5A6" />
          ) : (
            <Ionicons
              name="play-circle"
              size={24}
              color="#8A38F5A6"
              onPress={onPlay}
            />
          )}
        </View>
      </Pressable>
      <View style={styles.botomLine}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Teachers-Medium",
    color: "#000000A6",
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 2, marginTop: 5 },
  badge: { height: 15, width: 17 },
  duration: {
    fontSize: 14,
    color: "#00000066",
    fontFamily: "Teachers-Medium",
    fontWeight: "500",
    marginLeft: 3,
  },
  point: {
    fontSize: 13,
    fontFamily: "HelveticaNeue-Bold",
    fontWeight: "700",
    color: "#730A96",
  },
  leftCorner: {
    width: "90%",
  },
  iconContainer: {
    width: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  botomLine: {
    height: 1,
    backgroundColor: "#0000001A",
  },
});

export default LessonItem;

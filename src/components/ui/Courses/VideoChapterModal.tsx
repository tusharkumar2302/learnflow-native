import PrimaryPopUp from "@/components/Courses_Player/Buttons/PrimaryPopUp";
import PopUpBg from "@/components/Courses_Player/PopUpBg";
import { courseService } from "@/services";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

interface VideoChapterModalProps {
  onClose: () => void;
  courseId: string | string[];
  isEnrolled: boolean;
}

const VideoChapterModal = ({ onClose, courseId, isEnrolled }: VideoChapterModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnroll = async () => {
    if (isEnrolled) {
      onClose();
      return;
    }
    setIsLoading(true);
    try {
      await courseService.enrollCourse(courseId as string);
      onClose();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to enroll in the course. Please try again.";
      Alert.alert("Enrollment Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PopUpBg visible={true}>
      <View style={styles.container}>
        <Text style={styles.title}>How Zuper Learn{"\n"}Works?</Text>

        <View style={styles.rowContainer}>
          <View>
            <Image
              style={{ height: 68, width: 68 }}
              source={require("@/assets/icons/HowItWorks/courses-icon.png")}
              resizeMode="center"
            />
            <Text style={styles.rowTxt}>
              Watch Course {"\n"}
              Videos
            </Text>
          </View>

          <Image
            style={{ height: 25, width: 25 }}
            source={require("@/assets/icons/HowItWorks/arrow.png")}
          />

          <View style={{ alignItems: "center" }}>
            <Image
              style={{ height: 68, width: 68 }}
              source={require("@/assets/icons/HowItWorks/coins-icon.png")}
              resizeMode="center"
            />
            <Text style={styles.rowTxt}>
              Earn Coins while {"\n"}
              Learn Trading
            </Text>
          </View>

          <Image
            style={{ height: 25, width: 25 }}
            source={require("@/assets/icons/HowItWorks/arrow.png")}
          />

          <View style={{ alignItems: "center" }}>
            <Image
              style={{ height: 68, width: 68 }}
              source={require("@/assets/icons/HowItWorks/redeem-icon.png")}
              resizeMode="center"
            />
            <Text style={styles.rowTxt}>
              Redeem Coins{"\n"}for Rewards
            </Text>
          </View>
        </View>

        <View style={{ width: "100%", paddingHorizontal: 15 }}>
          <PrimaryPopUp
            styleView={styles.btnContainer}
            styleTxt={styles.btnText}
            title={
              isLoading
                ? "Enrolling..."
                : isEnrolled
                  ? "Continue Learning"
                  : "Start Learning"
            }
            onPress={handleEnroll}
          />
        </View>
      </View>
    </PopUpBg>
  );
};

export default VideoChapterModal;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontFamily: "Teachers-SemiBold",
    fontWeight: "600",
    fontSize: 24,
    color: "#000000",
    marginVertical: 20,
  },
  rowContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTxt: {
    textAlign: "center",
    fontFamily: "Teachers-Medium",
    fontWeight: "500",
    fontSize: 11,
    color: "#000000B2",
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Teachers-Medium",
  },
  btnContainer: {
    backgroundColor: "#CAA2FC",
    borderRadius: 13,
    marginTop: 40,
    elevation: 20,
    paddingVertical: 10,
  },
});

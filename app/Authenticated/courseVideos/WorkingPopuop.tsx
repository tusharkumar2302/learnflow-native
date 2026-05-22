import PrimaryPopUp from "@/components/Courses_Player/Buttons/PrimaryPopUp";
import PopUpBg from "@/components/Courses_Player/PopUpBg";
import { authStore } from "@/stores/authStore";
import axios from "axios";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";

interface WorkingPopuopProps {
  onClose: () => void;
  courseId: string | string[];
  isEnrolled: boolean;
}

const WorkingPopuop = ({
  onClose,
  courseId,
  isEnrolled,
}: WorkingPopuopProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = authStore();

  const handleEnroll = async () => {
    if (isEnrolled) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/courses/${courseId}/enroll`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Enrollment successful:", res.data);
      onClose();
    } catch (error: any) {
      console.error("Enrollment error:", error.response?.data || error);
      Alert.alert(
        "Enrollment Failed",
        error.response?.data?.message ||
          "Failed to enroll in the course. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <PopUpBg visible={true}>
      <View style={styles.container}>
        <Text style={styles.title}>How ZuperLearn {"\n"} Works?</Text>

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
              Redeem Earned {"\n"} Coins in Zuperior
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

export default WorkingPopuop;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
    // borderWidth: 2, 
    // borderColor: '#000'
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

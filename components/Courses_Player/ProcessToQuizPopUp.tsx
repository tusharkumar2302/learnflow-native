import PopUpBg from "@/components/Courses_Player/PopUpBg";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProcessToQuizPopUp = (coins: any) => {
  return (
    <PopUpBg visible={true}>
      <View style={styles.container}>
        <Image
          style={{ height: 150, width: 150, transform: [{ scale: 1.6 }] }}
          source={require("@/assets/icons/HowItWorks/coins-icon.png")}
          resizeMode="contain"
        />
        <View
          style={{
            width: "100%",
            paddingHorizontal: 6,
            alignItems: "center",
            gap: 15,
            marginTop: 18,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/Authenticated/QuizesPoint/HowQuizWorks",
                params: { coins: coins },
              })
            }
            style={styles.btnContainer}
          >
            <Text style={styles.btnText}>Process To Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PopUpBg>
  );
};

export default ProcessToQuizPopUp;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    padding: 20,
  },
  congoTxt: {
    textAlign: "center",
    fontFamily: "Teachers-SemiBold",
    fontWeight: "600",
    fontSize: 24,
    color: "#000000",
    marginVertical: 20,
  },
  spanTxt: {
    fontWeight: "500",
    fontFamily: "Teachers-Medium",
    fontSize: 24,
    color: "#730A96",
  },
  descriptext: {
    fontWeight: "500",
    fontFamily: "Teachers-Medium",
    fontSize: 18,
    textAlign: "center",
    color: "#0000008C",
    marginTop: 20,
  },
  btnContainer: {
    backgroundColor: "#CAA2FC",
    borderRadius: 13,
    marginTop: 20,
    elevation: 20,
    padding: 10,
  },
  btnText: {
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "Teachers-Medium",
    color: "#000",
  },
});

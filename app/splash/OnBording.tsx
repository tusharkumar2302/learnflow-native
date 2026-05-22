import React = require("react");
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

const { width } = Dimensions.get("window");

export default function OnboardingScreen() {
  return (
    <View
      style={styles.container}
    >
      {/* <StatusBar style="light" backgroundColor="#4C2EA7" /> */}

      {/* GIF Animation */}
      <Image source={require("@/assets/gif/Click.gif")} style={styles.gif} />

      {/* Trading Image */}
      <Image
        source={require("@/assets/images/trading.png")}
        style={styles.image}
      />

      {/* Heading */}
      <Text style={styles.heading}>Learning That Fuels Your Next Trade</Text>

      {/* Subheading */}
      <Text style={styles.subheading}>Your Forex Learning Partner</Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.replace("/Authentication/Auth")
          AsyncStorage.setItem('hasOnboarded','true');
        }}
      >
        <Text style={styles.buttonText}>Get Started</Text>
        <View style={styles.arrowCircle}>
          <Ionicons
            name="arrow-forward"
            size={moderateScale(28)}
            color={"#000"}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4C2EA7",
    justifyContent: "flex-start",
    alignItems: "center",
  },

  // GIF Style
  gif: {
    width: scale(455),
    height: verticalScale(300),
    resizeMode: "contain",
    marginTop: -verticalScale(60),
  },

  // Trading Image Style
  image: {
    width: scale(150),
    height: scale(150),
    alignSelf: "center",
    resizeMode: "contain",
  },

  // Heading
  heading: {
    width: "100%",
    paddingHorizontal: scale(10),
    fontSize: moderateScale(32),
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: moderateScale(44),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(10),
  },

  // Subheading
  subheading: {
    fontSize: moderateScale(16),
    color: "#FFFFFFA6",
    marginBottom: verticalScale(40),
    textAlign: "center",
  },

  // Button
  button: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: moderateScale(32),
    width: scale(300),
    height: verticalScale(56),
  },

  buttonText: {
    color: "#FFFFFFD9",
    fontSize: moderateScale(16),
    paddingLeft: scale(30),
    fontWeight: "500",
  },

  arrowCircle: {
    backgroundColor: "#c084fc",
    width: verticalScale(60),
    height: verticalScale(55),
    borderRadius: scale(100),
    alignItems: "center",
    justifyContent: "center",
  },
});

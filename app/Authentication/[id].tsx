import Login from "@/components/ui/Authentication/Login";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import OTP from "../../components/ui/Authentication/OTP";
import Success from "../../components/ui/Authentication/Success";
import OnboardingScreen from "../splash/OnBording";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import { AuthSlides } from "@/components/ui/Authentication/AuthSlides";

const Auth = () => {
  const { id } = useLocalSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState("false");

  // Prevent layout flash by delaying render slightly
  useEffect(() => {
    getOnboardingStatus();
    // Use requestAnimationFrame to ensure smooth initialization
    const frameId = requestAnimationFrame(() => {
      setTimeout(() => {
        setIsReady(true);
      }, 50);
    });

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  const getOnboardingStatus = async () => {
    const hasOnboardedTemp = await AsyncStorage.getItem("hasOnboarded");
    setHasOnboarded(hasOnboardedTemp);
    console.log(hasOnboardedTemp, "hasOnboardedTemp");
  };

  // Show loading state while initializing to prevent flash
  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#730A96" />
      </View>
    );
  }
  return hasOnboarded !== "true" ? (
    <OnboardingScreen />
  ) : (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#DCC0FF" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 5,
          }}
          style={{ backgroundColor: "#DCC0FF" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {id !== "success" && <AuthSlides />}

            {id === "success" && (
              <View style={styles.imageContainer}>
                <Image
                  source={require("@/assets/images/authSuccess.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
            )}

            {/* Dynamic component based on route param */}

            {id === "otp" ? (
              <OTP />
            ) : id === "success" ? (
              <Success />
            ) : (
              <Login />
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Auth;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#DCC0FF",
  },

  keyboardView: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
    backgroundColor: "#DCC0FF",
  },

  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(30),
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#DCC0FF",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#DCC0FF",
    paddingHorizontal: scale(12),
    paddingTop: verticalScale(20),
  },

  heading: {
    fontSize: moderateScale(32),
    fontFamily: "Teachers-SemiBold",
    color: "#000",
    marginLeft: scale(20),
  },

  subheading: {
    fontSize: moderateScale(14),
    color: "#333",
    fontFamily: "HelveticaNeue-Medium",
    marginTop: verticalScale(10),
    marginLeft: scale(20),
    lineHeight: verticalScale(20),
  },

  image: {
    width: "100%",
    height: verticalScale(320),
    position: "absolute",
    zIndex: 1,
    alignSelf: "center",
  },

  imageContainer: {
    height: verticalScale(230),
    top: verticalScale(-35),
  },
});

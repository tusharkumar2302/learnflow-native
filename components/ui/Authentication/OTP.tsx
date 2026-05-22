import { authStore } from "@/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function OTP() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(59);
  const [otp, setOtp] = useState("");
  const { token, setToken, email, setemail } = authStore();
  const [inValidOtp, setinValidOtp] = useState(false);
  const [verifyDisable, setverifyDisable] = useState(true);
  const [resend, setresend] = useState(false);

  //for keyboard visibility
  const [keyBoardOn, setkeyBoardOn] = useState(false);

  useEffect(() => {
    const keyboardVisible = Keyboard.addListener("keyboardDidShow", () => {
      setkeyBoardOn(true);
    });

    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      setkeyBoardOn(false);
    });

    return () => {
      keyboardVisible.remove();
      keyboardHide.remove();
    };
  }, []);

  const verifyOtpBtn = useCallback(async () => {
    setinValidOtp(false);
    setIsVerifying(true);
    // Dummy Apple tester OTP

    try {
      const apiUrl = `${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin/verify-otp`;
      const payload = { email: email?.trim().toLowerCase(), otp: otp.trim() };

      console.log("🌐 VERIFY OTP API URL:", apiUrl);
      console.log("🚀 VERIFY OTP REQUEST BODY:", payload);

      const res = await axios.post(apiUrl, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ VERIFY OTP RESPONSE:", res.data);

      if (res.data.success) {
        console.log("Login successful");
        await AsyncStorage.setItem("authToken", res.data.data.token);
        setToken(res.data.data.token);
        setemail(email?.trim().toLowerCase() || "");
        router.replace("/Authentication/success");
      } else {
        console.log("❌ VERIFY OTP FAILED:", res.data);
        setinValidOtp(true);
      }
    } catch (error: any) {
      console.log(
        "💥 VERIFY OTP ERROR:",
        error?.response?.data || error.message || error,
      );
      setinValidOtp(true);
    } finally {
      setIsVerifying(false);
    }
  }, [otp, setToken, email, setemail]);

  const handleHelpPress = () => {
    // Contact email — configure before going live
    Linking.openURL(
      "mailto:support@example.com?subject=Need%20Help&body=Describe%20your%20issue",
    );
  };

  //timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setresend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [resend]);

  //disable otpBtn
  useEffect(() => {
    if (otp.length === 6) {
      setverifyDisable(false);
    } else {
      setverifyDisable(true);
    }
  }, [otp]);

  //resend OTP request
  const ResendOtpReq = useCallback(async () => {
    try {
      console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin/send-otp`,
        { email: email },
        { headers: { "Content-Type": "application/json" } },
      );

      console.log(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/signin/send-otp`,
      );

      const arr = res.data.data;

      if (res.data.success) {
        console.log("OTP send successfully!");
      } else {
        console.log("Something went wrong");
        console.log(res.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [email]);

  // OTP input ref
  const otpRef = useRef<any>(null);

  return (
    <LinearGradient
      colors={["#0B0B0D", "#191321"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.formContainer}
    >
      <View style={styles.container}>
        <View style={{ padding: 25 }}>
          <Text style={styles.title}>OTP Verification</Text>

          <Text style={styles.description}>
            Enter the 6-digit code sent to your email. This code is valid for the
            next 10 minutes.
          </Text>

          {inValidOtp && (
            <Text
              style={{
                color: "red",
                alignSelf: "center",
                marginTop: 5,
              }}
            >
              * Invalid OTP
            </Text>
          )}
        </View>

        <View style={styles.otpWrapper}>
          <OtpInput
            ref={otpRef}
            numberOfDigits={6}
            onTextChange={setOtp}
            focusColor="#B993F0"
            autoFocus={true}
            theme={{
              containerStyle: styles.otpContainer,
              pinCodeContainerStyle: styles.otpBox,
              pinCodeTextStyle: styles.otpText,
              focusedPinCodeContainerStyle: styles.otpBoxFocused,
            }}
          />
        </View>

        <TouchableOpacity
          style={{ marginVertical: 5 }}
          disabled={isResending || timer > 0}
          onPress={async () => {
            setIsResending(true);
            try {
              await ResendOtpReq();
              setTimer(59);
              setresend(false);
              Alert.alert("Success", "New OTP sent!");
            } catch {
              Alert.alert("Error", "Failed to resend OTP");
            } finally {
              setIsResending(false);
            }
          }}
        >
          {timer !== 0 ? (
            <Text style={[styles.resendText, { opacity: 0.6 }]}>
              Resend (00:{timer < 10 ? `0${timer}` : timer})
            </Text>
          ) : isResending ? (
            <Text style={[styles.resendText, { color: "#B993F0" }]}>
              Sending...
            </Text>
          ) : (
            <Text style={[styles.resendText, { color: "#fff" }]}>
              Resend
            </Text>
          )}
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 25, marginTop: 3 }}>
          <TouchableOpacity
            style={[
              styles.verifyBtn,
              (isVerifying || verifyDisable) && styles.disabledButton,
            ]}
            onPress={verifyOtpBtn}
            disabled={isVerifying || verifyDisable}
          >
            {isVerifying ? (
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                }}
              >
                <ActivityIndicator size="small" color="#000" />
                <Text style={styles.verifyBtnText}>Verifying...</Text>
              </View>
            ) : (
              <Text style={styles.verifyBtnText}>Verify</Text>
            )}
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 10,
              marginBottom: 15,
            }}
          >
            <Text style={{ color: "#aaa", fontSize: 12 }}>
              Didn’t receive any code?{" "}
            </Text>
            <TouchableOpacity onPress={handleHelpPress}>
              <Text
                style={{
                  color: "#563FA5",
                  textDecorationLine: "underline",
                }}
              >
                Help Centre
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  formContainer: {
    flex: 1,
    // marginTop: verticalScale(10),
    borderRadius: moderateScale(10),
    padding: scale(10),
  },

  keyboardAvoidingInner: {
    flex: 1,
  },

  keyboardAvoidingView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: verticalScale(10),
  },

  disabledButton: {
    opacity: 0.6,
  },

  container: {},

  title: {
    color: "#fff",
    fontSize: moderateScale(20),
    fontWeight: "600",
    textAlign: "center",
    marginBottom: verticalScale(10),
  },

  description: {
    color: "#FFFFFFD9",
    textAlign: "center",
    marginBottom: verticalScale(0),
    fontSize: moderateScale(13),
    fontWeight: "400",
  },

  bold: {
    color: "#fff",
  },

  otpWrapper: {
    paddingHorizontal: scale(15),
    marginBottom: verticalScale(15),
    overflow: "hidden",
  },

  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    gap: scale(6),
  },

  otpBox: {
    borderRadius: moderateScale(8),
    borderWidth: scale(1),
    borderColor: "#2e2e2e",
    backgroundColor: "#1C1C1E",
    flex: 1,
    maxWidth: scale(48),
    height: verticalScale(48),
    minWidth: 0,
  },

  otpBoxFocused: {
    borderColor: "#563FA5",
    borderWidth: scale(2),
  },

  otpText: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "600",
  },

  resendText: {
    color: "#FFFFFF99",
    textAlign: "center",
    fontSize: moderateScale(13),
  },

  verifyBtn: {
    backgroundColor: "#563FA5",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    alignItems: "center",
    marginTop: verticalScale(10),
  },

  verifyText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontWeight: "600",
  },

  guestBtn: {
    borderColor: "#fff",
    borderWidth: scale(1),
    borderRadius: moderateScale(30),
    paddingVertical: verticalScale(14),
    alignItems: "center",
    marginBottom: verticalScale(20),
  },

  guestText: {
    color: "#000000A6",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },

  footerText: {
    color: "#aaa",
    textAlign: "center",
    fontSize: moderateScale(13),
  },

  helpText: {
    color: "#563FA5",
    textDecorationLine: "underline",
    fontSize: moderateScale(13),
  },

  verifyButton: {
    backgroundColor: "#563FA5",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    alignItems: "center",
    marginTop: verticalScale(8),
  },

  verifyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },

  guestButton: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    alignItems: "center",
    marginTop: verticalScale(10),
  },
});

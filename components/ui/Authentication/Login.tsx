import { authStore } from "@/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function Login() {
  const { redirect, courseID } = useLocalSearchParams();
  const { token, setToken, setemail, setPendingRedirect } = authStore();
  const [email, setEmail] = useState<string>("");
  const [inValidEmail, setinValidEmail] = useState(false);
  const [error, setError] = useState("");
  //for keyboard visibility
  const [keyBoardOn, setkeyBoardOn] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;
  const [isLoadingOtp, setIsLoadingOtp] = useState(false);
  useEffect(() => {
    //on component mounting
    //1
    const keyboardVisible = Keyboard.addListener("keyboardDidShow", () => {
      setkeyBoardOn(true);
    });

    //2
    const keyboardHide = Keyboard.addListener("keyboardDidHide", () => {
      setkeyBoardOn(false);
    });

    //on component unmounting
    return () => {
      keyboardVisible.remove();
      keyboardHide.remove();
    };
  }, []);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("authToken");
        if (savedToken) {
          setToken(savedToken);
          router.replace("/Authenticated/Home");
        }
      } catch (error) {
        console.error("Error loading token:", error);
      }
    };
    loadToken();
  }, [setToken]);

const otpReq = useCallback(async () => {
  if (!isValidEmail(email)) {
    setinValidEmail(true);
    setErrorMsg("Please enter a valid email address");
    return;
  }

  setinValidEmail(false);
  setIsLoadingOtp(true);
  setErrorMsg("");

  try {
    const otpRes = await axios.post(
      `${baseUrl}/api/auth/signin/send-otp`,
      { email },
      { headers: { "Content-Type": "application/json" } }
    );

    if (!otpRes.data.success) {
      setErrorMsg("Failed to send OTP. Please try again.");
      return;
    }

    setemail(email);
    router.replace("/Authentication/otp");
  } catch (err) {
    console.error("Send OTP error:", err);
    setErrorMsg("Failed to send OTP. Please try again.");
  } finally {
    setIsLoadingOtp(false);
  }
}, [email, baseUrl, setemail]);

  // Email validation
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <LinearGradient
      colors={["#0B0B0D", "#191321"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.formContainer]}
    >
      <View>
        <View style={{ alignItems: "center", gap: 5 }}>
          <Text style={styles.loginTitle}>Login with Zuperior Credentials</Text>
          {/* <Text style={styles.credentialText}>
            Enter your Zuperior Credentials
          </Text> */}
        </View>

        <View style={[styles.inputContainer, { paddingHorizontal: 0 }]}>
          <View
            style={{ backgroundColor: "#FFFFFF14", borderRadius: 8, flex: 1 }}
          >
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#FFFFFF80"
              style={styles.input}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (inValidEmail) {
                  setinValidEmail(false);
                  setErrorMsg("");
                }
              }}
              autoCapitalize="none"
              keyboardType={"email-address"}
            />
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.signInButton,
            { marginTop: 20, marginBottom: 20 },
            isLoadingOtp && styles.disabledButton, // optional: gray out
          ]}
          onPress={otpReq}
          disabled={isLoadingOtp || !email.trim() || inValidEmail} // disable if loading or empty
        >
          {isLoadingOtp ? (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <ActivityIndicator color="#000" size="small" />
              <Text style={styles.signInText}>Sending OTP...</Text>
            </View>
          ) : (
            <Text style={styles.signInText}>Get OTP</Text>
          )}
        </TouchableOpacity>

        {errorMsg ? (
          <Text style={{ color: "#FF4D4F", fontSize: 12, marginTop: 5 }}>
            {errorMsg}{" "}
          </Text>
        ) : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    marginTop: verticalScale(20),
    borderRadius: moderateScale(10),
    padding: scale(15),
  },

  loginTitle: {
    color: "#fff",
    fontSize: moderateScale(18),
    fontWeight: "500",
    marginVertical: verticalScale(10),
  },

  disabledButton: {
    opacity: 0.6,
  },

  credentialText: {
    color: "#aaa",
    fontSize: moderateScale(12),
    marginBottom: verticalScale(10),
    marginTop: verticalScale(5),
    textAlign: "center",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: moderateScale(10),
    paddingHorizontal: scale(10),
    marginTop: verticalScale(8),
    height: verticalScale(40),
    // gap: scale(7),
  },

  input: {
    flex: 1,
    color: "#fff",
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(10),
    fontSize: moderateScale(14),
    borderColor: "#FFFFFF40",
    borderWidth: 1,
    borderRadius: moderateScale(8),
  },

  forgotText: {
    color: "#CAA2FC",
    fontSize: moderateScale(12),
    textAlign: "left",
    // marginBottom: verticalScale(6),
    fontWeight: "600",
  },

  signInButton: {
    backgroundColor: "#563FA5",
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(12),
    alignItems: "center",
    // marginTop: verticalScale(8),
  },

  signInText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: moderateScale(14),
  },

  guestButton: {
    backgroundColor: "#fff",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(12),
    alignItems: "center",
    marginTop: verticalScale(10),
  },

  guestText: {
    color: "#000000A6",
    fontWeight: "700",
    fontSize: moderateScale(14),
  },
});

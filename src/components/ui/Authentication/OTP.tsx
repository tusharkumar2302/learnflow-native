import { authService } from "@/services";
import { authStore } from "@/stores/authStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "@/theme";
import { PrimaryButton } from "@/components/ui/primitives";

export default function OTP({ lightMode = false }: { lightMode?: boolean }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(3);
  const [otp, setOtp] = useState("");
  const { setToken, email, setEmail } = authStore();
  const [invalidOtp, setInvalidOtp] = useState(false);
  const [verifyDisabled, setVerifyDisabled] = useState(true);
  const [resend, setResend] = useState(false);
  const otpRef = useRef<any>(null);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [resend]);

  useEffect(() => {
    setVerifyDisabled(otp.length !== 6);
  }, [otp]);

  const verifyOtp = useCallback(async () => {
    setInvalidOtp(false);
    setIsVerifying(true);
    try {
      await new Promise((r) => setTimeout(r, 600));
      const result = await authService.verifyOTP(
        email?.trim().toLowerCase() || "",
        otp.trim()
      );
      await AsyncStorage.setItem("authToken", result.token);
      setToken(result.token);
      setEmail(email?.trim().toLowerCase() || "");
      router.replace("/Authentication/success");
    } catch {
      setInvalidOtp(true);
    } finally {
      setIsVerifying(false);
    }
  }, [otp, setToken, email, setEmail]);

  const resendOtp = useCallback(async () => {
    await authService.requestOTP(email || "");
    await new Promise((r) => setTimeout(r, 400));
  }, [email]);

  return (
    <View style={s.root}>
      <Text style={[s.hint, lightMode && { color: "rgba(0,0,0,0.50)" }]}>
        Enter the 6-digit code sent to your email.
      </Text>

      {invalidOtp && (
        <Text style={s.error}>Incorrect code — please try again.</Text>
      )}

      <View style={s.otpWrap}>
        <OtpInput
          ref={otpRef}
          numberOfDigits={6}
          onTextChange={setOtp}
          focusColor={colors.brand.primary}
          autoFocus
          theme={{
            containerStyle: s.otpContainer,
            pinCodeContainerStyle: lightMode ? sl.otpBox : s.otpBox,
            pinCodeTextStyle: lightMode ? sl.otpText : s.otpText,
            focusedPinCodeContainerStyle: lightMode ? sl.otpBoxFocused : s.otpBoxFocused,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={async () => {
          setIsResending(true);
          try {
            await resendOtp();
            setTimer(3);
            setResend(false);
          } finally {
            setIsResending(false);
          }
        }}
        disabled={isResending || timer > 0}
        style={s.resendBtn}
      >
        {timer > 0 ? (
          <Text style={[s.resend, lightMode && { color: "rgba(0,0,0,0.30)" }, s.resendDim]}>
            Resend in 00:{timer < 10 ? `0${timer}` : timer}
          </Text>
        ) : isResending ? (
          <Text style={[s.resend, { color: colors.brand.primary }]}>Sending…</Text>
        ) : (
          <Text style={[s.resend, { color: colors.brand.primary }]}>Resend code</Text>
        )}
      </TouchableOpacity>

      <PrimaryButton
        label={isVerifying ? "Verifying…" : "Verify & Continue"}
        onPress={verifyOtp}
        loading={isVerifying}
        disabled={verifyDisabled}
      />
    </View>
  );
}

const sl = StyleSheet.create({
  otpBox: {
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.12)",
    backgroundColor: "rgba(0,0,0,0.04)",
    flex: 1,
    maxWidth: scale(48),
    height: verticalScale(54),
    minWidth: 0,
  },
  otpBoxFocused: {
    borderColor: "rgba(124,58,237,0.40)",
    borderWidth: 1.5,
    backgroundColor: "rgba(124,58,237,0.05)",
  },
  otpText: {
    color: "#0D0D0D",
    fontSize: moderateScale(20),
    fontFamily: "Poppins-SemiBold",
  },
});

const s = StyleSheet.create({
  root: {
    gap: verticalScale(4),
  },
  hint: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(13),
    color: colors.text.secondary,
    marginBottom: verticalScale(4),
  },
  error: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(12),
    color: colors.error,
    marginBottom: verticalScale(4),
  },
  otpWrap: {
    marginVertical: verticalScale(16),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scale(6),
  },
  otpBox: {
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.border.subtle,
    backgroundColor: colors.bg.surface,
    flex: 1,
    maxWidth: scale(48),
    height: verticalScale(54),
    minWidth: 0,
  },
  otpBoxFocused: {
    borderColor: colors.border.accent,
    borderWidth: 1.5,
    backgroundColor: colors.brand.dim,
  },
  otpText: {
    color: colors.text.primary,
    fontSize: moderateScale(20),
    fontFamily: "Poppins-SemiBold",
  },
  resendBtn: {
    alignSelf: "center",
    paddingVertical: verticalScale(4),
    marginBottom: verticalScale(8),
  },
  resend: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(13),
    color: colors.text.secondary,
    textAlign: "center",
  },
  resendDim: {
    opacity: 0.45,
  },
});

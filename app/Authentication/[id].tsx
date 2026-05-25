import Login from "@/components/ui/Authentication/Login";
import OTP from "@/components/ui/Authentication/OTP";
import Success from "@/components/ui/Authentication/Success";
import SignUp from "@/components/ui/Authentication/SignUp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authStore } from "@/stores/authStore";
import { useLocalSearchParams } from "expo-router";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "@/theme";
import OnboardingScreen from "../splash/OnBording";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const HERO_HEIGHT = SCREEN_H * 0.40;

const COPY: Record<string, { headline: string; sub: string }> = {
  login: {
    headline: "Sign in.",
    sub: "Access your ZuperLearn account.",
  },
  signup: {
    headline: "Create account.",
    sub: "Start learning the markets today.",
  },
  otp: {
    headline: "Check your inbox.",
    sub: "6-digit code sent to your email.",
  },
};

const STATS = [
  { label: "30 Chapters" },
  { label: "5 Courses" },
  { label: "Free Access" },
];

const Auth = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [isReady, setIsReady] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<string | null>(null);
  const { email } = authStore();
  const insets = useSafeAreaInsets();

  const route = id ?? "login";

  useEffect(() => {
    AsyncStorage.getItem("hasOnboarded").then((v) => {
      setHasOnboarded(v);
      requestAnimationFrame(() => setTimeout(() => setIsReady(true), 50));
    });
  }, []);

  if (!isReady) {
    return (
      <View style={s.loading}>
        <StatusBar style="light" />
        <ActivityIndicator size="small" color={colors.brand.glow} />
      </View>
    );
  }

  if (hasOnboarded !== "true") {
    return <OnboardingScreen />;
  }

  if (route === "success") {
    return <Success />;
  }

  const showBack = route !== "login";
  const copy = COPY[route] ?? COPY.login;

  return (
    <View style={s.root}>
      <StatusBar style="light" />

      {/* ── Dark Hero Section ─────────────────────────────────── */}
      <View style={[s.hero, { height: HERO_HEIGHT }]}>
        <Image
          source={require("@/assets/images/Login-image.png")}
          style={StyleSheet.absoluteFillObject}
          resizeMode="cover"
        />
        {/* Dark overlay */}
        <LinearGradient
          colors={["rgba(10,6,20,0.30)", "rgba(10,6,20,0.72)", "#0A0614"]}
          locations={[0, 0.65, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {/* Top row: back button */}
        <View
          style={[
            s.heroTop,
            { paddingTop: insets.top + verticalScale(8) },
          ]}
        >
          {showBack && (
            <Pressable
              onPress={() => router.back()}
              style={s.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <HugeiconsIcon
                icon={ArrowLeft01Icon}
                size={moderateScale(18)}
                color="rgba(255,255,255,0.80)"
                strokeWidth={2}
              />
            </Pressable>
          )}
        </View>

        {/* Bottom overlay: brand + stats */}
        <View style={s.heroBottom}>
          <Image
            source={require("@/assets/icons/zuper-logo.png")}
            style={s.logoImg}
            resizeMode="contain"
          />
          <Text style={s.heroHeadline}>Master the{"\n"}Markets.</Text>
          <View style={s.statsRow}>
            {STATS.map((stat, i) => (
              <View key={i} style={s.statPill}>
                <Text style={s.statText}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* ── White Card Bottom ─────────────────────────────────── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={s.card}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[
                s.cardScroll,
                { paddingBottom: Math.max(insets.bottom + verticalScale(16), verticalScale(32)) },
              ]}
            >
              {/* Form headline */}
              <View style={s.formHeadline}>
                <Text style={s.formTitle}>{copy.headline}</Text>
                <Text style={s.formSub}>
                  {route === "otp" && email
                    ? `Code sent to ${email}.`
                    : copy.sub}
                </Text>
              </View>

              {/* Form */}
              {route === "otp" ? (
                <OTP lightMode />
              ) : route === "signup" ? (
                <SignUp lightMode />
              ) : (
                <Login lightMode />
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Auth;

const s = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.bg.base,
    justifyContent: "center",
    alignItems: "center",
  },
  root: {
    flex: 1,
    backgroundColor: "#0A0614",
  },

  // ── Hero ────────────────────────────────────────────────────
  hero: {
    position: "relative",
    overflow: "hidden",
  },
  heroTop: {
    paddingHorizontal: scale(20),
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroBottom: {
    position: "absolute",
    bottom: verticalScale(20),
    left: scale(24),
    right: scale(24),
  },
  logoImg: {
    width: scale(100),
    height: verticalScale(20),
    marginBottom: verticalScale(8),
    opacity: 0.85,
  },
  heroHeadline: {
    fontFamily: "Teachers-Bold",
    fontSize: moderateScale(32),
    color: "#FFFFFF",
    lineHeight: moderateScale(40),
    letterSpacing: -0.5,
    marginBottom: verticalScale(12),
  },
  statsRow: {
    flexDirection: "row",
    gap: scale(8),
    flexWrap: "wrap",
  },
  statPill: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: scale(20),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
  },
  statText: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(11),
    color: "rgba(255,255,255,0.70)",
    letterSpacing: 0.2,
  },

  // ── White card ──────────────────────────────────────────────
  card: {
    flex: 1,
    backgroundColor: "#FAFAF9",
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    overflow: "hidden",
  },
  cardScroll: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
    paddingTop: verticalScale(24),
  },
  formHeadline: {
    marginBottom: verticalScale(20),
    gap: verticalScale(4),
  },
  formTitle: {
    fontFamily: "Teachers-Bold",
    fontSize: moderateScale(26),
    color: "#0D0D0D",
    lineHeight: moderateScale(34),
  },
  formSub: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(13),
    color: "rgba(0,0,0,0.45)",
    lineHeight: moderateScale(20),
  },
});

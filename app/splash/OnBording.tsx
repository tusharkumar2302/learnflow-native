import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import PagerView from "react-native-pager-view";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const BG = "#08040F";
const ACCENT = "#A78BFA";
const BTN_FROM = "#5B21B6";
const BTN_TO = "#7C3AED";

type Part = { text: string; accent?: boolean };

interface Slide {
  image: ImageSourcePropType;
  headline: Part[];
  sub: string;
}

const SLIDES: Slide[] = [
  {
    image: require("@/assets/images/Onboarding1.png"),
    headline: [{ text: "Learn Forex\n" }, { text: "Visually", accent: true }],
    sub: "Structured lessons on price action, chart patterns, and risk — built on real market logic.",
  },
  {
    image: require("@/assets/images/Onboarding2.png"),
    headline: [
      { text: "Practice With\n" },
      { text: "Confidence", accent: true },
    ],
    sub: "Apply strategies, track your progress, and build the discipline of a consistent trader.",
  },
  {
    image: require("@/assets/images/Onboarding3.png"),
    headline: [
      { text: "Understand\n" },
      { text: "Global Markets", accent: true },
    ],
    sub: "Navigate major currency pairs and develop the mindset to trade with clarity.",
  },
];

// ─── Floating illustration ────────────────────────────────────────────────────

function Hero({ source }: { source: ImageSourcePropType }) {
  const y = useSharedValue(0);

  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 3200, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 3200, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  return (
    <Animated.Image
      source={source}
      style={[styles.heroImg, useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }))]}
      resizeMode="contain"
    />
  );
}

// ─── Dot ─────────────────────────────────────────────────────────────────────

function Dot({ active }: { active: boolean }) {
  const w = useSharedValue(active ? scale(20) : scale(5));
  const o = useSharedValue(active ? 1 : 0.22);

  useEffect(() => {
    w.value = withTiming(active ? scale(20) : scale(5), {
      duration: 300,
      easing: Easing.out(Easing.quad),
    });
    o.value = withTiming(active ? 1 : 0.22, { duration: 300 });
  }, [active]);

  return (
    <Animated.View
      style={[styles.dot, useAnimatedStyle(() => ({ width: w.value, opacity: o.value }))]}
    />
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const { bottom } = useSafeAreaInsets();

  const finish = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/Authentication/login");
  };

  const next = () =>
    page < SLIDES.length - 1 ? pagerRef.current?.setPage(page + 1) : finish();

  return (
    <View style={styles.root}>
      <StatusBar style="light" backgroundColor={BG} />

      {/* Background — single dark base, one gentle ambient glow */}
      <LinearGradient
        colors={["#0E0622", BG, BG]}
        locations={[0, 0.38, 1]}
        style={StyleSheet.absoluteFillObject}
      />
      <LinearGradient
        colors={["rgba(91,33,182,0.14)", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 0.8 }}
        style={styles.ambientGlow}
        pointerEvents="none"
      />

      {/* Pager */}
      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {SLIDES.map((slide, i) => (
          <View key={i} style={styles.slide}>
            {/* Illustration */}
            <View style={styles.heroArea}>
              <Hero source={slide.image} />
              <LinearGradient
                colors={["rgba(8,4,15,0)", "rgba(8,4,15,0.88)"]}
                locations={[0.3, 1]}
                style={styles.heroFade}
                pointerEvents="none"
              />
            </View>

            {/* Copy */}
            <View style={styles.copy}>
              <Text style={styles.headline}>
                {slide.headline.map((p, j) => (
                  <Text key={j} style={p.accent ? styles.accent : undefined}>
                    {p.text}
                  </Text>
                ))}
              </Text>
              <Text style={styles.sub}>{slide.sub}</Text>
            </View>
          </View>
        ))}
      </PagerView>

      {/* Controls */}
      <View style={[styles.controls, { paddingBottom: Math.max(bottom + verticalScale(16), verticalScale(36)) }]}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => <Dot key={i} active={page === i} />)}
        </View>

        <TouchableOpacity onPress={next} activeOpacity={0.78} style={styles.btnOuter}>
          <LinearGradient
            colors={[BTN_FROM, BTN_TO]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnLabel}>
              {page === SLIDES.length - 1 ? "Enter the Market" : "Continue"}
            </Text>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              size={moderateScale(16)}
              color="rgba(255,255,255,0.75)"
              strokeWidth={2}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: BG,
  },

  ambientGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width * 0.80,
    height: height * 0.45,
  },

  pager: {
    flex: 1,
  },

  slide: {
    flex: 1,
    backgroundColor: "transparent",
  },

  // Illustration takes top 56% — plenty of breathing room
  heroArea: {
    flex: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  heroImg: {
    width: width * 0.82,
    height: height * 0.44,
  },
  heroFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: verticalScale(110),
  },

  // Copy takes bottom 44%
  copy: {
    flex: 44,
    paddingHorizontal: scale(28),
    paddingTop: verticalScale(8),
    gap: verticalScale(12),
  },
  headline: {
    fontFamily: "Teachers-Bold",
    fontSize: moderateScale(38),
    color: "#FFFFFF",
    lineHeight: moderateScale(48),
    letterSpacing: -0.3,
  },
  accent: {
    color: ACCENT,
  },
  sub: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(14),
    color: "rgba(255,255,255,0.42)",
    lineHeight: moderateScale(22),
    maxWidth: width * 0.80,
  },

  // Controls pinned below pager
  controls: {
    paddingHorizontal: scale(28),
    paddingTop: verticalScale(12),
    gap: verticalScale(18),
  },

  dots: {
    flexDirection: "row",
    gap: scale(5),
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    height: scale(3),
    borderRadius: scale(2),
    backgroundColor: "#A78BFA",
  },

  // CTA — slim, centered, clean
  btnOuter: {
    borderRadius: scale(50),
    shadowColor: BTN_FROM,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.38,
    shadowRadius: 18,
    elevation: 10,
  },
  btn: {
    height: verticalScale(52),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: scale(6),
    borderRadius: scale(50),
  },
  btnLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: moderateScale(15),
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

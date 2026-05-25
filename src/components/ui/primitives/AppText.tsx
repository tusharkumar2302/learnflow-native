import React from "react";
import { Text, TextStyle, StyleProp } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors } from "@/theme";

export type TextVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyMedium"
  | "bodySemiBold"
  | "small"
  | "smallMedium"
  | "micro"
  | "microMedium";

export type TextColor = "primary" | "secondary" | "muted" | "accent";

interface AppTextProps {
  variant?: TextVariant;
  color?: TextColor;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
  numberOfLines?: number;
  onPress?: () => void;
}

const VARIANT_STYLES: Record<TextVariant, TextStyle> = {
  display: {
    fontFamily: "Teachers-Bold",
    fontSize: moderateScale(38),
    lineHeight: moderateScale(46),
    letterSpacing: -0.3,
  },
  h1: {
    fontFamily: "Teachers-Bold",
    fontSize: moderateScale(32),
    lineHeight: moderateScale(40),
    letterSpacing: -0.2,
  },
  h2: {
    fontFamily: "Teachers-SemiBold",
    fontSize: moderateScale(24),
    lineHeight: moderateScale(32),
  },
  h3: {
    fontFamily: "Teachers-SemiBold",
    fontSize: moderateScale(18),
    lineHeight: moderateScale(26),
  },
  body: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
  },
  bodyMedium: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
  },
  bodySemiBold: {
    fontFamily: "Poppins-SemiBold",
    fontSize: moderateScale(14),
    lineHeight: moderateScale(22),
  },
  small: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
  },
  smallMedium: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
  },
  micro: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
  },
  microMedium: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
  },
};

const COLOR_MAP: Record<TextColor, string> = {
  primary:   colors.text.primary,
  secondary: colors.text.secondary,
  muted:     colors.text.muted,
  accent:    colors.text.accent,
};

export function AppText({
  variant = "body",
  color = "primary",
  style,
  children,
  numberOfLines,
  onPress,
}: AppTextProps) {
  return (
    <Text
      style={[VARIANT_STYLES[variant], { color: COLOR_MAP[color] }, style]}
      numberOfLines={numberOfLines}
      onPress={onPress}
    >
      {children}
    </Text>
  );
}

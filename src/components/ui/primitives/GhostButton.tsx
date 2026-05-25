import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "@/theme";

interface GhostButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function GhostButton({
  label,
  onPress,
  disabled = false,
  style,
  fullWidth = true,
}: GhostButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.72}
      style={[s.btn, !fullWidth && s.inline, disabled && s.inactive, style]}
    >
      <Text style={s.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  btn: {
    height: verticalScale(52),
    borderRadius: scale(999),
    borderWidth: 1,
    borderColor: colors.border.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(28),
  },
  inline: {
    alignSelf: "flex-start",
  },
  inactive: {
    opacity: 0.45,
  },
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: moderateScale(15),
    color: colors.brand.glow,
    letterSpacing: 0.3,
  },
});

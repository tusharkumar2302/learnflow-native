import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  style,
  fullWidth = true,
}: PrimaryButtonProps) {
  const isInactive = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isInactive}
      activeOpacity={0.80}
      style={[s.shadow, !fullWidth && s.inline, style]}
    >
      <LinearGradient
        colors={["#6D28D9", "#7C3AED"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[s.btn, isInactive && s.inactive]}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={s.label}>{label}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  shadow: {
    borderRadius: scale(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 6,
    elevation: 4,
  },
  inline: {
    alignSelf: "flex-start",
  },
  btn: {
    height: verticalScale(50),
    borderRadius: scale(10),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(28),
  },
  inactive: {
    opacity: 0.45,
  },
  label: {
    fontFamily: "Poppins-SemiBold",
    fontSize: moderateScale(14),
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
});

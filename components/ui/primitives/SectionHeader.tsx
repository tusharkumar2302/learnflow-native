import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { colors } from "@/theme";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function SectionHeader({
  title,
  action,
  onAction,
  style,
}: SectionHeaderProps) {
  return (
    <View style={[s.row, style]}>
      <Text style={s.title}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={s.action}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontFamily: "Teachers-SemiBold",
    fontSize: moderateScale(18),
    color: colors.text.primary,
    lineHeight: moderateScale(26),
  },
  action: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(12),
    color: colors.brand.glow,
  },
});

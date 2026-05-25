import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { scale } from "react-native-size-matters";
import { colors, shadows } from "@/theme";

type Elevation = "flat" | "raised" | "high";

interface SurfaceCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: Elevation;
  radius?: number;
}

export function SurfaceCard({
  children,
  style,
  elevation = "flat",
  radius = 16,
}: SurfaceCardProps) {
  return (
    <View style={[s.base, elevationStyle[elevation], { borderRadius: scale(radius) }, style]}>
      {children}
    </View>
  );
}

const elevationStyle: Record<Elevation, ViewStyle> = {
  flat: {
    backgroundColor: colors.bg.surface,
  },
  raised: {
    backgroundColor: colors.bg.elevated,
    ...shadows.sm,
  },
  high: {
    backgroundColor: colors.bg.elevated,
    ...shadows.md,
  },
};

const s = StyleSheet.create({
  base: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border.subtle,
    overflow: "hidden",
  },
});

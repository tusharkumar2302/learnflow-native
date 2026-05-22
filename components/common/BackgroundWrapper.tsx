import { StyleSheet } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

type GradientColors = readonly [string, string, ...string[]];

type Props = {
  children: React.ReactNode;
  colors?: GradientColors;
};

export default function BackgroundWrapper({ children, colors }: Props) {
  return (
    <LinearGradient
      colors={colors ?? ["#0B0B0D", "#191321"]}
      style={styles.container}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

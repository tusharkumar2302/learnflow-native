import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  withTopInset?: boolean;
  withBottomInset?: boolean;
}

export function ScreenContainer({
  children,
  style,
  withTopInset = false,
  withBottomInset = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        s.root,
        withTopInset && { paddingTop: insets.top },
        withBottomInset && { paddingBottom: insets.bottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg.base,
  },
});

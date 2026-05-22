import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";

import { Platform } from "react-native";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar
        style="dark"
        backgroundColor="transparent"
        translucent={Platform.OS === "android"}
      />
      <Slot />
    </SafeAreaProvider>
  );
}

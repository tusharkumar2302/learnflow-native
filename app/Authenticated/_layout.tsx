import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthenticatedLayout() {
  // Include bottom edge on Android for navigation bar, iOS handles it with tab bar
  const edges: ("top" | "bottom" | "left" | "right")[] =
    Platform.OS === "android"
      ? ["top", "bottom", "left", "right"]
      : ["top", "left", "right"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f3ff" }} edges={edges}>
      <StatusBar style="dark" backgroundColor="#f5f3ff" />
      <Slot />
    </SafeAreaView>
  );
}

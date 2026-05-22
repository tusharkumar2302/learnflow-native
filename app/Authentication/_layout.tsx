import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthenticationLayout() {
  // Include bottom edge on Android for navigation bar
  const edges: ("top" | "bottom" | "left" | "right")[] =
    Platform.OS === "android"
      ? ["top", "bottom", "left", "right"]
      : ["top", "left", "right"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#DCC0FF" }} edges={edges}>
      <StatusBar style="dark" backgroundColor="#DCC0FF" />
      <Slot />
    </SafeAreaView>
  );
}

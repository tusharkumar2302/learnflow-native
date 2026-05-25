import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthenticationLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0F0820" />
      <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
    </>
  );
}

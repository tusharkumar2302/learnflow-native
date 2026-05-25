import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthenticatedLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0614" />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </>
  );
}

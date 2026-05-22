import { Stack } from "expo-router";

export default function CoursesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="CouseVideos"
        options={{ title: "Course Details", headerShown: false }}
      />
      <Stack.Screen
        name="VideoScreen"
        options={{ title: "Video Screen", headerShown: false }}
      />
    </Stack>
  );
}

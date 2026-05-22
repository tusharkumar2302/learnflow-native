import Banner from "@/components/ui/Home/Banner";
import ContinueWatching from "@/components/ui/Home/continueWatchingCard";
import CoursesCarousel from "@/components/ui/Home/CoursesCarousal";
import WeeklyQuiz from "@/components/ui/Home/WeeklyQuiz";
import { useProfile } from "@/hooks/useProfile";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

function getFirstName(name?: string): string {
  if (!name) return "";
  const first = name.trim().split(" ")[0];
  return first.length > 10 ? first.slice(0, 10) + "…" : first;
}

export default function HomeScreen() {
  const router = useRouter();
  const { profile, isLoading } = useProfile();

  const userInitial = useMemo(() => {
    return profile?.name?.trim().charAt(0).toUpperCase() ?? "";
  }, [profile?.name]);

  const firstName = useMemo(() => getFirstName(profile?.name), [profile?.name]);

  const sections = useMemo(
    () => [
      { id: "continue", type: "continue" as const },
      { id: "weeklyQuiz", type: "weeklyQuiz" as const },
      { id: "courses", type: "courses" as const },
    ],
    []
  );

  return (
    <View className="bg-[#f5f3ff] flex-1">
      {/* Header */}
      <View className="px-5 mt-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3 flex-1">
          <TouchableOpacity
            onPress={() => router.push("/Authenticated/(tabs)/Profile")}
            className="bg-[#FFFFFF59] border border-gray-200 rounded-full h-11 w-11 items-center justify-center overflow-hidden"
          >
            {isLoading ? (
              <View className="h-full w-full bg-gray-200 rounded-full" />
            ) : profile?.imgUrl ? (
              <Image source={{ uri: profile.imgUrl }} className="h-full w-full" resizeMode="cover" />
            ) : (
              <Text className="text-xl font-poppins-semibold text-gray-700">
                {userInitial}
              </Text>
            )}
          </TouchableOpacity>

          <View>
            {isLoading ? (
              <View className="h-5 w-28 bg-gray-200 rounded-md" />
            ) : firstName ? (
              <Text className="text-xl font-teachers-bold text-gray-900" numberOfLines={1}>
                Hi, {firstName}
              </Text>
            ) : null}
          </View>
        </View>

        <Image
          source={require("@/assets/icons/zuper-logo.png")}
          style={{ width: 110, height: 26 }}
          resizeMode="contain"
        />
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === "continue") return <ContinueWatching />;
          if (item.type === "weeklyQuiz") return <WeeklyQuiz />;
          if (item.type === "courses")
            return (
              <CoursesCarousel
                showSearchBar={false}
                orientation="vertical"
                showViewAll={true}
                screen="home"
                showFilters={false}
              />
            );
          return null;
        }}
      />
    </View>
  );
}

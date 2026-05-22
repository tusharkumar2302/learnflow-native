import MenuBar from "@/components/common/MenuBar";
import Banner from "@/components/ui/Home/Banner";
import ContinueWatching from "@/components/ui/Home/continueWatchingCard";
import CoursesCarousel from "@/components/ui/Home/CoursesCarousal";
import WeeklyQuiz from "@/components/ui/Home/WeeklyQuiz";
import { authStore } from "@/stores/authStore";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  const router = useRouter();
  const { token } = authStore();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  const getDisplayName = (name?: string) => {
    if (!name) return "";
    const first = name.trim().split(" ")[0];
    return first.length > 10 ? first.slice(0, 10) + "…" : first;
  };

  const [profile, setProfile] = useState<{
    name: string;
    imgUrl?: string | null;
  } | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!baseUrl || !token) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data?.success && res.data?.data) {
        setProfile(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const userInitial = useMemo(() => {
    const name = profile?.name || "";
    return name.trim().charAt(0).toUpperCase() || " ";
  }, [profile?.name]);

  const firstName = useMemo(() => {
    return profile?.name?.trim().split(" ").filter(Boolean)[0];
  }, [profile?.name]);

  const sections = useMemo(
    () => [
      { id: "banner", type: "banner" as const },
      { id: "continue", type: "continue" as const },
      { id: "weeklyQuiz", type: "weeklyQuiz" as const },
      { id: "courses", type: "courses" as const },
    ],
    [],
  );

  return (
    <View className="bg-[#f5f3ff] flex-1 overflow-visible">
      <View className="px-5 mt-5 flex-row items-center justify-between">
        <View className="flex-row items-center gap-4 flex-1">
          <TouchableOpacity
            onPress={() => router.push("/Authenticated/(tabs)/Profile")}
            className="bg-[#FFFFFF59] border border-gray-200 rounded-full h-12 w-12 items-center justify-center overflow-hidden"
          >
            {isLoading ? (
              <View className="h-full w-full bg-gray-300 animate-pulse rounded-full" />
            ) : profile?.imgUrl ? (
              <Image
                source={{ uri: profile.imgUrl }}
                className="h-full w-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-2xl font-sfProDisplay-semibold text-gray-700">
                {userInitial}
              </Text>
            )}
          </TouchableOpacity>

          {isLoading ? (
            <View className="h-6 w-32 bg-gray-300 rounded-md animate-pulse" />
          ) : firstName ? (
            <Text className="text-2xl font-bold" numberOfLines={1}>
              Hi,{" "}
              <Text className="text-black">{getDisplayName(firstName)}</Text> 👋
            </Text>
          ) : null}
        </View>

        <Image
          source={require("@/assets/icons/zuper-logo.png")}
          style={{ width: 130, height: 30 }}
          resizeMode="contain"
        />
      </View>

      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          if (item.type === "banner") return <Banner />;
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
        showsVerticalScrollIndicator={false}
      />

      <MenuBar visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </View>
  );
}

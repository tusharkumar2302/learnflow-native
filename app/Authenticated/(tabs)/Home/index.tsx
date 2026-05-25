import ContinueWatching from "@/components/ui/Home/continueWatchingCard";
import CoursesCarousel from "@/components/ui/Home/CoursesCarousal";
import WeeklyQuiz from "@/components/ui/Home/WeeklyQuiz";
import TodayLessonCard from "@/components/ui/Learn/TodayLessonCard";
import { useProfile } from "@/hooks/useProfile";
import { useTodayLesson } from "@/hooks/useLearn";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function getFirstName(name?: string): string {
  if (!name) return "";
  const first = name.trim().split(" ")[0];
  return first.length > 12 ? first.slice(0, 12) + "…" : first;
}

const sections = [
  { id: "todayLesson", type: "todayLesson" as const },
  { id: "continue", type: "continue" as const },
  { id: "weeklyQuiz", type: "weeklyQuiz" as const },
  { id: "courses", type: "courses" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const { profile, isLoading } = useProfile();
  const { todayLesson } = useTodayLesson();

  const userInitial = useMemo(
    () => profile?.name?.trim().charAt(0).toUpperCase() ?? "",
    [profile?.name]
  );
  const firstName = useMemo(() => getFirstName(profile?.name), [profile?.name]);

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F3FF" }}>
      {/* ── Header ── */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingTop: 18,
          paddingBottom: 4,
        }}
      >
        {/* Avatar */}
        <TouchableOpacity
          onPress={() => router.push("/Authenticated/(tabs)/Profile")}
          style={{
            height: 40,
            width: 40,
            borderRadius: 20,
            backgroundColor: "rgba(255,255,255,0.55)",
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.06)",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <View style={{ height: "100%", width: "100%", backgroundColor: "#E8E4F5" }} />
          ) : profile?.imgUrl ? (
            <Image source={{ uri: profile.imgUrl }} style={{ height: "100%", width: "100%" }} resizeMode="cover" />
          ) : (
            <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 16, color: "#563FA5" }}>
              {userInitial}
            </Text>
          )}
        </TouchableOpacity>

        {/* Greeting + streak */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          {isLoading ? (
            <View style={{ height: 16, width: 120, backgroundColor: "#E8E4F5", borderRadius: 6 }} />
          ) : firstName ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                style={{ fontFamily: "Teachers-Bold", fontSize: 21, color: "#0D0D0D" }}
                numberOfLines={1}
              >
                Hi, {firstName}
              </Text>
              {(profile?.streak ?? 0) > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "rgba(249,115,22,0.10)",
                    borderRadius: 8,
                    paddingHorizontal: 7,
                    paddingVertical: 3,
                    gap: 3,
                  }}
                >
                  <Text style={{ fontSize: 12 }}>🔥</Text>
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 11,
                      color: "#EA580C",
                    }}
                  >
                    {profile?.streak}d
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Logo */}
        <Image
          source={require("@/assets/icons/zuper-logo.png")}
          style={{ width: 96, height: 22, opacity: 0.75 }}
          resizeMode="contain"
        />
      </View>

      {/* ── Feed ── */}
      <FlatList
        data={sections}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={({ item }) => {
          if (item.type === "todayLesson" && todayLesson) {
            return (
              <View style={hs.todayWrap}>
                <View style={hs.todayHeader}>
                  <Text style={hs.todayLabel}>⚡ DAILY LESSON</Text>
                  <TouchableOpacity onPress={() => router.push("/Authenticated/(tabs)/Learn")} activeOpacity={0.7}>
                    <Text style={hs.viewAllText}>See all paths</Text>
                  </TouchableOpacity>
                </View>
                <TodayLessonCard lesson={todayLesson.lesson} path={todayLesson.path} />
              </View>
            );
          }
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

const hs = StyleSheet.create({
  todayWrap: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 4,
  },
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  todayLabel: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#7C3AED",
    letterSpacing: 1.2,
  },
  viewAllText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "rgba(0,0,0,0.38)",
  },
});

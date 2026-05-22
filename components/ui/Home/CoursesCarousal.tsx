import { useCourses, useCourseSearch } from "@/hooks/useCourses";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CourseCardNew from "./CourseCardNew";

type CoursesCarouselProps = {
  showSearchBar?: boolean;
  orientation?: "horizontal" | "vertical";
  showViewAll?: boolean;
  screen: "course" | "home" | "learnNext" | "completed";
  showFilters?: boolean;
};

export default function CoursesCarousel({
  orientation = "horizontal",
  showViewAll = true,
  screen,
  showFilters = true,
}: CoursesCarouselProps) {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { courses, categories, isLoading } = useCourses();
  const { results: searchResults, isSearching, search, clearSearch } = useCourseSearch();

  const [searchText, setSearchText] = useState("");
  const [searchActive, setSearchActive] = useState(false);

  useEffect(() => {
    if (!searchActive || !searchText.trim()) {
      clearSearch();
      return;
    }
    const delay = setTimeout(() => search(searchText), 400);
    return () => clearTimeout(delay);
  }, [searchActive, searchText, search, clearSearch]);

  const filteredCourses = useMemo(() => {
    if (!showFilters || selectedCategory === "All") return courses;
    return courses.filter((c) => c.category === selectedCategory);
  }, [courses, selectedCategory, showFilters]);

  const dataToRender = searchActive && searchText.trim() ? searchResults : filteredCourses;

  return (
    <>
      <View
        style={{
          width: screenWidth * 0.875,
          alignSelf: "center",
          marginBottom: 10,
          marginTop: 20,
        }}
      >
        {showViewAll && screen !== "learnNext" && screen !== "completed" && (
          <View className="flex-row items-center justify-between mb-2">
            <Text
              className="font-teachers-medium"
              style={{ fontSize: screenHeight * 0.022 }}
            >
              Courses
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/Authenticated/(tabs)/Courses")}
              className="px-3 py-1.5 rounded-full"
            >
              <Text className="text-black/40 font-teachers-medium underline text-sm">
                View all
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#730A96" />
          </View>
        ) : (
          <FlatList
            horizontal={orientation === "horizontal"}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={dataToRender}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={{
              paddingHorizontal: orientation === "horizontal" ? 20 : 0,
              paddingBottom: orientation === "vertical" ? 20 : 12,
            }}
            renderItem={({ item }) => (
              <CourseCardNew
                title={item.title}
                author={item.author}
                category={item.category ?? ""}
                price={String(item.price ?? 0)}
                id={item.id}
                duration={{
                  hours: String(item.estimatedDuration),
                  seconds: String(item.estimatedDuration),
                }}
                image={item.thumbnail}
                orientation={orientation}
                courses="all"
                totalCoins={item.totalCoins}
              />
            )}
            ListEmptyComponent={
              <View className="py-8">
                <Text className="text-gray-400 font-poppins-regular text-sm">
                  No courses found.
                </Text>
              </View>
            }
          />
        )}
      </View>
    </>
  );
}

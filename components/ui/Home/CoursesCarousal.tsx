import { authStore } from "@/stores/authStore";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CourseCardNew from "./CourseCardNew";

type CourseApiItem = {
  id: string;
  title: string;
  author: string;
  price?: number | string | null;
  duration: any;
  thumbnail: any;
  category?: string;
  totalCoins: number;
};

type CoursesCarouselProps = {
  showSearchBar?: boolean;
  orientation?: "horizontal" | "vertical";
  showViewAll?: boolean;
  screen: "course" | "home" | "learnNext" | "completed";
  showFilters?: boolean;
};

export default function CoursesCarousel({
  showSearchBar = true,
  orientation = "horizontal",
  showViewAll = true,
  screen,
  showFilters = true,
}: CoursesCarouselProps) {
  const router = useRouter();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const { token } = authStore();
  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [searchActive, setSearchActive] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<string[]>(["All"]);

  const [courses, setCourses] = useState<CourseApiItem[]>([]);
  const [searchResults, setSearchResults] = useState<CourseApiItem[]>([]);

  const canFetch = !!token && !!baseUrl;

  // ---------------------------------------------------------------------------
  // Fetch courses
  // ---------------------------------------------------------------------------
  const fetchCourses = useCallback(async () => {
    if (!canFetch) return;

    setIsLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/user/courses?page=1&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const arr: CourseApiItem[] = res?.data?.data ?? [];
      setCourses(arr);

      const uniqueCategories = [
        ...new Set(arr.map((c) => c.category).filter(Boolean)),
      ] as string[];
      setTags(["All", ...uniqueCategories]);
    } catch (error) {
      console.log("Error fetching courses:", error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [baseUrl, token, canFetch]);

  const fetchCoursesBySearch = useCallback(
    async (value: string) => {
      if (!canFetch) return;

      const query = value.trim();
      if (!query) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `${baseUrl}/api/user/courses/search?q=${encodeURIComponent(query)}&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const arr: CourseApiItem[] = res?.data?.data ?? [];
        setSearchResults(arr);
      } catch (error) {
        console.log("Search error:", error);
        setSearchResults([]);
      }
    },
    [baseUrl, token, canFetch],
  );

  useFocusEffect(
    useCallback(() => {
      if (canFetch) fetchCourses();
      return () => {};
    }, [canFetch, fetchCourses]),
  );

  useEffect(() => {
    if (!searchActive || !search.trim()) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      fetchCoursesBySearch(search);
    }, 400);

    return () => clearTimeout(delay);
  }, [searchActive, search, fetchCoursesBySearch]);

  const filteredCourses = useMemo(() => {
    const list = courses;

    const byTag =
      !showFilters || selectedTag === "All"
        ? list
        : list.filter((c) => c.category === selectedTag);

    const bySearchText = search.trim()
      ? byTag.filter((c) =>
          (c.title || "").toLowerCase().includes(search.trim().toLowerCase()),
        )
      : byTag;

    return bySearchText;
  }, [courses, selectedTag, search, showFilters]);

  const dataToRender =
    searchActive && search.trim() ? searchResults : filteredCourses;

  const handleSearchFocus = () => setSearchActive(true);

  const handleSearchClear = () => {
    setSearch("");
    setSearchResults([]);
    setSearchActive(false);
  };

  const handleSearchSubmit = (text: string) => {
    setSearchActive(true);
    fetchCoursesBySearch(text);
  };

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
              style={{ fontSize: screenHeight * 0.025 }}
            >
              Courses
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/Authenticated/(tabs)/Courses")}
              className="px-4 py-2 rounded-full"
            >
              <Text className="text-black/40 font-teachers-medium underline text-sm">
                View All
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {isLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#730A96" />
            <Text className="text-gray-500 mt-2">Loading courses...</Text>
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
                category={item.category}
                price={!item.price ? 0 : item.price}
                id={item.id}
                duration={{ hours: item.duration, seconds: item.duration }}
                image={item.thumbnail}
                orientation={orientation}
                courses="all"
                totalCoins={item.totalCoins}
              />
            )}
            ListEmptyComponent={
              <View className="py-8">
                <Text className="text-gray-500">No courses found.</Text>
              </View>
            }
          />
        )}
      </View>

    </>
  );
}

import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { courseService } from "@/lib/services";
import { CourseSummary, CourseListParams } from "@/services/interfaces/ICourseService";

export function useCourses(params: CourseListParams = {}) {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await courseService.getCourses(params);
      setCourses(result.items);

      const unique = ["All", ...new Set(result.items.map((c) => c.category).filter(Boolean))];
      setCategories(unique);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load courses");
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [params.category, params.page, params.limit]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useFocusEffect(
    useCallback(() => {
      fetchCourses();
    }, [fetchCourses])
  );

  return { courses, categories, isLoading, error, refetch: fetchCourses };
}

export function useCourseSearch() {
  const [results, setResults] = useState<CourseSummary[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const data = await courseService.searchCourses(query.trim());
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => setResults([]), []);

  return { results, isSearching, search, clearSearch };
}

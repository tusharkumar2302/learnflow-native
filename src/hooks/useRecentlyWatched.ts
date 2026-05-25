import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { courseService } from "@/services";
import { RecentChapter } from "@/services/interfaces/ICourseService";

export function useRecentlyWatched(limit = 5) {
  const [items, setItems] = useState<RecentChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await courseService.getRecentlyWatched(limit);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => { fetch(); }, [fetch]);

  useFocusEffect(
    useCallback(() => { fetch(); }, [fetch])
  );

  return { items, isLoading, refetch: fetch };
}

import { learnService } from "@/lib/services";
import { LearningPath, Lesson, PathDetail } from "@/services/interfaces/ILearnService";
import { useCallback, useEffect, useState } from "react";

export function useLearningPaths() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await learnService.getPaths();
      setPaths(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { paths, isLoading, refresh: load };
}

export function useLearningPath(pathId: string) {
  const [path, setPath] = useState<PathDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await learnService.getPathById(pathId);
      setPath(data);
    } finally {
      setIsLoading(false);
    }
  }, [pathId]);

  useEffect(() => { load(); }, [load]);

  return { path, isLoading, refresh: load };
}

export function useLesson(lessonId: string | null) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    if (!lessonId) { setIsLoading(false); return; }
    setIsLoading(true);
    try {
      const data = await learnService.getLessonById(lessonId);
      setLesson(data);
    } finally {
      setIsLoading(false);
    }
  }, [lessonId]);

  useEffect(() => { load(); }, [load]);

  return { lesson, isLoading, refresh: load };
}

export function useTodayLesson() {
  const [todayLesson, setTodayLesson] = useState<{ lesson: Lesson; path: LearningPath } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await learnService.getTodayLesson();
      setTodayLesson(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return { todayLesson, isLoading, refresh: load };
}

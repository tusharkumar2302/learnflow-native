import { Chapter, Course, UserProgress } from "@/types/Course";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface CourseState {
  currentCourse: Course | null;
  currentChapter: Chapter | null;
  setCurrentCourse: (course: Course | null) => void;
  setCurrentChapter: (chapterId: string | null) => void;
  updateQuizResult: (
    quizId: string,
    result: { score: number; passed: boolean; attemptedAt: string }
  ) => void;
  updateChapterCompletion: (chapterId: string, completed: boolean) => void;
  updateUserProgress: (progress: Partial<UserProgress>) => void;
  setCurrentChapterDirect: (chapter: Chapter | null) => void;
  setChapterProgress: (
    chapterId: string,
    currentTime: number,
    progress: number
  ) => void;
  reset: () => void;
}

export const useCourseStore = create(
  persist<CourseState>(
    (set) => ({
      currentCourse: null,
      currentChapter: null,

      setCurrentCourse: (course) =>
        set({ currentCourse: course, currentChapter: null }),

      setCurrentChapter: (chapterId) =>
        set((state) => {
          if (!state.currentCourse || !chapterId) {
            return { currentChapter: null };
          }
          const chapter =
            state.currentCourse.chapters.find((ch) => ch.id === chapterId) ||
            null;
          return { currentChapter: chapter };
        }),
      setCurrentChapterDirect: (chapter) => set({ currentChapter: chapter }),
      updateQuizResult: (quizId, result) =>
        set((state) => {
          if (!state.currentCourse) return state;

          const updatedChapters = state.currentCourse.chapters.map(
            (chapter) => {
              const quiz = chapter.quizzes.find((q) => q.id === quizId);
              if (!quiz) return chapter;

              const updatedQuizzes = chapter.quizzes.map((q) =>
                q.id === quizId
                  ? {
                      ...q,
                      userResult: {
                        quizId,
                        ...result,
                      },
                    }
                  : q
              );

              return {
                ...chapter,
                quizzes: updatedQuizzes,
                isCompleted:
                  chapter.isCompleted &&
                  updatedQuizzes.every((q) => q.userResult?.passed),
              };
            }
          );

          const completedChapters = updatedChapters.filter(
            (ch) => ch.isCompleted
          ).length;
          const progressPercentage =
            (completedChapters / updatedChapters.length) * 100;

          return {
            currentCourse: {
              ...state.currentCourse,
              chapters: updatedChapters,
              userProgress: {
                ...state.currentCourse.userProgress,
                completedChapters,
                progressPercentage,
              },
            },
            currentChapter:
              state.currentChapter &&
              state.currentChapter.id ===
                updatedChapters.find((ch) =>
                  ch.quizzes.some((q) => q.id === quizId)
                )?.id
                ? {
                    ...state.currentChapter,
                    quizzes: state.currentChapter.quizzes.map((q) =>
                      q.id === quizId
                        ? { ...q, userResult: { quizId, ...result } }
                        : q
                    ),
                    isCompleted:
                      state.currentChapter.isCompleted &&
                      state.currentChapter.quizzes.every(
                        (q) => q.userResult?.passed
                      ),
                  }
                : state.currentChapter,
          };
        }),

      updateChapterCompletion: (chapterId, completed) =>
        set((state) => {
          if (!state.currentCourse) return state;

          const updatedChapters = state.currentCourse.chapters.map((chapter) =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  isCompleted: completed,
                  videoCompleted: completed, // Also set videoCompleted for UI state
                  progress: chapter.progress?.map((p) =>
                    p.chapterId === chapterId
                      ? { ...p, completed, watchedAt: new Date().toISOString() }
                      : p
                  ) || [
                    {
                      id: "",
                      userId: "",
                      chapterId,
                      completed,
                      currentTime: chapter.currentTime || 0,
                      watchedAt: new Date().toISOString(),
                      user: { id: "", name: "", email: "" },
                    },
                  ],
                }
              : chapter
          );

          const completedChapters = updatedChapters.filter(
            (ch) => ch.isCompleted
          ).length;
          const progressPercentage =
            (completedChapters / updatedChapters.length) * 100;

          return {
            currentCourse: {
              ...state.currentCourse,
              chapters: updatedChapters,
              userProgress: {
                ...state.currentCourse.userProgress,
                completedChapters,
                progressPercentage,
                lastWatchedChapter: completed
                  ? {
                      chapterId,
                      completed,
                      watchedAt: new Date().toISOString(),
                    }
                  : state.currentCourse.userProgress.lastWatchedChapter,
              },
            },
            currentChapter:
              state.currentChapter?.id === chapterId
                ? {
                    ...state.currentChapter,
                    isCompleted: completed,
                    videoCompleted: completed, // Also set videoCompleted for UI state
                    progress: state.currentChapter.progress?.map((p) =>
                      p.chapterId === chapterId
                        ? {
                            ...p,
                            completed,
                            watchedAt: new Date().toISOString(),
                          }
                        : p
                    ) || [
                      {
                        id: "",
                        userId: "",
                        chapterId,
                        completed,
                        currentTime: state.currentChapter.currentTime || 0,
                        watchedAt: new Date().toISOString(),
                        user: { id: "", name: "", email: "" },
                      },
                    ],
                  }
                : state.currentChapter,
          };
        }),

      updateUserProgress: (progress) =>
        set((state) => ({
          currentCourse: state.currentCourse
            ? {
                ...state.currentCourse,
                userProgress: {
                  ...state.currentCourse.userProgress,
                  ...progress,
                },
              }
            : null,
        })),

      setChapterProgress: (chapterId, currentTime, progress) =>
        set((state) => {
          if (!state.currentCourse) return state;

          const updatedChapters = state.currentCourse.chapters.map((chapter) =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  currentTime,
                  progress: chapter.progress?.map((p) =>
                    p.chapterId === chapterId ? { ...p, currentTime } : p
                  ) || [
                    {
                      id: "",
                      userId: "",
                      chapterId,
                      completed: chapter.isCompleted,
                      currentTime,
                      watchedAt: new Date().toISOString(),
                      user: { id: "", name: "", email: "" },
                    },
                  ],
                }
              : chapter
          );

          return {
            currentCourse: {
              ...state.currentCourse,
              chapters: updatedChapters,
            },
            currentChapter:
              state.currentChapter?.id === chapterId
                ? {
                    ...state.currentChapter,
                    currentTime,

                    progress: state.currentChapter.progress?.map((p) =>
                      p.chapterId === chapterId ? { ...p, currentTime } : p
                    ) || [
                      {
                        id: "",
                        userId: "",
                        chapterId,
                        completed: state.currentChapter.isCompleted,
                        currentTime,
                        watchedAt: new Date().toISOString(),
                        user: { id: "", name: "", email: "" },
                      },
                    ],
                  }
                : state.currentChapter,
          };
        }),

      reset: () => set({ currentCourse: null, currentChapter: null }),
    }),
    {
      name: "course-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

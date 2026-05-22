import WorkingPopuop from "@/app/Authenticated/courseVideos/WorkingPopuop";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CourseHeader from "@/components/Courses_Player/CourseHeader";
import TabBar from "@/components/Courses_Player/TabBar";
import { authStore } from "@/stores/authStore";
import { useCourseStore } from "@/stores/Course/courseStore";
import { Chapter } from "@/types/Course";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, BackHandler, ScrollView, View } from "react-native";
import PopUp from "../../QuizesPoint/PopUp";

export default function CourseVideos() {
  // Params
  const { id, screenType, coins, correct, total, passed, quizId } =
    useLocalSearchParams();

  // Store
  const { currentCourse, setCurrentCourse, updateQuizResult } =
    useCourseStore();
  const { token } = authStore();

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs for tracking async operations and preventing duplicate calls
  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const handledQuizResultRef = useRef(false);

  // Parse quiz result params once with memoization
  const quizResultParams = useMemo(() => {
    if (screenType !== "quizComplete") return null;

    const correctNum = typeof correct === "string" ? parseInt(correct, 10) : 0;
    const totalNum = typeof total === "string" ? parseInt(total, 10) : 0;
    const passedBool = passed === "true";

    return {
      correct: correctNum,
      total: totalNum,
      passed: passedBool,
      quizId: quizId as string,
      coins: coins as string,
    };
  }, [screenType, correct, total, passed, quizId, coins]);

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Handle back button
  useEffect(() => {
    const backAction = () => {
      if (screenType === "quizComplete") {
        router.push("/Authenticated/(tabs)/Courses");
        return true;
      }
      if (showModal) {
        setShowModal(false);
        return true;
      }
      router.push("/Authenticated/(tabs)/Courses");
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [screenType, showModal]);

  // Fetch course data - memoized with proper dependencies
  const fetchCourseData = useCallback(async () => {
    if (!id || !token || fetchingRef.current) return;

    fetchingRef.current = true;
    setLoading(true);

    try {
      const res = await axios.get(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user/courses/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!isMountedRef.current) return;

      const data = res.data;

      console.log("API Response data:", data.data);
      console.log("UserProgress:", data.data?.userProgress);

      // Sort chapters by order and update isCompleted based on new API structure
      const updatedCourseData = {
        ...data.data,
        userProgress: data.data.userProgress || {
          totalChapters: 0,
          completedChapters: 0,
          progressPercentage: 0,
        },
        chapters: data.data.chapters
          .map((chapter: any) => ({
            ...chapter,
            isCompleted: chapter.isCompleted,
            chapterCompleted: chapter.chapterCompleted,
            quizzes: chapter.quizzes.map((quiz: any) => ({
              ...quiz,
              results: quiz.isPassed ? { passed: quiz.isPassed } : null,
            })),
            coinValue: chapter.coinValue,
          }))
          .sort((a: Chapter, b: Chapter) => a.order - b.order),
      };

      setCurrentCourse(updatedCourseData);
      setShowModal(!updatedCourseData.isEnrolled);
    } catch {
      if (isMountedRef.current) {
        Alert.alert(
          "Error",
          "Failed to load course data. Please check your connection or log in again."
        );
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      fetchingRef.current = false;
    }
  }, [id, token, setCurrentCourse]);

  // Handle quiz result when returning from quiz
  const handleQuizResult = useCallback(async () => {
    if (
      !quizResultParams ||
      !quizResultParams.quizId ||
      handledQuizResultRef.current
    )
      return;

    handledQuizResultRef.current = true;

    const {
      correct: correctCount,
      total: totalCount,
      passed: isPassed,
      quizId: qId,
    } = quizResultParams;

    // Update local store with quiz result
    updateQuizResult(qId, {
      score: totalCount > 0 ? (correctCount / totalCount) * 100 : 0,
      passed: isPassed,
      attemptedAt: new Date().toISOString(),
    });

    console.log("Quiz result handled:", {
      correctCount,
      totalCount,
      isPassed,
      qId,
    });
  }, [quizResultParams, updateQuizResult]);

  // Redirect to auth if not logged in - MUST be before any conditional returns
  useEffect(() => {
    if (!token) {
      router.replace({
        pathname: "/Authentication/[id]",
        params: {
          id: "login",
          redirect: `/Authenticated/(tabs)/Courses/CouseVideos`,
          courseID: id as string,
        },
      });
    }
  }, [token, id]);

  // Fetch course data on mount or when id changes
  useEffect(() => {
    if (!token) return; // Don't fetch if not authenticated

    if (id) {
      setCurrentCourse(null);
      handledQuizResultRef.current = false; // Reset for new course
      fetchCourseData();
    }
  }, [id, token, fetchCourseData, setCurrentCourse]);

  // Handle quiz result separately
  useEffect(() => {
    if (
      screenType === "quizComplete" &&
      quizResultParams &&
      !handledQuizResultRef.current
    ) {
      handleQuizResult();
    }
  }, [screenType, quizResultParams, handleQuizResult]);

  // Check previous chapter completion - memoized
  const checkPreviousChapterCompletion = useCallback(
    async (chapterIndex: number, currentToken: string) => {
      if (chapterIndex === 0) return true;
      const previousChapter = currentCourse?.chapters[chapterIndex - 1];
      if (!previousChapter) return false;

      try {
        const chapterRes = await axios.get(
          `${process.env.EXPO_PUBLIC_API_URL}/api/user/chapters/${previousChapter.id}`,
          {
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        return chapterRes.data.data.userProgress.completed;
      } catch {
        return false;
      }
    },
    [currentCourse?.chapters]
  );

  // Handle play chapter - with proper dependencies
  const handlePlayChapter = useCallback(
    async (chapterId: string) => {
      if (!currentCourse || !token) {
        Alert.alert("Error", "User authentication token is missing.");
        return;
      }

      const chapter = currentCourse.chapters.find((ch) => ch.id === chapterId);
      if (!chapter) {
        Alert.alert("Error", "Chapter not found.");
        return;
      }

      const chapterIndex = currentCourse.chapters.findIndex(
        (ch) => ch.id === chapterId
      );

      if (chapterIndex > 0) {
        const isPreviousCompleted = await checkPreviousChapterCompletion(
          chapterIndex,
          token
        );
        if (!isPreviousCompleted) {
          Alert.alert(
            "Complete Previous Chapter",
            "You must complete the previous chapter and its quiz before accessing this one."
          );
          return;
        }
      }

      console.log("Navigating to VideoScreen with chapter ID:", chapter.id);
      router.replace({
        pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
        params: {
          chapterId: chapter.id,
          thumbnail: currentCourse.thumbnail ?? "",
          courseId: currentCourse.id,
          title: currentCourse.title,
          description:
            currentCourse.description ?? currentCourse.overview ?? "",
          duration: chapter.duration.toString(),
        },
      });
    },
    [currentCourse, token, checkPreviousChapterCompletion]
  );

  // Handle start quiz - memoized
  const handleStartQuiz = useCallback(
    (chapterId: string, quizId: string) => {
      if (!currentCourse) return;

      const chapter = currentCourse.chapters.find((ch) => ch.id === chapterId);
      const quiz = chapter?.quizzes.find((q) => q.id === quizId);
      if (!chapter || !quiz) {
        Alert.alert("Error", "Quiz not found.");
        return;
      }

      if (quiz.results?.passed || quiz.isPassed) {
        Alert.alert("Quiz Completed", "You have already passed this quiz.");
        return;
      }
      router.push({
        pathname: "/Authenticated/QuizesPoint/HowQuizWorks",
        params: {
          coins: quiz.coinValue ?? 0,
          quizData: JSON.stringify({ quizzes: [quiz] }),
          quizId: quiz.id,
        },
      });
    },
    [currentCourse]
  );

  // Handle close modal - stable reference
  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  // Handle popup close for quiz complete
  const handleQuizPopupClose = useCallback(() => {
    router.back();
  }, []);

  // Early return for auth redirect - AFTER all hooks
  if (!token) {
    return <LoadingSpinner size={80} color="#CAA2FC" />;
  }

  // Loading state
  if (loading || !currentCourse || !currentCourse.userProgress) {
    return <LoadingSpinner size={80} color="#CAA2FC" />;
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#f6f0ff" }}>
        <CourseHeader
          title={currentCourse.title}
          Totalpoints={currentCourse.totalCoins || 0}
          points={currentCourse.userProgress?.completedChapters || 0}
        />

        <TabBar
          courseData={currentCourse}
          onPlayChapter={handlePlayChapter}
          onStartQuiz={handleStartQuiz}
          screen="course"
        />
      </ScrollView>

      {screenType === "quizComplete" && quizResultParams && (
        <View style={{ height: "100%", width: "100%", position: "absolute" }}>
          <PopUp
            coins={quizResultParams.coins}
            onClose={handleQuizPopupClose}
            score={quizResultParams.correct}
            total={quizResultParams.total}
          />
        </View>
      )}

      {showModal && !currentCourse?.isEnrolled && (
        <WorkingPopuop
          onClose={handleCloseModal}
          courseId={id as string}
          isEnrolled={currentCourse?.isEnrolled || false}
        />
      )}
    </>
  );
}

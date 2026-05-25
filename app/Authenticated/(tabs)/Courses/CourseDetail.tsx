import WorkingPopuop from "@/components/ui/Courses/VideoChapterModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import CourseHeader from "@/components/Courses_Player/CourseHeader";
import TabBar from "@/components/Courses_Player/TabBar";
import { courseService } from "@/services";
import { LOCAL_VIDEO_URL } from "@/services/local/data/courses";
import { useCourseStore } from "@/stores/courseStore";
import quizStore from "@/stores/quizStore";
import { Chapter, Course } from "@/types/Course";
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
  const { id, screenType, coins, correct, total, passed, quizId } =
    useLocalSearchParams();

  const { currentCourse, setCurrentCourse, updateQuizResult } = useCourseStore();
  const { setPendingQuiz } = quizStore();

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const isMountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const handledQuizResultRef = useRef(false);

  const quizResultParams = useMemo(() => {
    if (screenType !== "quizComplete") return null;
    const correctNum = typeof correct === "string" ? parseInt(correct, 10) : 0;
    const totalNum = typeof total === "string" ? parseInt(total, 10) : 0;
    return {
      correct: correctNum,
      total: totalNum,
      passed: passed === "true",
      quizId: quizId as string,
      coins: coins as string,
    };
  }, [screenType, correct, total, passed, quizId, coins]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (screenType === "quizComplete") {
        router.push("/Authenticated/(tabs)/Courses");
        return true;
      }
      if (showModal) { setShowModal(false); return true; }
      router.push("/Authenticated/(tabs)/Courses");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, [screenType, showModal]);

  const fetchCourseData = useCallback(async () => {
    if (!id || fetchingRef.current) return;
    fetchingRef.current = true;
    setLoading(true);

    try {
      const detail = await courseService.getCourseById(id as string);
      if (!isMountedRef.current) return;

      const course: Course = {
        id: detail.id,
        title: detail.title,
        thumbnail: detail.thumbnail,
        description: detail.description,
        overview: detail.overview,
        author: detail.author,
        category: detail.category,
        difficulty: detail.difficulty,
        estimatedDuration: detail.estimatedDuration,
        totalCoins: detail.totalCoins,
        isEnrolled: detail.isEnrolled,
        userProgress: detail.userProgress,
        chapters: detail.chapters
          .map((ch) => ({
            id: ch.id,
            title: ch.title,
            order: ch.order,
            duration: ch.duration,
            isCompleted: ch.isCompleted,
            chapterCompleted: ch.isCompleted,
            videoCompleted: ch.videoCompleted,
            currentTime: ch.currentTime,
            coinValue: ch.coinValue,
            videoUrl: LOCAL_VIDEO_URL,
            quizzes: ch.quiz
              ? [{
                  id: ch.quiz.id,
                  title: ch.quiz.title,
                  coinValue: ch.quiz.coinValue,
                  isPassed: ch.quiz.isPassed,
                  questions: ch.quiz.questions,
                  results: ch.quiz.isPassed ? { passed: true } : null,
                  userResult: ch.quiz.isPassed
                    ? { quizId: ch.quiz.id, score: 100, passed: true, attemptedAt: "" }
                    : undefined,
                }]
              : [],
          } as Chapter))
          .sort((a, b) => a.order - b.order),
      };

      setCurrentCourse(course);
      setShowModal(!detail.isEnrolled);
    } catch {
      if (isMountedRef.current) {
        Alert.alert("Error", "Failed to load course data.");
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
      fetchingRef.current = false;
    }
  }, [id, setCurrentCourse]);

  const handleQuizResult = useCallback(async () => {
    if (!quizResultParams || !quizResultParams.quizId || handledQuizResultRef.current) return;
    handledQuizResultRef.current = true;
    const { correct: correctCount, total: totalCount, passed: isPassed, quizId: qId } = quizResultParams;
    updateQuizResult(qId, {
      score: totalCount > 0 ? (correctCount / totalCount) * 100 : 0,
      passed: isPassed,
      attemptedAt: new Date().toISOString(),
    });
  }, [quizResultParams, updateQuizResult]);

  useEffect(() => {
    if (id) {
      setCurrentCourse(null);
      handledQuizResultRef.current = false;
      fetchCourseData();
    }
  }, [id, fetchCourseData, setCurrentCourse]);

  useEffect(() => {
    if (screenType === "quizComplete" && quizResultParams && !handledQuizResultRef.current) {
      handleQuizResult();
    }
  }, [screenType, quizResultParams, handleQuizResult]);

  const checkPreviousChapterCompletion = useCallback(
    (chapterIndex: number) => {
      if (chapterIndex === 0) return true;
      return currentCourse?.chapters[chapterIndex - 1]?.isCompleted ?? false;
    },
    [currentCourse?.chapters]
  );

  const handlePlayChapter = useCallback(
    (chapterId: string) => {
      if (!currentCourse) {
        Alert.alert("Error", "Course data not loaded.");
        return;
      }
      const chapter = currentCourse.chapters.find((ch) => ch.id === chapterId);
      if (!chapter) { Alert.alert("Error", "Chapter not found."); return; }

      const chapterIndex = currentCourse.chapters.findIndex((ch) => ch.id === chapterId);
      if (chapterIndex > 0 && !checkPreviousChapterCompletion(chapterIndex)) {
        Alert.alert("Complete Previous Chapter", "You must complete the previous chapter and its quiz before accessing this one.");
        return;
      }

      router.replace({
        pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
        params: {
          chapterId: chapter.id,
          thumbnail: currentCourse.thumbnail ?? "",
          courseId: currentCourse.id,
          title: currentCourse.title,
          description: currentCourse.description ?? currentCourse.overview ?? "",
          duration: chapter.duration.toString(),
        },
      });
    },
    [currentCourse, checkPreviousChapterCompletion]
  );

  const handleStartQuiz = useCallback(
    (chapterId: string, quizId: string) => {
      if (!currentCourse) return;
      const chapter = currentCourse.chapters.find((ch) => ch.id === chapterId);
      const quiz = chapter?.quizzes.find((q) => q.id === quizId);
      if (!chapter || !quiz) { Alert.alert("Error", "Quiz not found."); return; }
      if (quiz.results?.passed || quiz.isPassed) {
        Alert.alert("Quiz Completed", "You have already passed this quiz.");
        return;
      }
      setPendingQuiz({ quiz, coinValue: quiz.coinValue ?? 0, quizId: quiz.id });
      router.push({
        pathname: "/Authenticated/QuizesPoint/HowQuizWorks",
        params: { coins: quiz.coinValue ?? 0, quizId: quiz.id },
      });
    },
    [currentCourse, setPendingQuiz]
  );

  const handleCloseModal = useCallback(() => setShowModal(false), []);
  const handleQuizPopupClose = useCallback(() => router.back(), []);

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
          totalChapters={currentCourse.userProgress?.totalChapters || currentCourse.chapters.length}
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

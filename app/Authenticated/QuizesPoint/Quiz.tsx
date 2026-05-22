import ScreenHeader from "@/components/common/ScreenHeader";
import QuizFooter from "@/components/Quiz/Footer";
import OptionButton from "@/components/Quiz/Options";
import QuizQuestion from "@/components/Quiz/Questions";
import { authStore } from "@/stores/authStore";
import { useCourseStore } from "@/stores/Course/courseStore";
import quizStore from "@/stores/quizStore";
import { Quiz as QuizType } from "@/types/Course";
import axios from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import PopUp from "./PopUp";

interface QuizParams {
  coins?: string;
  quizData?: string;
  quizId?: string;
}

export default function Quiz() {
  const { quizData, quizId } = useLocalSearchParams() as QuizParams;
  const [currentIndex, setCurrentIndex] = useState(0);
  // Store answers per question index: { questionIndex: { text: optionText, optionId: id, isCorrect: boolean } }
  const [answers, setAnswers] = useState<
    Record<number, { text: string; optionId: string; isCorrect: boolean }>
  >({});
  const [showModal, setShowModal] = useState(false);
  const { setTotal, reset, total } = quizStore();
  const { token } = authStore();

  // Derived state for current question
  const currentAnswer = answers[currentIndex];
  const isChoseOption = !!currentAnswer;

  // Calculate current correct count from all stored answers
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;

  const { currentCourse, currentChapter, updateQuizResult } = useCourseStore();

  let parsedQuizData: { quizzes: QuizType[] } | null = null;
  try {
    parsedQuizData = quizData ? JSON.parse(quizData as string) : null;
  } catch (error) {
    console.error("Failed to parse quizData:", error);
  }

  const currentQuiz: QuizType | undefined = parsedQuizData?.quizzes?.[0];
  const questions = currentQuiz?.questions || [];

  useEffect(() => {
    reset();
    setTotal(questions.length);
  }, [reset, setTotal, questions.length]);

  const [isPassed, setIsPassed] = useState(false);

  const saveQuizResult = useCallback(
    async (correctCount: number, totalCount: number) => {
      if (!quizId || !currentQuiz || !currentCourse || !currentChapter) return;

      try {
        // Quiz is passed only if all answers are correct
        const passed = correctCount === totalCount;
        setIsPassed(passed);

        const scorePercentage =
          totalCount > 0 ? (correctCount / totalCount) * 100 : 0;

        console.log("📊 Saving Quiz Result:");
        console.log("Correct answers:", correctCount);
        console.log("Total questions:", totalCount);
        console.log("Passed:", passed);

        const result = {
          score: scorePercentage,
          passed,
          attemptedAt: new Date().toISOString(),
        };

        await axios.post(
          `${process.env.EXPO_PUBLIC_API_URL}/api/user/quiz/${quizId}/result`,
          { score: scorePercentage },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        updateQuizResult(quizId, result);
        setShowModal(true);
      } catch (error: any) {
        console.error("❌ Failed to save quiz result:", error);
        Alert.alert("Error", "Failed to save quiz result. Please try again.");
      }
    },
    [
      quizId,
      currentQuiz,
      currentCourse,
      currentChapter,
      token,
      updateQuizResult,
    ]
  );

  const finishQuiz = async () => {
    console.log("🎯 Quiz Finished:");
    console.log("Final correct answers:", correctCount);
    console.log("Total questions:", total);

    await saveQuizResult(correctCount, total);
  };

  const handleModalClose = () => {
    setShowModal(false);

    if (!isPassed && currentChapter && currentCourse) {
      router.push({
        pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
        params: {
          chapterId: currentChapter.id,
          thumbnail: currentCourse.thumbnail ?? "",
          courseId: currentCourse.id,
          title: currentCourse.title,
          description:
            currentCourse.description ?? currentCourse.overview ?? "",
          duration: currentChapter.duration.toString(),
        },
      });
    } else {
      if (!currentCourse || !currentChapter) return;
      const currentIndex = currentCourse.chapters.findIndex(
        (ch) => ch.id === currentChapter.id
      );
      const nextChapter = currentCourse.chapters[currentIndex + 1];

      if (nextChapter) {
        axios
          .get(
            `${process.env.EXPO_PUBLIC_API_URL}/api/user/chapters/${nextChapter.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          )
          .then((res) => {
            const nextChapterData = res.data.data;
            router.push({
              pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
              params: {
                chapterId: nextChapterData.id,
                thumbnail: currentCourse.thumbnail ?? "",
                courseId: currentCourse.id,
                title: currentCourse.title,
                description:
                  currentCourse.description ?? currentCourse.overview ?? "",
                duration: nextChapterData.duration.toString(),
              },
            });
          });
      } else {
        router.push({
          pathname: "/Authenticated/(tabs)/Coins",
          params: { id: currentCourse.id, screenType: "courseComplete" },
        });
      }
    }
  };

  if (!currentQuiz || !questions.length || !quizId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No quiz data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={currentChapter?.title || currentQuiz.title || "Quiz"}
      />

      <View style={styles.QuizBody}>
        <QuizQuestion
          question={questions[currentIndex].text}
          number={currentIndex + 1}
          total={questions.length}
        />

        {questions[currentIndex].options.map((item, index) => (
          <OptionButton
            key={item.id}
            label={item.text}
            index={index}
            isSelected={currentAnswer?.optionId === item.id}
            onPress={() => {
              setAnswers((prev) => ({
                ...prev,
                [currentIndex]: {
                  text: item.text,
                  optionId: item.id,
                  isCorrect: item.isCorrect,
                },
              }));
            }}
            onDoubleTap={() => {
              setAnswers((prev) => {
                const updated = { ...prev };
                delete updated[currentIndex];
                return updated;
              });
            }}
          />
        ))}
      </View>

      <QuizFooter
        backLabel={currentIndex === 0 ? "Back" : "Previous"}
        nextLabel={currentIndex === questions.length - 1 ? "Submit" : "Next"}
        onBack={() => {
          if (currentIndex === 0) {
            // First question - go back to summary screen
            router.back();
          } else {
            // Other questions - go to previous question (answers are preserved in state)
            setCurrentIndex(currentIndex - 1);
          }
        }}
        nextDisabled={!isChoseOption}
        onNext={async () => {
          if (!isChoseOption) return;

          if (currentIndex < questions.length - 1) {
            // Move to next question (answer is already stored in answers state)
            setCurrentIndex(currentIndex + 1);
          } else {
            // Last question - submit the quiz
            await finishQuiz();
          }
        }}
      />
      {showModal && (
        <PopUp
          coins={currentQuiz.coinValue.toString()}
          onClose={handleModalClose}
          score={correctCount}
          total={questions.length}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#E5E8F1",
    paddingHorizontal: 25,
    paddingBottom: 60,
  },
  QuizBody: {
    backgroundColor: "#E1DEF3",
    borderRadius: 15,
    padding: 20,
    marginTop: 24,
  },
  errorText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    fontFamily: "HelveticaNeue",
  },
});

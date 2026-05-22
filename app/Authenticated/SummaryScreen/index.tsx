"use client";
import ScreenHeader from "@/components/common/ScreenHeader";
import { useCourseStore } from "@/stores/Course/courseStore";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

interface Course {
  id: string;
  title: string;
  author: string;
}

interface Chapter {
  id: string;
  title: string;
  description: string;
  course: Course;
  duration: number;
  quizzes: { id: string; coinValue: number }[];
}

interface Summary {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  imgUrl: string;
  createdAt: string;
  updatedAt: string;
  chapter: Chapter;
}

const SummaryIndex = ({ courseId }: { courseId?: string }) => {
  const { width: screenWidth } = Dimensions.get("window");
  const router = useRouter();
  const currentCourse = useCourseStore((state) => state.currentCourse);
  const currentChapter = useCourseStore((state) => state.currentChapter);
  const setCurrentChapter = useCourseStore((state) => state.setCurrentChapter);

  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [webViewHeight, setWebViewHeight] = useState(500);

  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.height) {
        const calculatedHeight = Math.max(Number(data.height) + 40, 500);
        console.log("WebView height calculated:", calculatedHeight);
        setWebViewHeight(calculatedHeight);
      }
    } catch (e) {
      console.error("Error parsing WebView height:", e);
    }
  }, []);

  const injectedJavaScript = `
    (function() {
      function sendHeight() {
        const height = Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
        window.ReactNativeWebView.postMessage(
          JSON.stringify({ height: height })
        );
      }
      
      // Send height immediately
      sendHeight();
      
      // Send after DOM is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', sendHeight);
      }
      
      // Send after all resources are loaded
      window.addEventListener('load', sendHeight);
      
      // Send after a delay to catch dynamic content
      setTimeout(sendHeight, 100);
      setTimeout(sendHeight, 300);
      setTimeout(sendHeight, 500);
      
      // Watch for any DOM changes
      const observer = new MutationObserver(sendHeight);
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true
      });
      
      true; // Required for injected JavaScript
    })();
  `;

  useEffect(() => {
    if (currentChapter?.id) {
      const fetchSummaries = async () => {
        try {
          setLoading(true);
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/api/summaries/chapter/${currentChapter.id}`
          );
          const result = await response.json();
          if (result.success) {
            setSummaries(result.data);
          } else {
            // setError("No summaries found");
          }
        } catch {
          setError("Error fetching summaries");
        } finally {
          setLoading(false);
        }
      };
      fetchSummaries();
    }
  }, [currentChapter?.id]);

  useEffect(() => {
    // Reset height when summary changes
    setWebViewHeight(500);
    console.log("Current summary changed:", summaries[currentSummaryIndex]?.id);
  }, [summaries, currentSummaryIndex]);

  const handleNext = () => {
    if (currentSummaryIndex < summaries.length - 1) {
      setCurrentSummaryIndex(currentSummaryIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentSummaryIndex > 0) {
      setCurrentSummaryIndex(currentSummaryIndex - 1);
    }
  };

  // Check if quiz is available
  const hasQuiz =
    currentChapter?.quizzes &&
    currentChapter.quizzes.length > 0 &&
    currentChapter.quizzes[0]?.id;

  // Get next chapter
  const getNextChapter = () => {
    if (!currentCourse?.chapters || !currentChapter) return null;
    const currentIndex = currentCourse.chapters.findIndex(
      (ch) => ch.id === currentChapter.id
    );
    if (
      currentIndex === -1 ||
      currentIndex >= currentCourse.chapters.length - 1
    ) {
      return null;
    }
    return currentCourse.chapters[currentIndex + 1];
  };

  const nextChapter = getNextChapter();

  const handleNextChapter = () => {
    if (nextChapter) {
      setCurrentChapter(nextChapter.id);
      router.push({
        pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
        params: {
          chapterId: nextChapter.id,
          thumbnail: currentCourse?.thumbnail ?? "",
          courseId: currentCourse?.id,
          title: currentCourse?.title,
          description:
            currentCourse?.description ?? currentCourse?.overview ?? "",
          duration: nextChapter.duration?.toString() ?? "0",
        },
      });
    }
  };

  if (!currentChapter) {
    return (
      <View className="flex-1 bg-[#E5E8F1]">
        <ScreenHeader title="Summary" />
        <View className="flex-1 items-center justify-center">
          <Text>No chapter selected</Text>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-[#E5E8F1]">
        <ScreenHeader title={currentChapter.title} />
        <View className="flex-1 items-center justify-center">
          <Text>Loading summaries...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 bg-[#E5E8F1]">
        <ScreenHeader title={currentChapter.title} />
        <View className="flex-1 items-center justify-center">
          <Text>{error}</Text>
        </View>
      </View>
    );
  }

  const currentSummary = summaries[currentSummaryIndex];

  return (
    <View className="flex-1 bg-[#E5E8F1]">
      <ScreenHeader title={currentChapter.title} />
      <ScrollView
        className="mt-4"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        {currentSummary ? (
          <>
            {currentSummary.imgUrl ? (
              <View
                className="bg-white rounded-xl mb-3 p-3 justify-center flex items-center self-center"
                style={{ width: screenWidth * 0.92 }}
              >
                <Image
                  source={{ uri: currentSummary.imgUrl }}
                  style={{ width: screenWidth * 0.87, height: 200 }}
                  resizeMode="contain"
                />
              </View>
            ) : null}

            <View
              className="bg-[#ffffff] mb-2 rounded-2xl py-3 self-center px-4 "
              style={{ width: screenWidth * 0.92 }}
            >
              <View
                className="border-b-[1px] border-[#0000000D]"
                style={{ paddingHorizontal: 2, paddingBottom: 4 }}
              >
                <Text className="font-helveticaNeue text-[24px] leading-relaxed">
                  {currentSummary.title || "Summary"}{" "}
                </Text>
              </View>

              <WebView
                originWhitelist={["*"]}
                source={{
                  html: `
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                        <style>
                          * {
                            margin: 0;
                            padding: 0;
                            box-sizing: border-box;
                          }
                          html, body {
                            width: 100%;
                            height: auto;
                            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                            font-size: 16px;
                            line-height: 1.6;
                            color: #333;
                            padding: 4px;
                            overflow-x: hidden;
                          }
                          img, video, iframe {
                            max-width: 100% !important;
                            height: auto !important;
                            display: block;
                            margin: 12px 0;
                          }
                          p, div, span, section, article {
                            max-width: 100%;
                            word-wrap: break-word;
                            overflow-wrap: break-word;
                          }
                          p {
                            margin: 12px 0;
                          }
                          h1, h2, h3, h4, h5, h6 {
                            margin: 16px 0 8px 0;
                            line-height: 1.3;
                          }
                          h1 { font-size: 24px; }
                          h2 { font-size: 22px; }
                          h3 { font-size: 20px; }
                          h4 { font-size: 18px; }
                          ul, ol {
                            margin: 12px 0;
                            padding-left: 24px;
                          }
                          li {
                            margin: 6px 0;
                          }
                          a {
                            color: #563FA5;
                            text-decoration: none;
                          }
                          blockquote {
                            border-left: 4px solid #563FA5;
                            padding-left: 16px;
                            margin: 12px 0;
                            color: #666;
                          }
                          pre, code {
                            background-color: #f5f5f5;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-family: monospace;
                            font-size: 14px;
                          }
                          pre {
                            padding: 12px;
                            overflow-x: auto;
                          }
                          table {
                            width: 100%;
                            border-collapse: collapse;
                            margin: 12px 0;
                          }
                          th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                          }
                          th {
                            background-color: #f5f5f5;
                          }
                        </style>
                      </head>
                      <body>
                        ${currentSummary.content || "<p>No content available</p>"}
                      </body>
                    </html>
                  `,
                }}
                style={{
                  width: "100%",
                  height: webViewHeight,
                  backgroundColor: "transparent",
                }}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                injectedJavaScript={injectedJavaScript}
                javaScriptEnabled={true}
                onMessage={handleWebViewMessage}
                onError={(syntheticEvent) => {
                  const { nativeEvent } = syntheticEvent;
                  console.error("WebView error:", nativeEvent);
                }}
                onLoadEnd={() => {
                  console.log("WebView loaded");
                }}
              />
            </View>
          </>
        ) : (
          <View
            className="bg-[#ffffff] mb-2 rounded-2xl py-6 self-center px-4 items-center justify-center"
            style={{ width: screenWidth * 0.92, minHeight: 200 }}
          >
            <Text className="text-[#666] text-[16px]">
              No summary available for this chapter
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-center bg-[#E5E8F1] pb-10 pt-4"
        style={{ width: screenWidth }}
      >
        <View
          className="flex-row items-center justify-between"
          style={{ width: screenWidth * 0.92 }}
        >
          {currentSummaryIndex === 0 ? (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/Authenticated/(tabs)/Courses/VideoScreen",
                  params: {
                    chapterId: currentChapter.id,
                    thumbnail: currentCourse?.thumbnail ?? "",
                    courseId: currentCourse?.id,
                    title: currentCourse?.title,
                    description:
                      currentCourse?.description ??
                      currentCourse?.overview ??
                      "",
                    duration: currentChapter.duration.toString(),
                  },
                });
              }}
              className="border-[1px] border-[#00000026] rounded-[13px] px-5 py-2 bg-white"
              style={{ width: "48%" }}
            >
              <Text
                style={{ color: "#000000" }}
                className="py-3 text-center font-medium"
              >
                Replay
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleBack}
              className="border-[1px] border-[#00000026] rounded-[13px] px-5 py-2 bg-white"
              style={{ width: "48%" }}
            >
              <Text
                style={{ color: "#000000" }}
                className="py-3 text-center font-medium"
              >
                Back
              </Text>
            </Pressable>
          )}

          {currentSummaryIndex < summaries.length - 1 ? (
            <Pressable
              onPress={handleNext}
              className="bg-[#563FA5] rounded-[13px] px-5 py-2"
              style={{ width: "48%" }}
            >
              <Text className="text-white py-3 text-center font-medium">
                Next
              </Text>
            </Pressable>
          ) : hasQuiz ? (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/Authenticated/QuizesPoint/HowQuizWorks",
                  params: {
                    coins:
                      currentChapter.quizzes[0]?.coinValue ??
                      currentChapter.coinValue ??
                      0,
                    quizData: JSON.stringify({
                      quizzes: currentChapter.quizzes,
                    }),
                    quizId: currentChapter.quizzes[0].id,
                  },
                });
              }}
              className="bg-[#563FA5] rounded-[13px] px-5 py-2"
              style={{ width: "48%" }}
            >
              <Text className="text-white py-3 text-center font-medium">
                Quiz
              </Text>
            </Pressable>
          ) : nextChapter ? (
            <Pressable
              onPress={handleNextChapter}
              className="bg-[#563FA5] rounded-[13px] px-5 py-2"
              style={{ width: "48%" }}
            >
              <Text className="text-white py-3 text-center font-medium">
                Next Chapter
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={() => router.push("/Authenticated/(tabs)/Courses")}
              className="bg-[#563FA5] rounded-[13px] px-5 py-2"
              style={{ width: "48%" }}
            >
              <Text className="text-white py-3 text-center font-medium">
                Done
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default SummaryIndex;

import currentVid from "@/stores/currentVid";
import { useRecentlyWatched } from "@/hooks/useRecentlyWatched";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

const ContinueWatchingCard = ({
  continueTxt = true,
}: {
  continueTxt?: boolean;
}) => {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const cardHeight = screenHeight * 0.16;
  const totalSectionHeight = cardHeight + screenHeight * 0.05;
  const router = useRouter();
  const { setVidId } = currentVid();
  const { items: vidData, isLoading } = useRecentlyWatched(5);

  if (isLoading) {
    return (
      <View
        className="mt-2 self-center mb-[20px]"
        style={{ width: screenWidth * 0.875, height: totalSectionHeight }}
      >
        {continueTxt && (
          <Text
            className="mb-2"
            style={{ fontFamily: "Teachers-Medium", fontWeight: "500", fontSize: 18 }}
          >
            Continue Learning
          </Text>
        )}
        <View className="bg-white flex-1 w-full rounded-[15px]">
          <View className="flex-row h-full p-2 gap-3">
            <View className="w-[48%] h-full bg-gray-100 rounded-md" />
            <View className="flex-1 gap-2 pt-1">
              <View className="h-4 w-[85%] bg-gray-100 rounded-md" />
              <View className="h-3 w-[60%] bg-gray-100 rounded-md" />
              <View className="h-2 w-full bg-gray-100 rounded-md mt-2" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!vidData || vidData.length === 0) {
    return (
      <View
        className="mt-2 self-center mb-[20px]"
        style={{ width: screenWidth * 0.875, height: totalSectionHeight }}
      >
        {continueTxt && (
          <Text
            className="mb-2"
            style={{ fontFamily: "Teachers-Medium", fontWeight: "500", fontSize: 18 }}
          >
            Continue Learning
          </Text>
        )}
        <View className="bg-white flex-1 w-full flex items-center justify-center rounded-[15px]">
          <Text className="font-teachers-medium text-[#0000008C] text-sm">
            Start your first course
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      className="mt-2 mb-[10px] self-center relative"
      style={{ width: screenWidth * 0.875, height: totalSectionHeight }}
    >
      {continueTxt && (
        <Text
          className="mb-1"
          style={{ fontFamily: "Teachers-Medium", fontWeight: "500", fontSize: 18 }}
        >
          Continue Learning
        </Text>
      )}

      {vidData.map((item) => {
        const progress = Math.round(item.progressPercentage);

        return (
          <Pressable
            key={item.chapterId}
            style={{ width: "100%" }}
            onPress={() => {
              setVidId(item.courseId);
              router.push({
                pathname: "/Authenticated/(tabs)/Courses/CouseVideos",
                params: { id: item.courseId },
              });
            }}
          >
            <View
              className="bg-white p-[2px] flex-row items-center justify-center rounded-[15px]"
              style={{ height: screenHeight * 0.19 }}
            >
              <View className="w-[50%] h-full p-2">
                {item.courseThumbnail ? (
                  <Image
                    source={{ uri: item.courseThumbnail }}
                    className="h-full w-full rounded-md"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full rounded-md bg-gray-100" />
                )}
              </View>

              <View className="w-[50%] h-full flex-col gap-1 p-2 justify-center">
                <Text
                  className="font-poppins-medium"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ fontSize: screenHeight * 0.015 }}
                >
                  {item.courseTitle}
                </Text>
                <Text
                  className="font-poppins-regular text-[#0000008C]"
                  numberOfLines={1}
                  style={{ fontSize: screenHeight * 0.013 }}
                >
                  {item.chapterTitle}
                </Text>

                <View className="w-full h-[7px] bg-[#ECE9F4] rounded-[8px] flex justify-center px-[1px] mt-1">
                  <View
                    style={{
                      width: `${Math.min(100, Math.max(0, progress))}%`,
                      height: 5,
                      backgroundColor: progress === 100 ? "#22C55E" : "#730A96",
                      borderRadius: 4,
                    }}
                  />
                </View>

                <View className="flex flex-row justify-between w-full mt-0.5">
                  <Text className="font-teachers-medium text-[#0000008C] text-xs">
                    Progress
                  </Text>
                  <Text className="font-teachers-medium text-[#0000008C] text-xs">
                    {progress}%
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};

export default ContinueWatchingCard;

import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

type CourseCardProps = {
  title: string;
  author: string;
  price: string;
  duration: { hours: string; seconds: string };
  image: any;
  backgroundColor: string;
  durationBackgroundColor: string;
  orientation: string;
  courses?: string;
  total?: number;
  watched?: number;
};

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  author,
  price,
  duration,
  image,
  backgroundColor,
  durationBackgroundColor,
  orientation,
  courses,
  watched = 0,
  total = 100,
}) => {
  const router = useRouter();
  //Responsive dimensions
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  const progress = (watched / total) * 100;
  const iconOffset = screenWidth * 0.101; // 10.1% of screen width

  return (
    <Pressable
      onPress={() => {
        router.push("/Authenticated/courseVideos/CouseVideos");
      }}
    >
      <View
        className="  rounded-2xl p-4  flex flex-row"
        style={{
          backgroundColor: backgroundColor,
          height: screenHeight * 0.195,
          width: orientation === "vertical" ? "100%" : screenWidth * 0.745,
          marginRight: orientation === "vertical" ? 0 : 30,
          marginTop: orientation === "vertical" ? 10 : 0,
        }}
      >
        <View
          className="rounded-2xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.4)",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        />
        <View className="flex-1">
          {/* Price */}
          <View className="h-[25px] flex-row items-center space-x-1 mb-[10px] bg-white max-w-20 justify-center py-1 rounded-2xl">
            <Image
              source={require("@/assets/icons/Coins/coin.png")}
              style={{ height: 17, width: 15, marginRight: 4 }}
            />
            <Text className="text-[#730A96] font-teachers-semibold text-[12px]">
              {price}
            </Text>
          </View>

          {/* Title & Author */}
          <Text className="text-2xl font-bold text-black font-poppins-semibold">
            {title}
          </Text>

          <View className="flex-row flex">
            <Text className="text-gray-600 mb-3 text-[14px] font-medium font-teachers-medium">
              by{" "}
            </Text>
            <Text className="text-black  mb-3 text-[14px] font-medium font-teachers-medium">
              {author}
            </Text>
          </View>

          {courses == "active" && (
            <View className="flex-col mt-[4px]">
              <View className="h-3 bg-[#FFE1F0] rounded-full mt-[3px] pl-1 justify-center ">
                <View
                  className="h-2 bg-[#FD8DC5] rounded-lg "
                  style={{ width: `${progress}%` }}
                />
              </View>
              <View className="flex-row justify-between mt-[3px]">
                <Text className="font-teachers-medium text-[14px] text-[#0000008C]">
                  Progress
                </Text>
                <Text className="font-teachers-semibold text-[14px] text-[#000000D9]">
                  {watched} %
                </Text>
              </View>
            </View>
          )}
          {courses == "all" && (
            <View
              className="flex-row space-x-2  rounded-xl py-1 items-center"
              style={{
                backgroundColor: durationBackgroundColor,
                height: (screenHeight / 956) * 38,
                width: (screenWidth / 440) * 117,
              }}
            >
              <View
                className="rounded-xl"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0,
                }}
              />
              {/* Hours */}
              <View className="px-3 flex-row items-end border-r-[1px] border-[#00000040]">
                <Text className="text-black text-lg font-poppins-semibold">
                  {duration.hours}
                </Text>
                <Text className="text-xs text-black  mb-[4px] font-poppins">
                  hrs
                </Text>
              </View>

              {/* Seconds */}
              <View className="px-3 flex-row items-end">
                <Text className="text-black  text-lg font-poppins-semibold">
                  {duration.seconds}
                </Text>
                <Text className="text-xs text-black  mb-[4px] font-poppins">
                  sec
                </Text>
              </View>
            </View>
          )}
          {courses == "completed" && (
            <View
              className="flex-row space-x-2 w-[117px] h-[38px] rounded-xl py-1 items-center justify-center"
              style={{ backgroundColor: durationBackgroundColor }}
            >
              <View
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.4)",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 0,
                }}
              />

              <Text className="text-black text-[14px] font-poppins-semibold">
                Completed
              </Text>
            </View>
          )}
        </View>
        <View className="relative flex-1">
          <Image
            source={image}
            className="  absolute -top-7 "
            style={{
              right: -iconOffset,
              height: (screenHeight / 956) * 189,
              width: (screenWidth / 440) * 189,
            }}
            resizeMode="contain"
          />
        </View>
      </View>
    </Pressable>
  );
};

export default CourseCard;

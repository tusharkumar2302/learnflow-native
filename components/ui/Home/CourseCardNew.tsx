import currentVid from "@/stores/currentVid";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

type CourseCardProps = {
  title: string;
  author: string;
  category: string;
  price: string;
  duration: { hours: string; seconds: string };
  image: any;
  orientation?: string;
  courses?: string;
  total?: number;
  watched?: number;
  imageUrl?: string;
  id: string;
  totalCoins: number;
  isUnlocked?: boolean | null;
  onLockedPress?: () => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  title,
  author,
  category,
  price,
  duration,
  image,
  orientation,
  courses,
  watched = 0,
  total = 100,
  imageUrl,
  id,
  totalCoins,
  isUnlocked,
  onLockedPress,
}) => {
  const router = useRouter();
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  const { setVidId } = currentVid();

  return (
    <Pressable
      // disabled={isUnlocked === false}
      onPress={() => {
        if (isUnlocked === false) {
          onLockedPress?.();
          return;
        }

        setVidId(id);
        router.push({
          pathname: "/Authenticated/(tabs)/Courses/CouseVideos",
          params: { id },
        });
      }}
    >
      <View
        className="rounded-2xl flex flex-col px-[9px] py-[10px]"
        style={{
          backgroundColor: "white",
          width: orientation === "vertical" ? "100%" : screenWidth * 0.64,
          maxWidth: orientation === "vertical" ? undefined : 300,
          marginRight: orientation === "vertical" ? 0 : 15,
          marginTop: orientation === "vertical" ? 14 : 0,
          opacity: isUnlocked === false ? 0.6 : 1,
        }}
      >
        <Image
          source={{ uri: image }}
          style={{
            height: screenHeight * 0.164,
            width: "100%",
            borderRadius: 10,
            alignSelf: "center",
          }}
        />

        <View className="flex flex-col mt-2">
          <View className="flex flex-row justify-between items-center">
            <View className="flex flex-row my-[4px] gap-x-1 items-center">
              <Image
                source={require("@/assets/icons/Coins/coin.png")}
                className="w-[14px] h-[14px]"
              />
              <Text
                className="font-teachers-semibold text-[#730A96]"
                style={{ fontSize: screenHeight * 0.012 }}
              >
                {totalCoins} Coins
              </Text>
            </View>

            <View className="px-[5px] py-[1px] items-center justify-center bg-[#E6F5FF] rounded-[3px]">
              <Text
                className="font-poppins text-[#000000]"
                style={{ fontSize: screenHeight * 0.011 }}
              >
                {category}
              </Text>
            </View>
          </View>

          <Text
            className="font-poppins-medium text-[#000000]"
            style={{ fontSize: screenHeight * 0.018 }}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {title}
          </Text>
        </View>

        {isUnlocked === false && (
          <View
            style={{
              position: "absolute",
              top: 30,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "flex-start",
              paddingTop: 10,
            }}
          >
            <LottieView
              source={require("@/assets/lottie/lock.json")}
              autoPlay
              loop
              style={{ width: 80, height: 80 }}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
};

export default CourseCard;

import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";
export default function Banner() {
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");

  return (
    <View
      className=" relative self-center overflow-visible mt-3"
      style={{
        width: screenWidth * 0.875,
        height: screenHeight * 0.179,

        marginBottom: 20,
      }}
    >
      <LinearGradient
        colors={["#BC86FE", "#D7A8FF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 16,
          width: screenWidth * 0.875,
          height: screenHeight * 0.179,
          overflow: "visible",
          padding: screenWidth * 0.02,
        }}
        className="p-4 flex-row items-center"
      >
        <View className="flex-1 z-50">
          <Text
            className="text-black font-teachers-semibold"
            style={{ fontSize: (screenWidth / 440) * 24 }}
          >
            Learn.Trade.Grow
          </Text>
          <Text
            className="text-black/45 mt-1 font-helveticaNeue"
            style={{
              fontSize: (screenWidth / 440) * 14,
              width: screenWidth * 0.48,
            }}
          >
            All-in-one gateway to mastering forex trading while earning real
            value.
          </Text>
          {/* <View className="flex-row items-center mt-6">
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/1.jpg",
              }}
              className="rounded-full"
              style={{
                height: (screenHeight / 956) * 29,
                width: (screenWidth / 440) * 29,
                borderWidth: 3,
                borderColor: "#CBA2F9",
              }}
            />
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/2.jpg" }}
              className="rounded-full ml-[-8]"
              style={{
                height: (screenHeight / 956) * 29,
                width: (screenWidth / 440) * 29,
                borderWidth: 3,
                borderColor: "#CBA2F9",
              }}
            />
            <Image
              source={{
                uri: "https://randomuser.me/api/portraits/women/3.jpg",
              }}
              className="rounded-full ml-[-8]"
              style={{
                height: (screenHeight / 956) * 29,
                width: (screenWidth / 440) * 29,
                borderWidth: 3,
                borderColor: "#CBA2F9",
              }}
            />
            <Text
              className="text-black ml-2 font-medium font-helveticaNeue"
              style={{ fontSize: (screenWidth / 440) * 14 }}
            >
              +100K Achievers
            </Text>
          </View>*/}
        </View>
      </LinearGradient>

      <Image
        resizeMode={"contain"}
        source={require("@/assets/images/homeBanner.png")}
        className="absolute top-0 right-0 z-40"
        style={{
          width: screenWidth * 0.6,
          // height: screenHeight * 0.19,
          height: screenHeight * 0.195, // changed value from 0.19 to 0.215
          transform: [{ translateX: 15 }, { translateY: -8.99 }],
        }}
      />
    </View>
  );
}

import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

const steps = [
  {
    icon: require("@/assets/icons/HowItWorks/courses-icon.png"),
    label: "Watch Course Videos",
    height: 100,
    width: 100,
  },
  {
    icon: require("@/assets/icons/HowItWorks/coins-icon.png"),
    label: "Earn Coins while Learn Trading",
    height: 100,
    width: 100,
  },
  {
    icon: require("@/assets/icons/HowItWorks/redeem-icon.png"),
    label: "Redeem Coins",
    height: 100,
    width: 100,
  },
];

export default function HowItWorks() {
  const [visible, setVisible] = useState(true);
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  const baseWidth = 440;
  const scale = screenWidth / baseWidth;
  const baseSize = 25;
  const scaledSize = baseSize * scale;
  const usableWidth = screenWidth * 0.875;
  const numItems = steps.length;
  const numArrows = numItems - 1;
  const spacing = scaledSize + 12;
  const totalSpacing = spacing * numArrows;
  const itemWidth = (usableWidth - totalSpacing) / numItems;

  return (
    <>
      {visible && (
        <View
          className="mt-6 mb-[20px] self-center overflow-hidden "
          style={{ width: screenWidth * 0.875 }}
        >
          <View className="flex flex-row justify-between">
            <Text className="text-2xl font-teachers-semibold">
              How it Works?
            </Text>
            <Pressable
              onPress={() => {
                setVisible(false);
              }}
            >
              <AntDesign
                name="close"
                size={22}
                color="#00000059"
                style={{ height: 25, width: 25 }}
              />
            </Pressable>
          </View>

          <View className="flex-row mt-6  ">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <View style={{ width: itemWidth, alignItems: "center" }}>
                  <View style={{ width: itemWidth * 0.65, aspectRatio: 1 }}>
                    <Image
                      source={step.icon}
                      style={{
                        width: "100%",
                        height: "100%",
                        resizeMode: "cover",
                      }}
                    />
                  </View>

                  <Text
                    className="text-center mt-2  font-teachers-medium text-black/70"
                    style={{
                      fontSize: (screenWidth / 440) * 14,
                      width: itemWidth * 0.9,
                    }}
                  >
                    {step.label}
                  </Text>
                </View>

                {index < steps.length - 1 && (
                  <View className="items-center justify-start mt-5">
                    <Image
                      source={require("@/assets/icons/HowItWorks/arrow.png")}
                      style={{
                        height: scaledSize+10,
                        width: scaledSize+10,
                      }}
                    />
                  </View>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      )}
    </>
  );
}

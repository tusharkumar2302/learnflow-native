import React, { ReactNode } from "react";
import { Dimensions, View } from "react-native";

type HeaderProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  heading?: ReactNode;
  logo?: ReactNode;
};

export default function Header({
  left,
  center,
  right,
  heading,
  logo,
}: HeaderProps) {
  const { width: screenWidth } = Dimensions.get("window");
  return (
    <View
      className="flex-row mb-1  justify-between items-center  mt-2"
      style={{ width: screenWidth * 0.875, alignSelf: "center" }}
    >
      {/* Left section */}
      <View className="flex flex-row gap-5 items-center">
        {left ?? <View />}
        <View>{center ?? <View />}</View>
      </View>

      {/* Center section */}
      <View className="self-center">{heading ?? <View />}</View>
      {/* Right section */}
      <View>{right ?? <View />}</View>
    </View>
  );
}

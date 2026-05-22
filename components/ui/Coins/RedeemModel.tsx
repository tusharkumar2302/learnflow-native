// components/RedeemModal.tsx
import React from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";

type RedeemModalProps = {
  onClose: () => void;
};

const RedeemModal = ({ onClose }: RedeemModalProps) => {
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  return (
    <View className="absolute top-0 left-0 right-0 bottom-0 z-50 flex-1 items-center justify-center bg-black/50">
      <View
        className=" bg-white rounded-2xl p-6 items-center self-center"
        style={{ width: screenWidth * 0.87 }}
      >
        <View
          className=" h-[5px] bg-[#00000040] rounded-full"
          style={{ width: screenWidth * 0.32 }}
        />

        {/* Coin Icon */}
        <Image
          source={require("@/assets/icons/HowItWorks/redeem-icon.png")}
          className="  my-10 "
          style={{ width: screenWidth * 0.3, height: screenHeight * 0.138 }}
          resizeMode="contain"
        />

        {/* Headline */}
        <Text
          className="text-center mb-1 text-black font-teachers-medium"
          style={{ fontSize: screenHeight * 0.025 }}
        >
          Congratz, You’ve redeemed
        </Text>

        {/* Zuper Coins */}
        <Text
          className="text-center text-[#730A96] mb-2 font-teachers-bold"
          style={{ fontSize: screenHeight * 0.025 }}
        >
          Zuper Coins...
        </Text>

        {/* Subtext */}
        <Text
          className="text-center  max-w-[290px] text-[#0000008C] mb-6 font-teachers-medium"
          style={{ fontSize: screenHeight * 0.016, paddingHorizontal: 15 }}
        >You have earned Zuper Coins, Now redeem your coins into PropFirm</Text>

        {/* Done Button */}
        <Pressable
          onPress={onClose}
          className="w-full bg-[#563FA5] py-6  rounded-xl mb-3"
        >
          <Text
            className="text-center font-teachers-medium  text-white"
            style={{ fontSize: screenHeight * 0.019 }}
          >
            Done
          </Text>
        </Pressable>

        {/* Back Button */}
        <Pressable onPress={onClose}>
          <Text
            className="text-center font-teachers-medium  text-black"
            style={{ fontSize: screenHeight * 0.019 }}
          >
            Back
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default RedeemModal;

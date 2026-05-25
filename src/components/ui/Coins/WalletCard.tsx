import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

interface CoinsWalletCardProps {
  coins?: number;
  maxCoins?: number;
  screen: "coins" | "profile";
  totalEarned?: number;
  totalRedeemed?: number;
}

const CoinsWalletCard: React.FC<CoinsWalletCardProps> = ({
  coins = 0,
  maxCoins = 10000,
  screen,
  totalEarned = 0,
  totalRedeemed = 0,
}) => {
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");

  // Calculate progress based on total earned vs max coins needed for redemption
  const progress = (totalEarned / maxCoins) * 100;

  return (
    <View
      className="border-[1px] border-[#45065B] rounded-[18px] overflow-hidden w-full self-center"
      style={{
        width: screenWidth * 0.875,
        height: screen == "coins" ? screenHeight * 0.22 : screenHeight * 0.153,
      }}
    >
      <LinearGradient
        colors={["#A65DFF", "#7615C8"]}
        start={{ x: 0, y: 0 }}
        // end={{ x: 1, y: 0}}
        end={{ x: 2, y: 0 }}
        style={{
          borderRadius: 16,
          width: screenWidth * 0.875,
          height: screenHeight * 0.24,
        }}
        className="    flex-col  relative "
      >
        {/* Title */}
        <Text className="text-white text-[18px] font-teachers-medium mb-2 px-[18px] py-[9px] border-b border-white border-dashed">
          Wallet
        </Text>
        <View className="flex flex-row px-4">
          <View className="w-[65%]">
            {/* Coin Amount */}
            <View className="flex flex-row items-end mt-[8px]">
              <Text
                className="text-white text-[44px] font-teachers-bold mr-[5px]"
                style={{ lineHeight: 44 }}
              >
                {coins}
              </Text>
              <Text className="text-[#FFFFFFB2] text-[24px] font-teachers-medium mb-[5px]">
                Coins
              </Text>
            </View>
            {screen === "coins" && (
              <View className="flex-col justify-between mt-4">
                <Text className="text-[#FFFFFFB2] font-teachers-medium text-[16px]">
                  Total Earned: {totalEarned}
                </Text>
                <Text className="text-[#FFFFFFB2] font-teachers-medium text-[16px]">
                  Total Redeemed: {totalRedeemed}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-1 flex ml-4">
            {/* Trophy Image */}
            <Image
              source={require("@/assets/icons/Coins/trophy.png")}
              className=" z-50 "
              style={{
                width:
                  screen == "coins" ? screenWidth * 0.284 : screenWidth * 0.23,
                height:
                  screen == "coins" ? screenHeight * 0.13 : screenHeight * 0.1,
                position: screen == "coins" ? "relative" : "absolute",
                top: screen == "coins" ? 0 : -35,
              }}
            />
            <Image
              source={require("@/assets/icons/Coins/coin.png")}
              style={{
                width:
                  screen == "coins" ? screenWidth * 0.14 : screenWidth * 0.1,
                height:
                  screen == "coins" ? screenHeight * 0.08 : screenHeight * 0.05,
                position: "absolute",
                transform: [
                  { perspective: 1000 },
                  { rotateX: "35deg" },
                  { rotate: "170deg" },
                ],
                opacity: 1,
                right: screen == "coins" ? -8 : 12,
                top: screen == "coins" ? 41 : 1,
              }}
              className=" bottom-0"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default CoinsWalletCard;

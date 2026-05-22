import CoinsTabs from "@/components/ui/Coins/CoinsTab";
import CoinsWalletCard from "@/components/ui/Coins/WalletCard";
import HowItWorks from "@/components/ui/Home/HowItWorks";
import { useWallet } from "@/hooks/useWallet";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export default function CoinsWallet() {
  const router = useRouter();
  const { wallet, isLoading } = useWallet();

  return (
    <View className="bg-[#f5f3ff] flex-1">
      {/* Header */}
      <View
        style={{
          width: screenWidth,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
          marginBottom: 4,
          paddingHorizontal: screenWidth * 0.0625,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("/Authenticated/(tabs)/Home")}
          className="p-2 bg-[#FFFFFF59] rounded-full h-12 w-12 items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <Image
            source={require("@/assets/icons/menu-bar.png")}
            style={{ height: 13, width: 16 }}
          />
        </TouchableOpacity>

        <Text
          style={{
            position: "absolute",
            left: 0,
            width: screenWidth,
            textAlign: "center",
            fontSize: 18,
            fontFamily: "Poppins-Medium",
            color: "#000000",
          }}
        >
          Wallet
        </Text>

        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <View className="flex-row items-center bg-[#B483F140] rounded-full h-[32px] pl-8 pr-5 relative">
            <Image
              source={require("@/assets/icons/Coins/coin.png")}
              style={{ height: 40, width: 40, position: "absolute", left: -12, zIndex: 10 }}
            />
            <Text className="text-black text-base font-teachers-bold ml-2">
              {wallet?.balance ?? 0}
            </Text>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#730A96" />
          <Text className="text-gray-500 mt-2 font-teachers-medium text-sm">
            Loading...
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <CoinsWalletCard
            coins={wallet?.balance ?? 0}
            maxCoins={10000}
            screen="coins"
            totalEarned={wallet?.totalEarned ?? 0}
            totalRedeemed={wallet?.totalRedeemed ?? 0}
          />
          <HowItWorks />
          <CoinsTabs transactions={wallet?.transactions ?? []} />
        </View>
      )}
    </View>
  );
}

import CoinsTabs from "@/components/ui/Coins/CoinsTab";
import RedeemCoinsModal from "@/components/ui/Coins/RedeemCoinsModel";
import RedeemModal from "@/components/ui/Coins/RedeemModel";
import CoinsWalletCard from "@/components/ui/Coins/WalletCard";
import HowItWorks from "@/components/ui/Home/HowItWorks";
import UserProfileHeader from "@/components/ui/Profile/UserProfileHeader";
import { useWalletStore } from "@/stores/Wallet/walletStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const Profile = () => {
  const [redeemCoinsModalVisible, setRedeemCoinsModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const { walletData, loading, fetchWalletData } = useWalletStore();
  const router = useRouter();

  // Memoize fetchWalletData to avoid unnecessary re-renders
  const loadWalletData = useCallback(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  useEffect(() => {
    loadWalletData();
  }, [loadWalletData]);

  const handleRedeemSuccess = () => {
    // Show success modal
    setSuccessModalVisible(true);
    // Refresh wallet data
    fetchWalletData();
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };

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
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => router.replace("/Authenticated/Home")}
          className="p-2 bg-[#FFFFFF59] rounded-full h-12 w-12 items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <AntDesign name="left" size={16} color="#000000BF" />
        </TouchableOpacity>

        {/* Centered Title */}
        <Text
          style={{
            position: "absolute",
            left: 0,
            width: screenWidth,
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Poppins-Medium",
            color: "#000000",
          }}
        >
          Profile
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center py-20">
          <ActivityIndicator size="large" color="#730A96" />
          <Text className="text-gray-600 mt-4 font-teachers-medium">
            Loading wallet...
          </Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Profile Header */}
          <UserProfileHeader />

          {/* Wallet Card */}
          <CoinsWalletCard
            coins={walletData?.balance || 0}
            maxCoins={10000}
            screen="coins"
            totalEarned={walletData?.totalEarned || 0}
            totalRedeemed={walletData?.totalRedeemed || 0}
          />

          {/* Create Redeem Request Button */}
          <View className="px-5 mt-8 mb-4">
            <TouchableOpacity
              onPress={() => setRedeemCoinsModalVisible(true)}
              className="bg-[#730A96] py-5 rounded-2xl flex-row items-center justify-center shadow-lg"
            >
              <Image
                source={require("@/assets/icons/Coins/gift.png")}
                className="w-7 h-7 mr-3"
              />
              <Text className="text-white font-bold text-lg">
                Create Redeem Request
              </Text>
            </TouchableOpacity>
          </View>

          {/* How It Works */}
          <HowItWorks />

          {/* Coins Tabs with increased height */}
          <View style={{ minHeight: screenHeight * 0.6 }}>
            <CoinsTabs
              transactions={walletData?.transactions || []}
              currentBalance={walletData?.balance || 0}
              onRedeemSuccess={fetchWalletData}
            />
          </View>
        </ScrollView>
      )}

      {/* Redeem Coins Modal */}
      <RedeemCoinsModal
        visible={redeemCoinsModalVisible}
        onClose={() => setRedeemCoinsModalVisible(false)}
        currentBalance={walletData?.balance || 0}
        subscriptionTier="ZUPER_CENT"
        onSuccess={handleRedeemSuccess}
      />

      {/* Success Modal */}
      {successModalVisible && (
        <RedeemModal onClose={handleSuccessModalClose} />
      )}
    </View>
  );
};

export default Profile;
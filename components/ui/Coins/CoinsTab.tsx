import { useRedeemStore } from "@/stores/Coin/coinStore";
import { useWalletStore } from "@/stores/Wallet/walletStore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Transaction {
  id: string;
  type: "EARNED" | "REDEEMED";
  amount: number;
  note: string;
  date: string;
  formattedDate: string;
  formattedDateTime: string;
  course?: string | null;
}

interface CoinsTabsProps {
  transactions: Transaction[];
  currentBalance?: number;
  subscriptionTier?: string;
  onRedeemSuccess?: () => void;
}

export default function CoinsTabs({
  transactions,
  currentBalance,
  subscriptionTier,
  onRedeemSuccess,
}: CoinsTabsProps) {
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

  const [activeTab, setActiveTab] = useState<"redeem" | "history">("history");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // Redeem store
  const {
    redeemRequests,
    isLoading: redeemLoading,
    loadingMore: redeemLoadingMore,
    hasMoreRequests,
    fetchRedeemRequests,
    fetchMoreRedeemRequests,
  } = useRedeemStore();

  // Wallet store for transaction pagination
  const {
    loadingMore: transactionLoadingMore,
    hasMoreTransactions,
    fetchMoreTransactions,
  } = useWalletStore();

  // Refresh redeem requests when tab becomes active
  useEffect(() => {
    if (activeTab === "redeem") {
      fetchRedeemRequests();
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#FFA500";
      case "APPROVED":
        return "#4CAF50";
      case "REJECTED":
        return "#F44336";
      default:
        return "#999999";
    }
  };

  const getSubscriptionTierLabel = (tier: string) => {
    switch (tier) {
      case "ZUPER_CENT":
        return "Zuper Cent";
      case "ZUPER_PRO":
        return "Zuper Pro";
      case "ZUPER_VINTAGE":
        return "Zuper Vintage";
      default:
        return tier;
    }
  };

  // Handle load more for redeem requests
  const handleLoadMoreRedeem = useCallback(() => {
    if (!redeemLoadingMore && hasMoreRequests) {
      fetchMoreRedeemRequests();
    }
  }, [redeemLoadingMore, hasMoreRequests, fetchMoreRedeemRequests]);

  // Handle load more for transactions
  const handleLoadMoreTransactions = useCallback(() => {
    if (!transactionLoadingMore && hasMoreTransactions) {
      fetchMoreTransactions();
    }
  }, [transactionLoadingMore, hasMoreTransactions, fetchMoreTransactions]);

  // Render footer with loading indicator
  const renderFooter = (loading: boolean) => {
    if (!loading) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#730A96" />
        <Text className="text-gray-500 font-teachers-medium text-sm mt-2">
          Loading more...
        </Text>
      </View>
    );
  };

  const renderRedeemRequest = ({ item: request }: { item: any }) => (
    <View className="bg-[#F8F5FF] rounded-2xl p-5 mb-4 border border-purple-100 shadow-sm">
      <View className="flex-row justify-between items-start mb-2">
        <View>
          <Text className="text-xl font-teachers-bold text-[#730A96]">
            {request.coinsRequested?.toLocaleString()} coins
          </Text>
          <Text className="text-sm font-teachers-medium text-gray-600 mt-1">
            {getSubscriptionTierLabel(request.subscriptionTier)}
          </Text>
          {request.zuperiorAccountNumber && (
            <Text className="text-xs font-teachers-medium text-gray-500 mt-1">
              Acc: {request.zuperiorAccountNumber}
            </Text>
          )}
        </View>
        <View
          className="px-4 py-2 rounded-full"
          style={{
            backgroundColor: getStatusColor(request.status) + "20",
          }}
        >
          <Text
            style={{ color: getStatusColor(request.status) }}
            className="font-teachers-bold text-sm"
          >
            {request.status}
          </Text>
        </View>
      </View>

      {request.amountInDollars ? (
        <Text className="text-lg font-teachers-bold text-green-600 mt-3">
          ${request.amountInDollars.toFixed(2)}
        </Text>
      ) : request.conversionRate ? (
        <Text className="text-sm font-teachers-medium text-purple-600">
          ~$
          {(
            request.coinsRequested * request.conversionRate.dollarsPerCoin
          ).toFixed(2)}{" "}
          (est.)
        </Text>
      ) : null}

      <Text className="text-xs font-teachers-medium text-gray-500 mt-3">
        {new Date(request.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>

      {request.rejectionReason && (
        <Text className="text-sm font-teachers-medium text-red-600 mt-3 bg-red-50 p-3 rounded-lg">
          Reason: {request.rejectionReason}
        </Text>
      )}
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => {
        console.log("Selected DateTime:", item.formattedDateTime);
        setSelectedTransaction(item);
      }}
      className="flex-row items-center justify-between bg-[#F8F5FF] mb-3 rounded-2xl px-5 py-4 shadow-sm"
    >
      <View className="flex-1">
        <Text className="font-teachers-bold text-[#730A96] text-base">
          {item.note.length > 35 ? item.note.slice(0, 35) + "..." : item.note}
        </Text>
        <Text className="text-xs font-teachers-medium text-gray-500 mt-1">
          {item.formattedDate}
        </Text>
      </View>
      <View className="items-end">
        <Text
          className={`font-teachers-bold text-lg ${item.type === "EARNED" ? "text-green-600" : "text-red-600"}`}
        >
          {item.type === "EARNED" ? "+" : "-"} {item.amount}
        </Text>
        <Text className="text-xs font-teachers-medium text-gray-500">
          {item.type}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderRedeemEmpty = () => (
    <View className="items-center py-16">
      <Image
        source={require("@/assets/icons/Coins/no-coin.png")}
        style={{ width: 120, height: 120, opacity: 0.6 }}
        resizeMode="contain"
      />
      <Text className="font-teachers-medium text-gray-500 text-center mt-6 text-base">
        No redeem requests yet
      </Text>
      <Text className="font-teachers-medium text-gray-400 text-center text-sm mt-2">
        Your requests will appear here
      </Text>
    </View>
  );

  const renderHistoryEmpty = () => (
    <View className="flex-1 items-center justify-center py-12">
      <Image
        source={require("@/assets/icons/Coins/no-coin.png")}
        style={{ width: 120, height: 120, opacity: 0.7 }}
        resizeMode="contain"
      />
      <Text className="text-lg font-teachers-bold text-gray-700 mt-4 text-center">
        No Coin History
      </Text>
      <Text className="font-teachers-medium text-gray-500 text-center mt-2 max-w-xs px-4 text-sm">
        Start watching courses to earn coins and build your history!
      </Text>
    </View>
  );

  // Render list header (tabs)
  const renderListHeader = () => (
    <View className="flex-row border-b-2 border-gray-200">
      <TouchableOpacity
        className={`flex-1 py-4 items-center ${activeTab === "redeem" ? "border-b-4 border-[#730A96]" : ""}`}
        onPress={() => setActiveTab("redeem")}
      >
        <Text
          className={`text-base font-teachers-bold ${activeTab === "redeem" ? "text-[#730A96]" : "text-gray-500"}`}
        >
          Redeem Requests
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`flex-1 py-4 items-center ${activeTab === "history" ? "border-b-4 border-[#730A96]" : ""}`}
        onPress={() => setActiveTab("history")}
      >
        <Text
          className={`text-base font-teachers-bold ${activeTab === "history" ? "text-[#730A96]" : "text-gray-500"}`}
        >
          Coins History
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      className="bg-white rounded-2xl mt-6 shadow-lg mx-4 overflow-hidden mb-4"
      style={{ minHeight: screenHeight * 0.5 }}
    >
      {renderListHeader()}

      {/* === CONTENT === */}
      <View style={{ minHeight: 400 }}>
        {activeTab === "redeem" ? (
          <>
            {redeemLoading && redeemRequests.length === 0 ? (
              <View className="flex-1 justify-center items-center py-10">
                <ActivityIndicator size="large" color="#730A96" />
                <Text className="font-teachers-medium text-gray-500 mt-2">
                  Loading requests...
                </Text>
              </View>
            ) : (
              <FlatList
                data={redeemRequests}
                renderItem={renderRedeemRequest}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={true}
                scrollEnabled={false}
                contentContainerStyle={{
                  paddingHorizontal: 16,
                  paddingTop: 16,
                  paddingBottom: 20,
                }}
                ListEmptyComponent={renderRedeemEmpty}
                onEndReached={handleLoadMoreRedeem}
                onEndReachedThreshold={0.5}
                ListFooterComponent={() => renderFooter(redeemLoadingMore)}
              />
            )}
          </>
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={true}
            scrollEnabled={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 20,
            }}
            ListEmptyComponent={renderHistoryEmpty}
            onEndReached={handleLoadMoreTransactions}
            onEndReachedThreshold={0.5}
            ListFooterComponent={() => renderFooter(transactionLoadingMore)}
          />
        )}
      </View>

      {/* === TRANSACTION DETAILS MODAL === */}
      <Modal visible={!!selectedTransaction} transparent animationType="slide">
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="w-16 h-1.5 bg-gray-300 rounded-full self-center mb-6" />
            <View className="items-center mb-6">
              <Image
                source={require("@/assets/icons/HowItWorks/coins-icon.png")}
                style={{ width: 80, height: 80 }}
                resizeMode="contain"
              />
            </View>

            {selectedTransaction && (
              <>
                <Text className="text-2xl font-teachers-bold text-center text-[#730A96] mb-6">
                  {selectedTransaction.type === "EARNED" ? "+" : "-"}
                  {selectedTransaction.amount} coins
                </Text>

                <View className="space-y-4">
                  <View>
                    <Text className="font-teachers-medium text-gray-500 text-sm">
                      Course
                    </Text>
                    <Text className="font-teachers-bold text-base">
                      {selectedTransaction.course || "General Activity"}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-teachers-medium text-gray-500 text-sm">
                      Note
                    </Text>
                    <Text className="font-teachers-bold text-base">
                      {selectedTransaction.note}
                    </Text>
                  </View>
                  <View>
                    <Text className="font-teachers-medium text-gray-500 text-sm">
                      Date & Time
                    </Text>
                    <Text className="font-teachers-bold text-base">
                      {selectedTransaction.formattedDateTime}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedTransaction(null)}
                  className="bg-[#730A96] py-4 rounded-2xl mt-8"
                >
                  <Text className="text-white text-center font-teachers-bold text-lg">
                    Close
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
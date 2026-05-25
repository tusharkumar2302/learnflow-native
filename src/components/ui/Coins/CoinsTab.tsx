import { useRedeemStore } from "@/stores/Coin/coinStore";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
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

const { height: screenHeight } = Dimensions.get("window");

export default function CoinsTabs({
  transactions,
  currentBalance,
  subscriptionTier,
  onRedeemSuccess,
}: CoinsTabsProps) {
  const [activeTab, setActiveTab] = useState<"redeem" | "history">("history");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const {
    redeemRequests,
    isLoading: redeemLoading,
    loadingMore: redeemLoadingMore,
    hasMoreRequests,
    fetchRedeemRequests,
    fetchMoreRedeemRequests,
  } = useRedeemStore();

  useEffect(() => {
    if (activeTab === "redeem") {
      fetchRedeemRequests();
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "#F59E0B";
      case "APPROVED": return "#16A34A";
      case "REJECTED": return "#DC2626";
      default: return "#999";
    }
  };

  const handleLoadMoreRedeem = useCallback(() => {
    if (!redeemLoadingMore && hasMoreRequests) fetchMoreRedeemRequests();
  }, [redeemLoadingMore, hasMoreRequests, fetchMoreRedeemRequests]);

  const renderRedeemRequest = ({ item: request }: { item: any }) => (
    <View style={ct.redeemCard}>
      <View style={ct.redeemRow}>
        <View>
          <Text style={ct.redeemAmount}>{request.coinsRequested?.toLocaleString()} coins</Text>
          {request.zuperiorAccountNumber && (
            <Text style={ct.redeemSub}>Acc: {request.zuperiorAccountNumber}</Text>
          )}
        </View>
        <View style={[ct.statusPill, { backgroundColor: getStatusColor(request.status) + "18" }]}>
          <Text style={[ct.statusText, { color: getStatusColor(request.status) }]}>
            {request.status}
          </Text>
        </View>
      </View>
      {request.amountInDollars ? (
        <Text style={ct.redeemDollar}>${request.amountInDollars.toFixed(2)}</Text>
      ) : null}
      <Text style={ct.redeemDate}>
        {new Date(request.createdAt).toLocaleDateString("en-IN", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </Text>
    </View>
  );

  const renderTransaction = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      onPress={() => setSelectedTransaction(item)}
      style={ct.txnCard}
      activeOpacity={0.75}
    >
      <View style={ct.txnLeft}>
        <Text style={ct.txnNote} numberOfLines={2}>{item.note}</Text>
        {item.course && (
          <Text style={ct.txnCourse} numberOfLines={1}>{item.course}</Text>
        )}
        <Text style={ct.txnDate}>{item.formattedDate}</Text>
      </View>
      <View style={ct.txnRight}>
        <Text style={[ct.txnAmount, item.type === "EARNED" ? ct.earned : ct.redeemed]}>
          {item.type === "EARNED" ? "+" : "−"}{item.amount}
        </Text>
        <Text style={ct.txnType}>{item.type === "EARNED" ? "Earned" : "Redeemed"}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRedeemEmpty = () => (
    <View style={ct.emptyContainer}>
      <Image
        source={require("@/assets/icons/Coins/no-coin.png")}
        style={{ width: 100, height: 100, opacity: 0.5 }}
        resizeMode="contain"
      />
      <Text style={ct.emptyTitle}>No redeem requests yet</Text>
      <Text style={ct.emptySubtitle}>Your requests will appear here</Text>
    </View>
  );

  const renderHistoryEmpty = () => (
    <View style={ct.emptyContainer}>
      <Image
        source={require("@/assets/icons/Coins/no-coin.png")}
        style={{ width: 100, height: 100, opacity: 0.5 }}
        resizeMode="contain"
      />
      <Text style={ct.emptyTitle}>No coin history yet</Text>
      <Text style={ct.emptySubtitle}>
        Complete lessons and quizzes to earn your first coins.
      </Text>
    </View>
  );

  return (
    <View style={ct.container}>
      {/* Tabs */}
      <View style={ct.tabBar}>
        <TouchableOpacity
          style={[ct.tab, activeTab === "redeem" && ct.activeTab]}
          onPress={() => setActiveTab("redeem")}
        >
          <Text style={[ct.tabText, activeTab === "redeem" && ct.activeTabText]}>
            Redeem Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ct.tab, activeTab === "history" && ct.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[ct.tabText, activeTab === "history" && ct.activeTabText]}>
            Coin History
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ minHeight: 380 }}>
        {activeTab === "redeem" ? (
          redeemLoading && redeemRequests.length === 0 ? (
            <View style={ct.loadingContainer}>
              <ActivityIndicator color="#730A96" />
            </View>
          ) : (
            <FlatList
              data={redeemRequests}
              renderItem={renderRedeemRequest}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={ct.listContent}
              ListEmptyComponent={renderRedeemEmpty}
              onEndReached={handleLoadMoreRedeem}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                redeemLoadingMore
                  ? () => <ActivityIndicator color="#730A96" style={{ padding: 16 }} />
                  : null
              }
            />
          )
        ) : (
          <FlatList
            data={transactions}
            renderItem={renderTransaction}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={ct.listContent}
            ListEmptyComponent={renderHistoryEmpty}
          />
        )}
      </View>

      {/* Transaction detail modal */}
      <Modal visible={!!selectedTransaction} transparent animationType="slide">
        <View style={ct.modalOverlay}>
          <View style={ct.modalSheet}>
            <View style={ct.modalHandle} />

            {selectedTransaction && (
              <>
                <Text style={ct.modalAmount}>
                  {selectedTransaction.type === "EARNED" ? "+" : "−"}
                  {selectedTransaction.amount} coins
                </Text>
                <Text style={[ct.modalAmountLabel, selectedTransaction.type === "EARNED" ? ct.earnedLabel : ct.redeemedLabel]}>
                  {selectedTransaction.type === "EARNED" ? "Coins Earned" : "Coins Redeemed"}
                </Text>

                <View style={ct.modalDetails}>
                  {selectedTransaction.course && (
                    <View style={ct.modalRow}>
                      <Text style={ct.modalKey}>Course</Text>
                      <Text style={ct.modalValue}>{selectedTransaction.course}</Text>
                    </View>
                  )}
                  <View style={ct.modalRow}>
                    <Text style={ct.modalKey}>Activity</Text>
                    <Text style={ct.modalValue}>{selectedTransaction.note}</Text>
                  </View>
                  <View style={ct.modalRow}>
                    <Text style={ct.modalKey}>Date</Text>
                    <Text style={ct.modalValue}>{selectedTransaction.formattedDateTime}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setSelectedTransaction(null)}
                  style={ct.modalClose}
                >
                  <Text style={ct.modalCloseText}>Done</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const ct = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginTop: 20,
    marginHorizontal: 16,
    overflow: "hidden",
    shadowColor: "#563FA5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#730A96",
  },
  tabText: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "rgba(0,0,0,0.40)",
  },
  activeTabText: {
    color: "#730A96",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  txnCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.06)",
  },
  txnLeft: {
    flex: 1,
    marginRight: 12,
    gap: 2,
  },
  txnNote: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#1A1A1A",
    lineHeight: 19,
  },
  txnCourse: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.45)",
  },
  txnDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.35)",
    marginTop: 2,
  },
  txnRight: {
    alignItems: "flex-end",
    gap: 2,
  },
  txnAmount: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 17,
  },
  txnType: {
    fontFamily: "Poppins-Regular",
    fontSize: 10,
    color: "rgba(0,0,0,0.35)",
  },
  earned: {
    color: "#16A34A",
  },
  redeemed: {
    color: "#DC2626",
  },
  redeemCard: {
    backgroundColor: "rgba(86,63,165,0.04)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 4,
  },
  redeemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  redeemAmount: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#563FA5",
  },
  redeemSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.45)",
    marginTop: 2,
  },
  redeemDollar: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "#16A34A",
  },
  redeemDate: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.35)",
  },
  statusPill: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.40)",
    textAlign: "center",
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
    gap: 4,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(0,0,0,0.12)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalAmount: {
    fontFamily: "Poppins-Bold",
    fontSize: 32,
    color: "#0D0D0D",
    textAlign: "center",
  },
  modalAmountLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 20,
  },
  earnedLabel: { color: "#16A34A" },
  redeemedLabel: { color: "#DC2626" },
  modalDetails: {
    backgroundColor: "rgba(86,63,165,0.04)",
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  modalRow: {
    gap: 2,
  },
  modalKey: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "rgba(0,0,0,0.40)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  modalValue: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#1A1A1A",
    lineHeight: 20,
  },
  modalClose: {
    marginTop: 20,
    backgroundColor: "#563FA5",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  modalCloseText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#fff",
  },
});

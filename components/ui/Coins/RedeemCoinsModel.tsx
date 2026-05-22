import { useRedeemStore } from "@/stores/Coin/coinStore";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

interface RedeemModalProps {
  visible: boolean;
  onClose: () => void;
  currentBalance: number;
  subscriptionTier: string;
  mt5Accounts: {
    id: string;
    accountId: string;
    package: string;
  }[];
  onSuccess?: () => void;
}

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

export default function RedeemCoinsModal({
  visible,
  onClose,
  currentBalance,
  subscriptionTier,
  onSuccess,
}: RedeemModalProps) {
  const [coinsToRedeem, setCoinsToRedeem] = useState("");
  const [zuperiorAccountNumber, setZuperiorAccountNumber] = useState("");
  const [estimatedAmount, setEstimatedAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState<{ label: string; value: string }[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setItems([]);
  }, [visible]);

  const {
    conversionRate,
    isLoading,
    error,
    calculateConversion,
    createRedeemRequest,
    clearError,
  } = useRedeemStore();

  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      clearError();
    }
  }, [error]);

  const handleCalculateConversion = async (coins: string) => {
    setCoinsToRedeem(coins);
    const numCoins = parseFloat(coins);
    if (numCoins && numCoins > 0 && conversionRate) {
      try {
        const result = await calculateConversion(numCoins);
        setEstimatedAmount(result.amountInDollars);
      } catch {
        setEstimatedAmount(0);
      }
    } else {
      setEstimatedAmount(0);
    }
  };

  const handleSubmit = async () => {
    const numCoins = parseFloat(coinsToRedeem);
    if (!numCoins || numCoins <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid number of coins");
      return;
    }
    if (numCoins > currentBalance) {
      Alert.alert(
        "Insufficient Balance",
        `You only have ${currentBalance} coins`,
      );
      return;
    }
    if (!zuperiorAccountNumber.trim()) {
      Alert.alert("Required", "Please enter your Zuperior Account Number");
      return;
    }

    try {
      await createRedeemRequest(numCoins, zuperiorAccountNumber.trim());

      // Close this modal first
      onClose();

      // Call onSuccess to show the success modal
      onSuccess?.();
    } catch (err: any) {
      // error already shown via useEffect
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setCoinsToRedeem("");
      setZuperiorAccountNumber("");
      setEstimatedAmount(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-white rounded-2xl w-full max-w-md p-6">
          <Text className="text-2xl font-bold text-center mb-5 text-[#730A96]">
            Redeem Coins
          </Text>

          <View className="mb-5 space-y-2">
            <Text className="text-sm text-gray-700">
              Subscription:{" "}
              <Text className="font-bold">
                {getSubscriptionTierLabel(subscriptionTier)}
              </Text>
            </Text>
            {conversionRate && (
              <Text className="text-sm text-gray-700">
                Rate:{" "}
                <Text className="font-bold">
                  {conversionRate.coinsPerDollar} coins = $1.00
                </Text>
              </Text>
            )}
            <Text className="text-sm text-gray-700">
              Available:{" "}
              <Text className="font-bold text-green-600">
                {currentBalance.toLocaleString()} coins
              </Text>
            </Text>
          </View>

          <TextInput
            className="border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="Enter coins to redeem"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={coinsToRedeem}
            onChangeText={handleCalculateConversion}
          />

          {/* <TextInput
            className="border border-gray-300 rounded-xl px-4 py-4 mb-4 text-base"
            placeholder="Zuperior Account Number (required)"
            value={zuperiorAccountNumber}
            onChangeText={setZuperiorAccountNumber}
            placeholderTextColor="#9CA3AF"
            autoCapitalize="characters"
          /> */}

          <View style={{ zIndex: 3000 }}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={(val) => {
                const selected = val();
                setValue(selected);
                setZuperiorAccountNumber(selected as string);
              }}
              setItems={setItems}
              placeholder="Select Zuperior Account"
              placeholderStyle={{
                color: "#9CA3AF",
              }}
              loading={loadingAccounts}
              style={{
                borderColor: "#D1D5DB",
                borderRadius: 12,
                paddingVertical: 14,
              }}
              dropDownContainerStyle={{
                borderColor: "#D1D5DB",
                maxHeight: 200,
              }}
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          {estimatedAmount > 0 && (
            <View className="bg-green-50 border border-green-200 p-4 rounded-xl mb-5">
              <Text className="text-center text-lg font-bold text-green-700">
                Estimated: ${estimatedAmount.toFixed(2)}
              </Text>
            </View>
          )}

          <View className="flex-row gap-3 mt-5">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-gray-200 py-4 rounded-xl"
            >
              <Text className="text-center font-bold text-gray-700">
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                isLoading || !coinsToRedeem || !zuperiorAccountNumber.trim()
              }
              className={`flex-1 py-4 rounded-xl ${
                isLoading || !coinsToRedeem || !zuperiorAccountNumber.trim()
                  ? "bg-gray-400"
                  : "bg-[#730A96]"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-bold">
                  Submit Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

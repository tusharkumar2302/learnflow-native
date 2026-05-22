import Header from "@/components/common/Header";
import { Ionicons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const notifications = [
  {
    id: "1",
    title: "Congratz, you have completed...",
    description:
      "Congratz, you have completed the Pass the quiz. Earn coins. Use them in the Zuper Funding Challenge.",
  },
  {
    id: "2",
    title: "Congratz, you have completed...",
    description:
      "Congratz, you have completed the Pass the quiz. Earn coins. Use them in the Zuper Funding Challenge.",
  },
  {
    id: "3",
    title: "Congratz, you have completed...",
    description:
      "Congratz, you have completed the Pass the quiz. Earn coins. Use them in the Zuper Funding Challenge.",
  },
  {
    id: "4",
    title: "Congratz, you have completed...",
    description:
      "Congratz, you have completed the Pass the quiz. Earn coins. Use them in the Zuper Funding Challenge.",
  },
  {
    id: "5",
    title: "Congratz, you have completed...",
    description:
      "Congratz, you have completed the Pass the quiz. Earn coins. Use them in the Zuper Funding Challenge.",
  },
];

export default function NotificationScreen() {
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");

  const router = useRouter();
  return (
    <View className="flex-1 bg-[#EBE9FB] ">
      {/* Header */}
      <Header
        left={
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="p-2 bg-[#FFFFFF59] rounded-full  h-12 w-12 items-center justify-center"
          >
            <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
          </TouchableOpacity>
        }
        center={<></>}
        right={
          <TouchableOpacity
            onPress={() => {}}
            className="p-2 bg-[#FFFFFF59] rounded-full "
          >
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        }
      />
      <View className="px-4 pt-4">
        <View
          className="self-center"
          style={{
            width: screenWidth * 0.875,
          }}
        >
          <Text className="text-[26px]  text-black mb-4 font-teachers-medium">
            Notifications
          </Text>
        </View>

        {/* Notification List */}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View
              className="border-[1px] border-[#0000001A] bg-[#FFFFFF33] rounded-[20px] px-4 py-3 mb-4 self-center"
              style={{
                width: screenWidth * 0.875,
              }}
            >
              <Text className="text-[18px] font-teachers-medium text-black mb-1">
                {item.title}
              </Text>
              <Text
                className="text-[14px] text-[#00000073] font-helveticaNeue  "
                style={{ lineHeight: 18 }}
              >
                {item.description}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

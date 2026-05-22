import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const QuizHeader = ({
  score,
  totalScore,
  onBack,
  title,
}: {
  score: number;
  onBack: () => void;
  totalScore: number;
  title: string;
}) => (
  <View style={styles.header}>
    <View style={styles.QuizTxt}>
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <Text className="font-poppins-medium text-[26px]">{title} Quiz</Text>
    </View>
    {/*
    <View style={styles.coins}>
      <Image
        style={styles.coinsImg}
        source={require("@/assets/icons/Coins/coin.png")}
      />
      <Text className="font-helvetica-bold text-[14px] text-[#00000059] ">
        {score} <Text className="text-[#730A96]">/{totalScore}</Text>
      </Text>
    </View>*/}
  </View>
);

export default QuizHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  coins: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  coinsImg: {
    height: 24,
    width: 24,
  },
  backBtn: {
    backgroundColor: "#FFFFFF59",
    padding: 6,
    borderRadius: 24,
    height: 46,
    width: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  QuizTxt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  span: {
    color: "#730A96",
    fontWeight: "700",
    fontSize: 14,
    fontFamily: "HelveticaNeue-Bold",
  },
});

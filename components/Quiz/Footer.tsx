import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type QuizFooterProps = {
  onSkip?: () => void;
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
  backLabel?: string;
  nextLabel?: string;
};

const QuizFooter = ({
  onNext,
  onBack,
  nextDisabled,
  backLabel = "Back",
  nextLabel = "Next",
}: QuizFooterProps) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.skipButton} onPress={onBack}>
        <Text style={styles.skipText}>{backLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={nextDisabled}
        className={
          nextDisabled
            ? "opacity-50 bg-[#563FA5] py-[12px] px-[24px] rounded-[13px] w-[48%] items-center"
            : "bg-[#563FA5] py-[12px] px-[24px] rounded-[13px] w-[48%] items-center"
        }
        onPress={onNext}
      >
        <Text style={styles.nextText}>{nextLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default QuizFooter;

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: 30,
  },
  skipButton: {
    backgroundColor: "",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 13,
    width: "48%",
    alignItems: "center",
    borderColor: "#00000026",
    borderWidth: 1,
  },
  skipText: {
    color: "#555",
    fontWeight: "500",
    fontSize: 17,
    fontFamily: "Teachers-Medium",
  },

  nextText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 17,
    fontFamily: "Teachers-Medium",
  },
});

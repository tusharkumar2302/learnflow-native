import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const QuizQuestion = ({
  question,
  number,
  total,
}: {
  question: string;
  number: number;
  total: number;
}) => (
  <View style={styles.questionContainer}>
    <View style={styles.number}>
      <Text style={styles.questionNumber}>Question: {number}</Text>

      <View style={styles.circularContainer}>
        <AnimatedCircularProgress
          size={50}
          width={3}
          fill={(number / total) * 100}
          tintColor="#730A96"
          backgroundColor="#E0E0E0"
        />
        <View style={styles.progressTextContainer}>
          <Text style={styles.progressText}>
            {number}/{total}
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.quesText}>
      <Text style={styles.questionText}>{question}</Text>
    </View>
  </View>
);

export default QuizQuestion;

const styles = StyleSheet.create({
  questionContainer: { marginBottom: 20 },
  questionNumber: {
    color: "#730A96",
    fontWeight: "500",
    marginBottom: 6,
    fontFamily: "Poppins-Medium",
    fontSize: 15,
  },
  questionText: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 0,
    color: "#000000",
    fontFamily: "Poppins-Medium",
  },
  circularContainer: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  progressTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    color: "#000000",
    fontWeight: "500",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  number: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  quesText: {
    backgroundColor: "#F3F3F3",
    padding: 12,
    borderRadius: 12,
  },
});

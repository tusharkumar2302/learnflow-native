import { ChapterQuiz, QuizQuestion } from "@/services/interfaces/ICourseService";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, CheckmarkCircle01Icon, CancelCircleIcon } from "@hugeicons/core-free-icons";

type Props = {
  quiz: ChapterQuiz;
  visible: boolean;
  onPass: () => void;
  onDismiss: () => void;
};

type AnswerMap = Record<string, string>; // questionId → selectedOptionId

function QuestionCard({
  question,
  index,
  answer,
  onSelect,
  showResult,
}: {
  question: QuizQuestion;
  index: number;
  answer: string | undefined;
  onSelect: (optionId: string) => void;
  showResult: boolean;
}) {
  return (
    <View style={qs.questionWrap}>
      <Text style={qs.questionNum}>Q{index + 1}</Text>
      <Text style={qs.questionText}>{question.text}</Text>
      <View style={qs.options}>
        {question.options.map((option) => {
          const selected = answer === option.id;
          const correct = option.isCorrect;
          let bg = "#FAFAF9";
          let border = "rgba(0,0,0,0.08)";
          let textColor = "#0D0D0D";

          if (showResult) {
            if (correct) { bg = "#ECFDF5"; border = "#059669"; textColor = "#065F46"; }
            else if (selected && !correct) { bg = "#FEF2F2"; border = "#DC2626"; textColor = "#991B1B"; }
          } else if (selected) {
            bg = "#F0EBFF"; border = "#7C3AED"; textColor = "#4C1D95";
          }

          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => !showResult && onSelect(option.id)}
              activeOpacity={showResult ? 1 : 0.75}
              style={[qs.option, { backgroundColor: bg, borderColor: border }]}
            >
              <Text style={[qs.optionText, { color: textColor }]}>{option.text}</Text>
              {showResult && correct && (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} color="#059669" strokeWidth={2} />
              )}
              {showResult && selected && !correct && (
                <HugeiconsIcon icon={CancelCircleIcon} size={16} color="#DC2626" strokeWidth={2} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function QuizSheet({ quiz, visible, onPass, onDismiss }: Props) {
  const insets = useSafeAreaInsets();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  const handleSubmit = () => {
    let correct = 0;
    quiz.questions.forEach((q) => {
      const selected = answers[q.id];
      const correctOption = q.options.find((o) => o.isCorrect);
      if (selected && correctOption && selected === correctOption.id) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const passed = submitted && score >= Math.ceil(quiz.questions.length * 0.6);

  const handleContinue = () => {
    if (passed) {
      onPass();
    } else {
      // Reset for retry
      setAnswers({});
      setSubmitted(false);
      setScore(0);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onDismiss}>
      <View style={[s.container, { paddingBottom: insets.bottom + 16 }]}>
        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.headerTitle}>{quiz.title}</Text>
            <Text style={s.headerSub}>{quiz.questions.length} questions · {quiz.coinValue} coins</Text>
          </View>
          <TouchableOpacity onPress={onDismiss} style={s.closeBtn} activeOpacity={0.7}>
            <HugeiconsIcon icon={Cancel01Icon} size={20} color="rgba(0,0,0,0.50)" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {submitted ? (
          /* ── Result Screen ── */
          <View style={s.result}>
            <View style={[s.scoreCircle, passed ? s.scorePass : s.scoreFail]}>
              <Text style={s.scoreNum}>{score}/{quiz.questions.length}</Text>
              <Text style={s.scoreLabel}>{passed ? "Passed!" : "Try again"}</Text>
            </View>
            <Text style={s.resultHeadline}>
              {passed
                ? `Great work! You earned ${quiz.coinValue} coins.`
                : `You need ${Math.ceil(quiz.questions.length * 0.6)}/${quiz.questions.length} to pass.`}
            </Text>
            <TouchableOpacity
              onPress={handleContinue}
              style={[s.ctaBtn, passed ? s.ctaPass : s.ctaRetry]}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>{passed ? "Continue learning →" : "Try again"}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Questions ── */
          <>
            <ScrollView
              style={s.scroll}
              contentContainerStyle={s.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {quiz.questions.map((q, i) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={i}
                  answer={answers[q.id]}
                  onSelect={(optId) => setAnswers((prev) => ({ ...prev, [q.id]: optId }))}
                  showResult={false}
                />
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={!allAnswered}
              style={[s.ctaBtn, !allAnswered && s.ctaDisabled]}
              activeOpacity={0.85}
            >
              <Text style={s.ctaBtnText}>Submit answers</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: "Teachers-Bold",
    fontSize: 20,
    color: "#0D0D0D",
  },
  headerSub: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "rgba(0,0,0,0.42)",
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 16, gap: 12 },
  ctaBtn: {
    backgroundColor: "#7C3AED",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  ctaPass: { backgroundColor: "#7C3AED" },
  ctaRetry: { backgroundColor: "#1D4ED8" },
  ctaDisabled: { backgroundColor: "rgba(124,58,237,0.35)" },
  ctaBtnText: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 15,
    color: "#FFFFFF",
  },
  result: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    paddingHorizontal: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  scorePass: { backgroundColor: "#ECFDF5", borderWidth: 3, borderColor: "#059669" },
  scoreFail: { backgroundColor: "#FEF2F2", borderWidth: 3, borderColor: "#DC2626" },
  scoreNum: {
    fontFamily: "Teachers-Bold",
    fontSize: 32,
    color: "#0D0D0D",
  },
  scoreLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 13,
    color: "rgba(0,0,0,0.55)",
  },
  resultHeadline: {
    fontFamily: "Poppins-Regular",
    fontSize: 15,
    color: "#0D0D0D",
    textAlign: "center",
    lineHeight: 22,
  },
});

const qs = StyleSheet.create({
  questionWrap: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  questionNum: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 10,
    color: "#7C3AED",
    letterSpacing: 1,
  },
  questionText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#0D0D0D",
    lineHeight: 20,
  },
  options: { gap: 8 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  optionText: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    lineHeight: 18,
  },
});

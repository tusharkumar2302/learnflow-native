import { Quiz } from "@/types/Course";
import { create } from "zustand";

type PendingQuiz = {
  quiz: Quiz;
  coinValue: number;
  quizId: string;
};

type Para = {
  correct: number;
  total: number;
  pendingQuiz: PendingQuiz | null;
  setCorrect: () => void;
  setTotal: (total: number) => void;
  reset: () => void;
  setPendingQuiz: (data: PendingQuiz | null) => void;
};

const quizStore = create<Para>((set) => ({
  correct: 0,
  total: 0,
  pendingQuiz: null,
  setCorrect: () => set((state) => ({ correct: state.correct + 1 })),
  setTotal: (totalQues) => set({ total: totalQues }),
  reset: () => set({ correct: 0, total: 0 }),
  setPendingQuiz: (data) => set({ pendingQuiz: data }),
}));

export default quizStore;

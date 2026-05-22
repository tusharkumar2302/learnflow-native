import { create } from "zustand";

type Para = {
  correct: number;
  total: number;
  setCorrect: () => void;
  setTotal: (total: number) => void;
  reset: () => void;
};

const quizStore = create<Para>((set) => ({
  correct: 0,
  total: 0,
  setCorrect: () => set((state) => ({ correct: state.correct + 1 })),
  setTotal: (totalQues) => set({ total: totalQues }),
  reset: () => set({ correct: 0, total: 0 }),
}));

export default quizStore;

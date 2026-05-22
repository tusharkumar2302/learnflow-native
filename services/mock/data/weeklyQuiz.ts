import { LeaderboardEntry, WeeklyQuizSummary } from "@/services/interfaces/IQuizService";

export const mockWeeklyQuiz: WeeklyQuizSummary = {
  id: "wq-2026-w21",
  title: "Weekly Challenge: DeFi Fundamentals",
  description: "Test your understanding of decentralized finance concepts covered this week.",
  coinReward: 200,
  passingScore: 70,
  totalQuestions: 5,
  startDate: "2026-05-18T00:00:00Z",
  endDate: "2026-05-25T23:59:59Z",
  hasSubmitted: false,
  questions: [
    {
      id: "wq-q1",
      text: "What does AMM stand for in DeFi?",
      order: 1,
      points: 20,
      options: [
        { id: "wq-q1-a", text: "Automated Market Maker", isCorrect: true },
        { id: "wq-q1-b", text: "Asset Management Module", isCorrect: false },
        { id: "wq-q1-c", text: "Advanced Mining Mechanism", isCorrect: false },
        { id: "wq-q1-d", text: "Algorithmic Money Market", isCorrect: false },
      ],
    },
    {
      id: "wq-q2",
      text: "In a liquidity pool, what are LP tokens used for?",
      order: 2,
      points: 20,
      options: [
        { id: "wq-q2-a", text: "To represent a provider's share of the pool", isCorrect: true },
        { id: "wq-q2-b", text: "To pay transaction fees", isCorrect: false },
        { id: "wq-q2-c", text: "To vote on governance proposals only", isCorrect: false },
        { id: "wq-q2-d", text: "To mint new tokens", isCorrect: false },
      ],
    },
    {
      id: "wq-q3",
      text: "Which protocol pioneered the concept of over-collateralized lending in DeFi?",
      order: 3,
      points: 20,
      options: [
        { id: "wq-q3-a", text: "Aave", isCorrect: false },
        { id: "wq-q3-b", text: "MakerDAO", isCorrect: true },
        { id: "wq-q3-c", text: "Compound", isCorrect: false },
        { id: "wq-q3-d", text: "Uniswap", isCorrect: false },
      ],
    },
    {
      id: "wq-q4",
      text: "What is impermanent loss?",
      order: 4,
      points: 20,
      options: [
        { id: "wq-q4-a", text: "A permanent loss from a smart contract exploit", isCorrect: false },
        { id: "wq-q4-b", text: "The opportunity cost of holding assets in a liquidity pool vs. holding them", isCorrect: true },
        { id: "wq-q4-c", text: "Gas fees paid on failed transactions", isCorrect: false },
        { id: "wq-q4-d", text: "Loss from using a CEX during downtime", isCorrect: false },
      ],
    },
    {
      id: "wq-q5",
      text: "What is the main risk of yield farming?",
      order: 5,
      points: 20,
      options: [
        { id: "wq-q5-a", text: "Your bank blocking the transaction", isCorrect: false },
        { id: "wq-q5-b", text: "Smart contract vulnerabilities and protocol risk", isCorrect: true },
        { id: "wq-q5-c", text: "Earning too many rewards", isCorrect: false },
        { id: "wq-q5-d", text: "Stablecoin depegging only", isCorrect: false },
      ],
    },
  ],
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "u-101", name: "Jordan K.", score: 100, percentageScore: 100, submittedAt: "2026-05-18T08:12:00Z" },
  { rank: 2, userId: "u-102", name: "Sam W.", score: 100, percentageScore: 100, submittedAt: "2026-05-18T09:44:00Z" },
  { rank: 3, userId: "u-103", name: "Mei L.", score: 80, percentageScore: 80, submittedAt: "2026-05-18T11:03:00Z" },
  { rank: 4, userId: "u-104", name: "Ravi P.", score: 80, percentageScore: 80, submittedAt: "2026-05-19T07:55:00Z" },
  { rank: 5, userId: "u-105", name: "Sofia M.", score: 80, percentageScore: 80, submittedAt: "2026-05-19T14:20:00Z" },
  { rank: 6, userId: "u-106", name: "Dylan R.", score: 60, percentageScore: 60, submittedAt: "2026-05-20T10:33:00Z" },
  { rank: 7, userId: "user-demo-001", name: "Alex Rivera", score: 0, percentageScore: 0, submittedAt: "" },
  { rank: 8, userId: "u-108", name: "Chen H.", score: 60, percentageScore: 60, submittedAt: "2026-05-20T16:48:00Z" },
  { rank: 9, userId: "u-109", name: "Aisha N.", score: 40, percentageScore: 40, submittedAt: "2026-05-21T08:22:00Z" },
  { rank: 10, userId: "u-110", name: "Lucas B.", score: 40, percentageScore: 40, submittedAt: "2026-05-21T12:05:00Z" },
];

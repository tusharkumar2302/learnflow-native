import { LeaderboardEntry, WeeklyQuizSummary } from "@/services/interfaces/IQuizService";

export const mockWeeklyQuiz: WeeklyQuizSummary = {
  id: "wq-2026-w21",
  title: "Weekly Challenge: Financial Ratios",
  description: "Test your understanding of the ratios that drive smarter investment decisions.",
  coinReward: 200,
  passingScore: 70,
  totalQuestions: 5,
  startDate: "2026-05-18T00:00:00Z",
  endDate: "2026-05-25T23:59:59Z",
  hasSubmitted: false,
  questions: [
    {
      id: "wq-q1",
      text: "A stock is priced at ₹500 and earns ₹25 per share annually. What is its P/E ratio?",
      order: 1,
      points: 20,
      options: [
        { id: "wq-q1-a", text: "20", isCorrect: true },
        { id: "wq-q1-b", text: "25", isCorrect: false },
        { id: "wq-q1-c", text: "2", isCorrect: false },
        { id: "wq-q1-d", text: "50", isCorrect: false },
      ],
    },
    {
      id: "wq-q2",
      text: "You buy a stock at ₹500 and set a stop-loss at ₹450. What happens when the price hits ₹450?",
      order: 2,
      points: 20,
      options: [
        { id: "wq-q2-a", text: "The stock is automatically sold to limit your loss", isCorrect: true },
        { id: "wq-q2-b", text: "You receive a profit of ₹450", isCorrect: false },
        { id: "wq-q2-c", text: "Your broker calls you for a margin top-up", isCorrect: false },
        { id: "wq-q2-d", text: "The trade is paused until the market recovers", isCorrect: false },
      ],
    },
    {
      id: "wq-q3",
      text: "An RSI reading of 75 generally indicates that a stock is...",
      order: 3,
      points: 20,
      options: [
        { id: "wq-q3-a", text: "Undervalued and a good buy", isCorrect: false },
        { id: "wq-q3-b", text: "Overbought and may be due for a correction", isCorrect: true },
        { id: "wq-q3-c", text: "Moving in line with the index", isCorrect: false },
        { id: "wq-q3-d", text: "Paying an unusually high dividend", isCorrect: false },
      ],
    },
    {
      id: "wq-q4",
      text: "What is the primary advantage of investing via SIP over a lumpsum?",
      order: 4,
      points: 20,
      options: [
        { id: "wq-q4-a", text: "Higher guaranteed annual returns", isCorrect: false },
        { id: "wq-q4-b", text: "Full exemption from long-term capital gains tax", isCorrect: false },
        { id: "wq-q4-c", text: "Rupee cost averaging across market cycles", isCorrect: true },
        { id: "wq-q4-d", text: "No lock-in period on any mutual fund", isCorrect: false },
      ],
    },
    {
      id: "wq-q5",
      text: "A company has a Debt-to-Equity (D/E) ratio of 3.5. What does this signal to an investor?",
      order: 5,
      points: 20,
      options: [
        { id: "wq-q5-a", text: "The company is highly profitable", isCorrect: false },
        { id: "wq-q5-b", text: "The company is debt-heavy relative to shareholder equity — higher financial risk", isCorrect: true },
        { id: "wq-q5-c", text: "The stock is undervalued at current prices", isCorrect: false },
        { id: "wq-q5-d", text: "The company has paid 3.5x dividends this year", isCorrect: false },
      ],
    },
  ],
};

export const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: "u-101", name: "Kavya R.", score: 100, percentageScore: 100, submittedAt: "2026-05-18T08:12:00Z" },
  { rank: 2, userId: "u-102", name: "Siddharth M.", score: 100, percentageScore: 100, submittedAt: "2026-05-18T09:44:00Z" },
  { rank: 3, userId: "u-103", name: "Meera J.", score: 80, percentageScore: 80, submittedAt: "2026-05-18T11:03:00Z" },
  { rank: 4, userId: "u-104", name: "Rahul K.", score: 80, percentageScore: 80, submittedAt: "2026-05-19T07:55:00Z" },
  { rank: 5, userId: "u-105", name: "Neha S.", score: 80, percentageScore: 80, submittedAt: "2026-05-19T14:20:00Z" },
  { rank: 6, userId: "u-106", name: "Aditya V.", score: 60, percentageScore: 60, submittedAt: "2026-05-20T10:33:00Z" },
  { rank: 7, userId: "user-demo-001", name: "Arjun Sharma", score: 0, percentageScore: 0, submittedAt: "" },
  { rank: 8, userId: "u-108", name: "Ishaan T.", score: 60, percentageScore: 60, submittedAt: "2026-05-20T16:48:00Z" },
  { rank: 9, userId: "u-109", name: "Ananya B.", score: 40, percentageScore: 40, submittedAt: "2026-05-21T08:22:00Z" },
  { rank: 10, userId: "u-110", name: "Karan L.", score: 40, percentageScore: 40, submittedAt: "2026-05-21T12:05:00Z" },
];

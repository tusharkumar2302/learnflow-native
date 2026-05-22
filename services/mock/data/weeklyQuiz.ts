import { LeaderboardEntry, WeeklyQuizSummary } from "@/services/interfaces/IQuizService";

export const mockWeeklyQuiz: WeeklyQuizSummary = {
  id: "wq-2026-w21",
  title: "Weekly Challenge: AI in the Workplace",
  description: "Test your understanding of AI tools covered this week.",
  coinReward: 200,
  passingScore: 70,
  totalQuestions: 5,
  startDate: "2026-05-18T00:00:00Z",
  endDate: "2026-05-25T23:59:59Z",
  hasSubmitted: false,
  questions: [
    {
      id: "wq-q1",
      text: "Which prompt technique involves giving ChatGPT an example before asking it to do a task?",
      order: 1,
      points: 20,
      options: [
        { id: "wq-q1-a", text: "Few-shot prompting", isCorrect: true },
        { id: "wq-q1-b", text: "Zero-shot prompting", isCorrect: false },
        { id: "wq-q1-c", text: "Chain-of-thought only", isCorrect: false },
        { id: "wq-q1-d", text: "Negative prompting", isCorrect: false },
      ],
    },
    {
      id: "wq-q2",
      text: "Which of these is the best use of AI tools for a working professional?",
      order: 2,
      points: 20,
      options: [
        { id: "wq-q2-a", text: "Replacing all human writing and decision-making", isCorrect: false },
        { id: "wq-q2-b", text: "Drafting first versions, summarising, and automating repetitive tasks", isCorrect: true },
        { id: "wq-q2-c", text: "Only coding and technical tasks", isCorrect: false },
        { id: "wq-q2-d", text: "Avoiding AI to keep skills sharp", isCorrect: false },
      ],
    },
    {
      id: "wq-q3",
      text: "What does 'hallucination' mean in the context of AI tools like ChatGPT?",
      order: 3,
      points: 20,
      options: [
        { id: "wq-q3-a", text: "The AI becomes creative and adds images", isCorrect: false },
        { id: "wq-q3-b", text: "The AI confidently generates false or made-up information", isCorrect: true },
        { id: "wq-q3-c", text: "The AI crashes and restarts", isCorrect: false },
        { id: "wq-q3-d", text: "The AI asks too many clarifying questions", isCorrect: false },
      ],
    },
    {
      id: "wq-q4",
      text: "Which Indian-origin tool is widely used by professionals to search and summarise the web with AI?",
      order: 4,
      points: 20,
      options: [
        { id: "wq-q4-a", text: "Notion AI", isCorrect: false },
        { id: "wq-q4-b", text: "Perplexity AI", isCorrect: true },
        { id: "wq-q4-c", text: "Jasper", isCorrect: false },
        { id: "wq-q4-d", text: "Midjourney", isCorrect: false },
      ],
    },
    {
      id: "wq-q5",
      text: "What is the most effective way to improve AI output quality?",
      order: 5,
      points: 20,
      options: [
        { id: "wq-q5-a", text: "Use longer and more detailed prompts always", isCorrect: false },
        { id: "wq-q5-b", text: "Provide context, define your role, and specify the output format", isCorrect: true },
        { id: "wq-q5-c", text: "Regenerate until you get the right answer", isCorrect: false },
        { id: "wq-q5-d", text: "Use only English regardless of context", isCorrect: false },
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

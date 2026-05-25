import { ChapterQuiz } from "@/services/interfaces/ICourseService";
import { LearningPath, Lesson } from "@/services/interfaces/ILearnService";

const VIDEO_URL = "https://test-streams.mux.dev/x36xhzz/video/hlsnone/playlist.m3u8";

// ─── Quizzes ──────────────────────────────────────────────────────────────────

const lessonQuizzes: Record<string, ChapterQuiz> = {
  "ls-mkt-001": {
    id: "lq-mkt-001", title: "Market Basics Check", coinValue: 50, isPassed: false,
    questions: [
      { id: "q1", text: "What does BSE stand for?", options: [
        { id: "a", text: "Bombay Stock Exchange", isCorrect: true },
        { id: "b", text: "Business Stock Exchange", isCorrect: false },
        { id: "c", text: "Bengal Stock Exchange", isCorrect: false },
        { id: "d", text: "Bharat Stock Exchange", isCorrect: false },
      ]},
      { id: "q2", text: "Which index tracks the top 50 companies on NSE?", options: [
        { id: "a", text: "Sensex", isCorrect: false },
        { id: "b", text: "Nifty 50", isCorrect: true },
        { id: "c", text: "Nifty Bank", isCorrect: false },
        { id: "d", text: "BSE 500", isCorrect: false },
      ]},
      { id: "q3", text: "SEBI's primary role is to:", options: [
        { id: "a", text: "Set interest rates", isCorrect: false },
        { id: "b", text: "Regulate and protect investors in the securities market", isCorrect: true },
        { id: "c", text: "Print currency notes", isCorrect: false },
        { id: "d", text: "Manage government debt", isCorrect: false },
      ]},
    ],
  },
  "ls-mkt-002": {
    id: "lq-mkt-002", title: "How Trading Works", coinValue: 50, isPassed: false,
    questions: [
      { id: "q1", text: "What is a market order?", options: [
        { id: "a", text: "An order that executes only at your specified price", isCorrect: false },
        { id: "b", text: "An order that executes immediately at the best available price", isCorrect: true },
        { id: "c", text: "An order that expires at the end of the month", isCorrect: false },
        { id: "d", text: "An order placed by a broker on your behalf", isCorrect: false },
      ]},
      { id: "q2", text: "What is the settlement period for equity trades in India?", options: [
        { id: "a", text: "Same day (T+0)", isCorrect: false },
        { id: "b", text: "T+1 (next trading day)", isCorrect: true },
        { id: "c", text: "T+3 (three trading days)", isCorrect: false },
        { id: "d", text: "T+5 (five trading days)", isCorrect: false },
      ]},
      { id: "q3", text: "Upper circuit on a stock means:", options: [
        { id: "a", text: "The stock is about to be delisted", isCorrect: false },
        { id: "b", text: "Trading is halted indefinitely", isCorrect: false },
        { id: "c", text: "The stock has hit its maximum allowed price rise for the day", isCorrect: true },
        { id: "d", text: "The stock split has been announced", isCorrect: false },
      ]},
    ],
  },
  "ls-mkt-003": {
    id: "lq-mkt-003", title: "Market Participants", coinValue: 50, isPassed: false,
    questions: [
      { id: "q1", text: "FIIs stand for:", options: [
        { id: "a", text: "Fixed Income Investments", isCorrect: false },
        { id: "b", text: "Foreign Institutional Investors", isCorrect: true },
        { id: "c", text: "Financial Interest Intermediaries", isCorrect: false },
        { id: "d", text: "Federal Investment Institutions", isCorrect: false },
      ]},
      { id: "q2", text: "Retail investors in India are typically defined as those investing up to:", options: [
        { id: "a", text: "₹10,000", isCorrect: false },
        { id: "b", text: "₹1 lakh", isCorrect: false },
        { id: "c", text: "₹2 lakh in an IPO", isCorrect: true },
        { id: "d", text: "₹50 lakh", isCorrect: false },
      ]},
      { id: "q3", text: "DII stands for:", options: [
        { id: "a", text: "Domestic Institutional Investors", isCorrect: true },
        { id: "b", text: "Direct Index Instruments", isCorrect: false },
        { id: "c", text: "Daily Institutional Investments", isCorrect: false },
        { id: "d", text: "Debt Interest Indicators", isCorrect: false },
      ]},
    ],
  },
  "ls-mkt-004": {
    id: "lq-mkt-004", title: "Reading a Stock Quote", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "52-week high on a stock page indicates:", options: [
        { id: "a", text: "The stock's average price over one year", isCorrect: false },
        { id: "b", text: "The highest price the stock traded at in the past 52 weeks", isCorrect: true },
        { id: "c", text: "The price target set by analysts", isCorrect: false },
        { id: "d", text: "The IPO issue price", isCorrect: false },
      ]},
      { id: "q2", text: "P/E ratio of 25 means investors are paying ₹25 for every ₹1 of:", options: [
        { id: "a", text: "Revenue", isCorrect: false },
        { id: "b", text: "Dividends", isCorrect: false },
        { id: "c", text: "Earnings (profit)", isCorrect: true },
        { id: "d", text: "Book value", isCorrect: false },
      ]},
      { id: "q3", text: "Volume in a stock quote represents:", options: [
        { id: "a", text: "Total market cap divided by float", isCorrect: false },
        { id: "b", text: "Number of shares traded during the session", isCorrect: true },
        { id: "c", text: "Number of buyers minus sellers", isCorrect: false },
        { id: "d", text: "Total value of trades in rupees", isCorrect: false },
      ]},
    ],
  },
  "ls-mkt-005": {
    id: "lq-mkt-005", title: "Demat & Trading Account", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "A Demat account holds your shares in:", options: [
        { id: "a", text: "Physical certificate form", isCorrect: false },
        { id: "b", text: "Electronic form", isCorrect: true },
        { id: "c", text: "A bank locker", isCorrect: false },
        { id: "d", text: "The broker's name", isCorrect: false },
      ]},
      { id: "q2", text: "CDSL and NSDL are India's:", options: [
        { id: "a", text: "Stock exchanges", isCorrect: false },
        { id: "b", text: "Market regulators", isCorrect: false },
        { id: "c", text: "Depositories for holding Demat accounts", isCorrect: true },
        { id: "d", text: "Clearing corporations", isCorrect: false },
      ]},
      { id: "q3", text: "To trade in F&O (Futures & Options), you need:", options: [
        { id: "a", text: "Only a savings account", isCorrect: false },
        { id: "b", text: "A Demat + Trading account and SEBI F&O approval", isCorrect: true },
        { id: "c", text: "A credit card with ₹1 lakh limit", isCorrect: false },
        { id: "d", text: "An NRI account", isCorrect: false },
      ]},
    ],
  },
  "ls-candle-001": {
    id: "lq-candle-001", title: "Candlestick Basics", coinValue: 50, isPassed: false,
    questions: [
      { id: "q1", text: "A bullish candle has:", options: [
        { id: "a", text: "Close below open", isCorrect: false },
        { id: "b", text: "Close above open", isCorrect: true },
        { id: "c", text: "No body", isCorrect: false },
        { id: "d", text: "Only upper wicks", isCorrect: false },
      ]},
      { id: "q2", text: "The 'wick' (shadow) of a candle represents:", options: [
        { id: "a", text: "The opening and closing price", isCorrect: false },
        { id: "b", text: "The intraday high or low beyond the body", isCorrect: true },
        { id: "c", text: "The volume traded", isCorrect: false },
        { id: "d", text: "The previous day's close", isCorrect: false },
      ]},
      { id: "q3", text: "A Doji candle indicates:", options: [
        { id: "a", text: "Strong buying pressure", isCorrect: false },
        { id: "b", text: "Market indecision — open and close are nearly equal", isCorrect: true },
        { id: "c", text: "Guaranteed reversal", isCorrect: false },
        { id: "d", text: "Circuit breaker trigger", isCorrect: false },
      ]},
    ],
  },
  "ls-candle-002": {
    id: "lq-candle-002", title: "Reversal Patterns", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "A Hammer candle at the bottom of a downtrend suggests:", options: [
        { id: "a", text: "Continued selling", isCorrect: false },
        { id: "b", text: "Potential bullish reversal", isCorrect: true },
        { id: "c", text: "Market pause before more downside", isCorrect: false },
        { id: "d", text: "Volume spike incoming", isCorrect: false },
      ]},
      { id: "q2", text: "Bullish Engulfing pattern requires:", options: [
        { id: "a", text: "First candle green, second candle red that engulfs the first", isCorrect: false },
        { id: "b", text: "First candle red, second candle green that completely engulfs the first", isCorrect: true },
        { id: "c", text: "Two consecutive green candles of equal size", isCorrect: false },
        { id: "d", text: "A gap up followed by a gap down", isCorrect: false },
      ]},
      { id: "q3", text: "Shooting Star pattern is bearish when it appears:", options: [
        { id: "a", text: "At the bottom of a downtrend", isCorrect: false },
        { id: "b", text: "At the top of an uptrend", isCorrect: true },
        { id: "c", text: "During sideways consolidation", isCorrect: false },
        { id: "d", text: "On low volume days", isCorrect: false },
      ]},
    ],
  },
  "ls-candle-003": {
    id: "lq-candle-003", title: "Continuation Patterns", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "A Three White Soldiers pattern consists of:", options: [
        { id: "a", text: "Three consecutive red candles", isCorrect: false },
        { id: "b", text: "Three consecutive green candles with higher closes", isCorrect: true },
        { id: "c", text: "Three Doji candles in a row", isCorrect: false },
        { id: "d", text: "One large candle and two small ones", isCorrect: false },
      ]},
      { id: "q2", text: "A Rising Three Methods pattern is a:", options: [
        { id: "a", text: "Bearish reversal signal", isCorrect: false },
        { id: "b", text: "Bullish continuation pattern", isCorrect: true },
        { id: "c", text: "Indecision signal", isCorrect: false },
        { id: "d", text: "Gap pattern", isCorrect: false },
      ]},
      { id: "q3", text: "Which of these adds the most confirmation to a candlestick pattern?", options: [
        { id: "a", text: "Low trading volume", isCorrect: false },
        { id: "b", text: "High volume on the pattern day", isCorrect: true },
        { id: "c", text: "Pattern occurring on a Monday", isCorrect: false },
        { id: "d", text: "Pattern on a 1-minute chart", isCorrect: false },
      ]},
    ],
  },
  "ls-candle-004": {
    id: "lq-candle-004", title: "Reading Multi-Candle Patterns", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "Morning Star is a 3-candle bullish reversal. The middle candle should be:", options: [
        { id: "a", text: "A large red candle", isCorrect: false },
        { id: "b", text: "A small body (Doji or near-Doji) showing indecision", isCorrect: true },
        { id: "c", text: "A large green candle", isCorrect: false },
        { id: "d", text: "Absent — no middle candle", isCorrect: false },
      ]},
      { id: "q2", text: "Dark Cloud Cover is a bearish pattern where the second candle:", options: [
        { id: "a", text: "Opens below the prior close and closes above midpoint", isCorrect: false },
        { id: "b", text: "Opens above the prior close and closes below its midpoint", isCorrect: true },
        { id: "c", text: "Is identical to the first candle", isCorrect: false },
        { id: "d", text: "Opens at the prior open", isCorrect: false },
      ]},
      { id: "q3", text: "Harami pattern: the second candle is contained WITHIN the body of the first. This indicates:", options: [
        { id: "a", text: "Acceleration of the current trend", isCorrect: false },
        { id: "b", text: "Potential trend slowdown or reversal", isCorrect: true },
        { id: "c", text: "Gap trading opportunity", isCorrect: false },
        { id: "d", text: "Volume confirmation needed", isCorrect: false },
      ]},
    ],
  },
  "ls-candle-005": {
    id: "lq-candle-005", title: "Applying Candles on Indian Charts", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "On Zerodha Kite, candlestick charts default to which time frame?", options: [
        { id: "a", text: "1-minute", isCorrect: false },
        { id: "b", text: "Day (End-of-Day)", isCorrect: true },
        { id: "c", text: "Weekly", isCorrect: false },
        { id: "d", text: "1-hour", isCorrect: false },
      ]},
      { id: "q2", text: "A bullish Pin Bar on Nifty weekly chart near a key support zone indicates:", options: [
        { id: "a", text: "Breakout confirmed above resistance", isCorrect: false },
        { id: "b", text: "High probability that sellers attempted to push price down but buyers absorbed the selling", isCorrect: true },
        { id: "c", text: "FII selling pressure", isCorrect: false },
        { id: "d", text: "The index will gap up next week", isCorrect: false },
      ]},
      { id: "q3", text: "Best practice when using candlestick patterns in live trading:", options: [
        { id: "a", text: "Act on every pattern without filters", isCorrect: false },
        { id: "b", text: "Combine patterns with support/resistance levels and volume for higher probability setups", isCorrect: true },
        { id: "c", text: "Only use patterns on penny stocks", isCorrect: false },
        { id: "d", text: "Ignore patterns on weekly charts", isCorrect: false },
      ]},
    ],
  },
  "ls-tech-001": {
    id: "lq-tech-001", title: "Support & Resistance", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "A support level is:", options: [
        { id: "a", text: "A price where supply exceeds demand causing a reversal up", isCorrect: false },
        { id: "b", text: "A price zone where demand has historically absorbed selling", isCorrect: true },
        { id: "c", text: "The 200-day moving average always", isCorrect: false },
        { id: "d", text: "A SEBI-defined price floor", isCorrect: false },
      ]},
      { id: "q2", text: "When a resistance level is broken, it often becomes:", options: [
        { id: "a", text: "Irrelevant", isCorrect: false },
        { id: "b", text: "A new support level", isCorrect: true },
        { id: "c", text: "A stronger resistance", isCorrect: false },
        { id: "d", text: "A government-mandated price cap", isCorrect: false },
      ]},
      { id: "q3", text: "Which of these makes a support level more significant?", options: [
        { id: "a", text: "It was tested only once, briefly", isCorrect: false },
        { id: "b", text: "It has been tested multiple times with high volume", isCorrect: true },
        { id: "c", text: "It is a round number below ₹100", isCorrect: false },
        { id: "d", text: "It appeared on a 1-minute chart", isCorrect: false },
      ]},
    ],
  },
  "ls-tech-002": {
    id: "lq-tech-002", title: "Moving Averages", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "A 200-day moving average (DMA) is used to:", options: [
        { id: "a", text: "Predict exact turning points", isCorrect: false },
        { id: "b", text: "Identify the long-term trend direction", isCorrect: true },
        { id: "c", text: "Replace fundamentals in analysis", isCorrect: false },
        { id: "d", text: "Calculate intraday volatility", isCorrect: false },
      ]},
      { id: "q2", text: "A Golden Cross occurs when:", options: [
        { id: "a", text: "50 DMA crosses below 200 DMA", isCorrect: false },
        { id: "b", text: "50 DMA crosses above 200 DMA — bullish signal", isCorrect: true },
        { id: "c", text: "Price crosses above 52-week high", isCorrect: false },
        { id: "d", text: "Volume crosses above 30-day average volume", isCorrect: false },
      ]},
      { id: "q3", text: "EMA differs from SMA because EMA:", options: [
        { id: "a", text: "Uses closing prices only", isCorrect: false },
        { id: "b", text: "Gives more weight to recent price data", isCorrect: true },
        { id: "c", text: "Is slower to react to price changes", isCorrect: false },
        { id: "d", text: "Uses volume in its calculation", isCorrect: false },
      ]},
    ],
  },
  "ls-tech-003": {
    id: "lq-tech-003", title: "RSI Indicator", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "RSI value above 70 typically indicates:", options: [
        { id: "a", text: "Oversold — strong buy signal", isCorrect: false },
        { id: "b", text: "Overbought — potential reversal or pullback ahead", isCorrect: true },
        { id: "c", text: "Breakout confirmed", isCorrect: false },
        { id: "d", text: "High volume day", isCorrect: false },
      ]},
      { id: "q2", text: "RSI divergence occurs when:", options: [
        { id: "a", text: "Price and RSI move in the same direction", isCorrect: false },
        { id: "b", text: "Price makes new high but RSI fails to make new high — bearish signal", isCorrect: true },
        { id: "c", text: "RSI stays at 50 for multiple days", isCorrect: false },
        { id: "d", text: "RSI crosses the 14-day average", isCorrect: false },
      ]},
      { id: "q3", text: "Default RSI period used in most charting platforms is:", options: [
        { id: "a", text: "7", isCorrect: false },
        { id: "b", text: "14", isCorrect: true },
        { id: "c", text: "21", isCorrect: false },
        { id: "d", text: "50", isCorrect: false },
      ]},
    ],
  },
  "ls-tech-004": {
    id: "lq-tech-004", title: "Volume Analysis", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "High volume on a breakout day suggests:", options: [
        { id: "a", text: "The breakout is likely false (trap)", isCorrect: false },
        { id: "b", text: "Strong conviction behind the move — higher probability of continuation", isCorrect: true },
        { id: "c", text: "Institutional selling", isCorrect: false },
        { id: "d", text: "The stock will reverse by day end", isCorrect: false },
      ]},
      { id: "q2", text: "Price rising on declining volume typically signals:", options: [
        { id: "a", text: "Healthy uptrend continuation", isCorrect: false },
        { id: "b", text: "Weakening momentum — trend may be losing steam", isCorrect: true },
        { id: "c", text: "SEBI circuit applied", isCorrect: false },
        { id: "d", text: "Stock nearing upper circuit", isCorrect: false },
      ]},
      { id: "q3", text: "On-Balance Volume (OBV) indicator measures:", options: [
        { id: "a", text: "Average daily range", isCorrect: false },
        { id: "b", text: "Cumulative volume flow — positive when price closes up, negative when down", isCorrect: true },
        { id: "c", text: "Relative strength vs Nifty", isCorrect: false },
        { id: "d", text: "Bid-ask spread in real time", isCorrect: false },
      ]},
    ],
  },
  "ls-tech-005": {
    id: "lq-tech-005", title: "Trend Lines & Channels", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "An uptrend line is drawn by connecting:", options: [
        { id: "a", text: "Successive highs", isCorrect: false },
        { id: "b", text: "Successive higher lows", isCorrect: true },
        { id: "c", text: "Open and close of each day", isCorrect: false },
        { id: "d", text: "The midpoints of each candle", isCorrect: false },
      ]},
      { id: "q2", text: "A price channel breakout above the upper channel line indicates:", options: [
        { id: "a", text: "Range-bound action continuing", isCorrect: false },
        { id: "b", text: "Potential acceleration of the uptrend", isCorrect: true },
        { id: "c", text: "Guaranteed reversal", isCorrect: false },
        { id: "d", text: "Stock hitting resistance", isCorrect: false },
      ]},
      { id: "q3", text: "A trend line break is more reliable when accompanied by:", options: [
        { id: "a", text: "Low volume and narrow range", isCorrect: false },
        { id: "b", text: "High volume, confirming candle, and follow-through", isCorrect: true },
        { id: "c", text: "Weekend gap", isCorrect: false },
        { id: "d", text: "Analyst downgrade on same day", isCorrect: false },
      ]},
    ],
  },
  "ls-risk-001": {
    id: "lq-risk-001", title: "Position Sizing", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "The 2% risk rule means:", options: [
        { id: "a", text: "Never buy more than 2% of a stock", isCorrect: false },
        { id: "b", text: "Risk no more than 2% of your total capital on a single trade", isCorrect: true },
        { id: "c", text: "Expect only 2% return per trade", isCorrect: false },
        { id: "d", text: "Allocate 2% to equities", isCorrect: false },
      ]},
      { id: "q2", text: "Position size formula: Capital × Risk% / Stop Distance. If capital = ₹1L, risk = 1%, stop = ₹10/share, position size =", options: [
        { id: "a", text: "100 shares", isCorrect: true },
        { id: "b", text: "1000 shares", isCorrect: false },
        { id: "c", text: "10 shares", isCorrect: false },
        { id: "d", text: "50 shares", isCorrect: false },
      ]},
      { id: "q3", text: "Over-leveraging in F&O most commonly leads to:", options: [
        { id: "a", text: "Faster wealth creation reliably", isCorrect: false },
        { id: "b", text: "Account blowup — losses exceeding initial capital", isCorrect: true },
        { id: "c", text: "SEBI warning letter", isCorrect: false },
        { id: "d", text: "Automatic hedge by broker", isCorrect: false },
      ]},
    ],
  },
  "ls-risk-002": {
    id: "lq-risk-002", title: "Stop Loss Strategy", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "A hard stop loss is:", options: [
        { id: "a", text: "A mental note of when to exit", isCorrect: false },
        { id: "b", text: "A pre-placed order that automatically exits at a fixed price", isCorrect: true },
        { id: "c", text: "A stop set by the broker", isCorrect: false },
        { id: "d", text: "An exit triggered by news", isCorrect: false },
      ]},
      { id: "q2", text: "Trailing stop loss helps by:", options: [
        { id: "a", text: "Locking in profits as the trade moves in your favour", isCorrect: true },
        { id: "b", text: "Guaranteeing no loss on the trade", isCorrect: false },
        { id: "c", text: "Removing the need for a target price", isCorrect: false },
        { id: "d", text: "Automatically averaging down", isCorrect: false },
      ]},
      { id: "q3", text: "Moving your stop loss further away when a trade goes against you is called:", options: [
        { id: "a", text: "Smart risk adjustment", isCorrect: false },
        { id: "b", text: "Stop widening — a common trader mistake that increases losses", isCorrect: true },
        { id: "c", text: "Pyramiding", isCorrect: false },
        { id: "d", text: "Hedging", isCorrect: false },
      ]},
    ],
  },
  "ls-risk-003": {
    id: "lq-risk-003", title: "Risk-Reward Ratio", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "A 1:3 Risk-Reward ratio means:", options: [
        { id: "a", text: "Risk ₹3 to make ₹1", isCorrect: false },
        { id: "b", text: "Risk ₹1 to potentially make ₹3", isCorrect: true },
        { id: "c", text: "Win 3 trades for every 1 loss", isCorrect: false },
        { id: "d", text: "Maximum 3% drawdown allowed", isCorrect: false },
      ]},
      { id: "q2", text: "With a 1:2 R:R and 40% win rate, your trading system is:", options: [
        { id: "a", text: "Losing money overall", isCorrect: false },
        { id: "b", text: "Breakeven", isCorrect: false },
        { id: "c", text: "Profitable — 40% × 2 = 0.8 > 60% × 1 = 0.6", isCorrect: true },
        { id: "d", text: "Too risky to evaluate", isCorrect: false },
      ]},
      { id: "q3", text: "Why should you define your R:R BEFORE entering a trade?", options: [
        { id: "a", text: "SEBI requires it by law", isCorrect: false },
        { id: "b", text: "It removes emotional decision-making during the trade", isCorrect: true },
        { id: "c", text: "It guarantees profit", isCorrect: false },
        { id: "d", text: "It improves execution speed", isCorrect: false },
      ]},
    ],
  },
  "ls-risk-004": {
    id: "lq-risk-004", title: "Portfolio Diversification", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "Diversification primarily reduces:", options: [
        { id: "a", text: "Systematic (market) risk", isCorrect: false },
        { id: "b", text: "Unsystematic (stock-specific) risk", isCorrect: true },
        { id: "c", text: "All types of risk completely", isCorrect: false },
        { id: "d", text: "Brokerage costs", isCorrect: false },
      ]},
      { id: "q2", text: "Holding 15 highly correlated banking stocks is NOT true diversification because:", options: [
        { id: "a", text: "Banks are too large to diversify", isCorrect: false },
        { id: "b", text: "All stocks will likely fall together in a sector downturn", isCorrect: true },
        { id: "c", text: "SEBI limits banking sector exposure", isCorrect: false },
        { id: "d", text: "Banking sector returns are capped by RBI", isCorrect: false },
      ]},
      { id: "q3", text: "For a ₹5 lakh portfolio, putting ₹4 lakh in one stock is an example of:", options: [
        { id: "a", text: "Concentrated bet — high conviction but high risk", isCorrect: true },
        { id: "b", text: "Proper diversification", isCorrect: false },
        { id: "c", text: "Index investing", isCorrect: false },
        { id: "d", text: "Defensive strategy", isCorrect: false },
      ]},
    ],
  },
  "ls-risk-005": {
    id: "lq-risk-005", title: "Drawdown Management", coinValue: 80, isPassed: false,
    questions: [
      { id: "q1", text: "A 50% drawdown requires what return to recover?", options: [
        { id: "a", text: "50%", isCorrect: false },
        { id: "b", text: "100%", isCorrect: true },
        { id: "c", text: "75%", isCorrect: false },
        { id: "d", text: "25%", isCorrect: false },
      ]},
      { id: "q2", text: "Maximum drawdown is measured as:", options: [
        { id: "a", text: "Average daily loss", isCorrect: false },
        { id: "b", text: "Peak-to-trough decline in portfolio value", isCorrect: true },
        { id: "c", text: "Total loss in a calendar year", isCorrect: false },
        { id: "d", text: "Largest single-day loss", isCorrect: false },
      ]},
      { id: "q3", text: "During a drawdown period, the best action for a systematic trader is:", options: [
        { id: "a", text: "Double position sizes to recover faster", isCorrect: false },
        { id: "b", text: "Review the system, reduce size if needed, but stick to rules", isCorrect: true },
        { id: "c", text: "Switch to a different strategy immediately", isCorrect: false },
        { id: "d", text: "Stop trading permanently", isCorrect: false },
      ]},
    ],
  },
  "ls-psych-001": {
    id: "lq-psych-001", title: "FOMO & Impulse Trading", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "FOMO (Fear Of Missing Out) in trading typically causes:", options: [
        { id: "a", text: "Better trade entries at optimal levels", isCorrect: false },
        { id: "b", text: "Chasing price moves — buying high after a stock has already moved significantly", isCorrect: true },
        { id: "c", text: "More disciplined position sizing", isCorrect: false },
        { id: "d", text: "Early exits with small profits", isCorrect: false },
      ]},
      { id: "q2", text: "The best antidote to FOMO is:", options: [
        { id: "a", text: "Following more traders on social media", isCorrect: false },
        { id: "b", text: "Having a pre-defined trade plan with entry criteria before markets open", isCorrect: true },
        { id: "c", text: "Checking P&L every 5 minutes", isCorrect: false },
        { id: "d", text: "Trading with larger size to recover missed moves", isCorrect: false },
      ]},
      { id: "q3", text: "Revenge trading after a loss typically leads to:", options: [
        { id: "a", text: "Quick recovery of losses", isCorrect: false },
        { id: "b", text: "More losses due to emotional decision-making and oversized trades", isCorrect: true },
        { id: "c", text: "Better risk management", isCorrect: false },
        { id: "d", text: "Identifying the real market trend", isCorrect: false },
      ]},
    ],
  },
  "ls-psych-002": {
    id: "lq-psych-002", title: "Loss Aversion", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "Loss aversion means traders typically:", options: [
        { id: "a", text: "Feel losses twice as strongly as equivalent gains", isCorrect: true },
        { id: "b", text: "Always avoid taking any losses", isCorrect: false },
        { id: "c", text: "Sell winners too early and hold losers too long — both caused by avoiding realising pain", isCorrect: false },
        { id: "d", text: "Never reach profitability", isCorrect: false },
      ]},
      { id: "q2", text: "Holding a losing trade far beyond your stop loss hoping for recovery is called:", options: [
        { id: "a", text: "Smart averaging", isCorrect: false },
        { id: "b", text: "Anchoring — holding because you want your buy price back", isCorrect: true },
        { id: "c", text: "Trend following", isCorrect: false },
        { id: "d", text: "Mean reversion trading", isCorrect: false },
      ]},
      { id: "q3", text: "To overcome loss aversion, the most effective practice is:", options: [
        { id: "a", text: "Think in terms of % portfolio risk, not rupees per trade", isCorrect: true },
        { id: "b", text: "Trade only penny stocks", isCorrect: false },
        { id: "c", text: "Trade larger sizes to force discipline", isCorrect: false },
        { id: "d", text: "Check broker P&L hourly", isCorrect: false },
      ]},
    ],
  },
  "ls-psych-003": {
    id: "lq-psych-003", title: "Discipline & Process", coinValue: 70, isPassed: false,
    questions: [
      { id: "q1", text: "A trading plan should define:", options: [
        { id: "a", text: "Which tips to follow on WhatsApp groups", isCorrect: false },
        { id: "b", text: "Entry criteria, exit criteria, position size, and maximum daily loss", isCorrect: true },
        { id: "c", text: "How many trades to place per day for maximum income", isCorrect: false },
        { id: "d", text: "Which broker has the lowest fees only", isCorrect: false },
      ]},
      { id: "q2", text: "Consistency in trading results comes primarily from:", options: [
        { id: "a", text: "Market timing and luck", isCorrect: false },
        { id: "b", text: "Following a robust process repeatedly over hundreds of trades", isCorrect: true },
        { id: "c", text: "Trading only during Muhurat timing", isCorrect: false },
        { id: "d", text: "Having inside information", isCorrect: false },
      ]},
      { id: "q3", text: "A daily maximum loss limit helps by:", options: [
        { id: "a", text: "Preventing participation in major market moves", isCorrect: false },
        { id: "b", text: "Protecting capital on bad days and preventing emotional spiral trading", isCorrect: true },
        { id: "c", text: "Guaranteeing profitability", isCorrect: false },
        { id: "d", text: "It has no practical benefit", isCorrect: false },
      ]},
    ],
  },
  "ls-psych-004": {
    id: "lq-psych-004", title: "Trading Journal Practice", coinValue: 60, isPassed: false,
    questions: [
      { id: "q1", text: "The primary purpose of a trading journal is:", options: [
        { id: "a", text: "Tax documentation for the CA", isCorrect: false },
        { id: "b", text: "Identifying patterns in your behaviour and refining your edge over time", isCorrect: true },
        { id: "c", text: "Impressing other traders in communities", isCorrect: false },
        { id: "d", text: "Calculating exact brokerage paid", isCorrect: false },
      ]},
      { id: "q2", text: "Each journal entry should capture:", options: [
        { id: "a", text: "P&L only", isCorrect: false },
        { id: "b", text: "Entry/exit price, rationale, emotions during the trade, and lesson learned", isCorrect: true },
        { id: "c", text: "The stock name and sector", isCorrect: false },
        { id: "d", text: "Technical indicator values at the time", isCorrect: false },
      ]},
      { id: "q3", text: "Reviewing your journal monthly helps you:", options: [
        { id: "a", text: "Predict future markets", isCorrect: false },
        { id: "b", text: "Eliminate mistakes in strategy and psychology that recur under similar conditions", isCorrect: true },
        { id: "c", text: "Calculate your tax liability", isCorrect: false },
        { id: "d", text: "Get tips from past trades", isCorrect: false },
      ]},
    ],
  },
  "ls-psych-005": {
    id: "lq-psych-005", title: "Building Mental Edge", coinValue: 80, isPassed: false,
    questions: [
      { id: "q1", text: "The concept of 'probabilistic thinking' in trading means:", options: [
        { id: "a", text: "Any single trade outcome is unpredictable; focus on executing your edge across many trades", isCorrect: true },
        { id: "b", text: "Using probability calculators for each trade", isCorrect: false },
        { id: "c", text: "Only trading setups with >70% win rate", isCorrect: false },
        { id: "d", text: "Avoiding trades with uncertain outcomes", isCorrect: false },
      ]},
      { id: "q2", text: "Detachment from trade outcomes (while executing properly) is beneficial because:", options: [
        { id: "a", text: "It means you don't care about money", isCorrect: false },
        { id: "b", text: "Emotional attachment to individual trades distorts decision-making and breaks process discipline", isCorrect: true },
        { id: "c", text: "Brokers prefer emotionally detached clients", isCorrect: false },
        { id: "d", text: "SEBI guidelines require it", isCorrect: false },
      ]},
      { id: "q3", text: "The best traders treat their trading as:", options: [
        { id: "a", text: "A casino game where luck dominates", isCorrect: false },
        { id: "b", text: "A business — with process, metrics, review cycles, and capital management", isCorrect: true },
        { id: "c", text: "A full-time screen-watching activity", isCorrect: false },
        { id: "d", text: "A hobby done for excitement", isCorrect: false },
      ]},
    ],
  },
};

// ─── Lesson Data ──────────────────────────────────────────────────────────────

export const localLessons: Lesson[] = [
  // ── Market Fundamentals ──
  {
    id: "ls-mkt-001", pathId: "lp-market", title: "How Indian Stock Markets Work", order: 1,
    durationSeconds: 180, videoUrl: VIDEO_URL,
    conceptTags: ["BSE", "NSE", "SEBI", "Nifty 50"],
    keyPoint: "BSE and NSE are India's two primary exchanges. SEBI regulates them. Nifty 50 tracks the top 50 NSE companies.",
    summary: "India has two major stock exchanges: BSE (Bombay Stock Exchange) — Asia's oldest, with over 5,000 listed companies — and NSE (National Stock Exchange), which runs the Nifty 50. SEBI (Securities and Exchange Board of India) regulates both to protect investors. When you buy shares, you're becoming a part-owner of that business.",
    isCompleted: false, isUnlocked: true, quiz: lessonQuizzes["ls-mkt-001"],
  },
  {
    id: "ls-mkt-002", pathId: "lp-market", title: "How a Trade Executes", order: 2,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["market order", "limit order", "T+1 settlement", "circuit breaker"],
    keyPoint: "Market orders execute instantly at best price. Limit orders execute only at your price. Settlement in India is T+1 — funds and shares exchange the next trading day.",
    summary: "When you place a buy order on Zerodha or Groww, it reaches the exchange matching engine. Market orders fill immediately at the best available price. Limit orders wait for your specified price. Indian equity markets settle on T+1 basis — you receive shares the next trading day. Circuit breakers pause trading when a stock moves ±5%, ±10%, or ±20%.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-mkt-002"],
  },
  {
    id: "ls-mkt-003", pathId: "lp-market", title: "Who Moves the Markets", order: 3,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["FII", "DII", "retail investor", "promoter holding"],
    keyPoint: "FIIs (foreign funds) and DIIs (domestic institutions like mutual funds) move markets most. Retail investors follow the trend they set.",
    summary: "Markets move primarily because of large participants: FIIs (Foreign Institutional Investors) bring international capital; DIIs (Domestic Institutional Investors — mutual funds, insurance, pension funds) deploy savings. Retail investors like you are the third category. When FIIs sell heavily, Nifty usually falls. Understanding fund flows helps you read price action better.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-mkt-003"],
  },
  {
    id: "ls-mkt-004", pathId: "lp-market", title: "Reading a Stock Quote", order: 4,
    durationSeconds: 225, videoUrl: VIDEO_URL,
    conceptTags: ["52-week high/low", "P/E ratio", "market cap", "volume"],
    keyPoint: "P/E ratio shows what investors pay per rupee of earnings. High volume on a price move adds conviction. 52-week range shows where the stock has traded over a year.",
    summary: "Every stock page on Screener.in or Zerodha shows key data: CMP (current market price), P/E ratio (price vs earnings), market cap (total company value), 52-week high/low, and volume. Volume tells you participation level — high volume moves are more reliable. P/E above sector average may mean overvaluation, or strong growth expectations.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-mkt-004"],
  },
  {
    id: "ls-mkt-005", pathId: "lp-market", title: "Demat, Trading Account & Your First Trade", order: 5,
    durationSeconds: 240, videoUrl: VIDEO_URL,
    conceptTags: ["Demat account", "CDSL", "NSDL", "broker", "KYC"],
    keyPoint: "You need a Demat account (holds shares electronically) and a linked Trading account (to place orders). Both are opened together with brokers like Zerodha, Groww, or Angel One.",
    summary: "A Demat account holds your shares in digital form (no physical certificates). It's maintained by depositories — CDSL or NSDL. A Trading account is what you use to actually buy/sell. Brokers like Zerodha (Kite), Groww, Angel One, or Upstox offer both linked together. KYC requires PAN, Aadhaar, bank account. Zero-brokerage on delivery means no charge for long-term stock buying.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-mkt-005"],
  },

  // ── Candlestick Mastery ──
  {
    id: "ls-candle-001", pathId: "lp-candlestick", title: "Anatomy of a Candlestick", order: 1,
    durationSeconds: 180, videoUrl: VIDEO_URL,
    conceptTags: ["open", "close", "high", "low", "body", "wick"],
    keyPoint: "A candle's body shows open-to-close. The wicks show intraday extremes. Green body = close above open. Red body = close below open.",
    summary: "Each candlestick encodes 4 data points: Open, High, Low, Close. The body (rectangle) spans open to close. Wicks (thin lines) extend to intraday high and low. A tall green body means strong buying all session. A tiny body with long wicks = Doji — market indecision. Reading candles is the foundation of all price action analysis.",
    isCompleted: false, isUnlocked: true, quiz: lessonQuizzes["ls-candle-001"],
  },
  {
    id: "ls-candle-002", pathId: "lp-candlestick", title: "Reversal Patterns: Hammer & Engulfing", order: 2,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["hammer", "shooting star", "bullish engulfing", "reversal"],
    keyPoint: "Hammer at bottom = buyers rejecting lower prices. Bullish Engulfing = buyers overpowering sellers. Both need context (prior downtrend) to matter.",
    summary: "A Hammer has a small body at top, long lower wick — sellers pushed price down hard but buyers recovered it. Bullish Engulfing: second green candle completely covers the prior red candle's body — momentum shift. Shooting Star (at tops) is the bearish inverse of Hammer. These patterns gain power at key support/resistance levels. Always check: what was the prior trend?",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-candle-002"],
  },
  {
    id: "ls-candle-003", pathId: "lp-candlestick", title: "Continuation Patterns", order: 3,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["three white soldiers", "three black crows", "rising three methods"],
    keyPoint: "Three White Soldiers (3 consecutive green candles, each closing higher) = strong bull continuation. Three Black Crows = strong bear continuation.",
    summary: "Not all patterns signal reversals — many indicate trend continuation. Three White Soldiers: three consecutive bullish candles, each opening within the prior body and closing at new highs. Signals strong buying momentum. Three Black Crows is the bearish equivalent. Rising Three Methods: large green candle, three small red candles contained within it, then another large green — a bullish pause-and-continue pattern.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-candle-003"],
  },
  {
    id: "ls-candle-004", pathId: "lp-candlestick", title: "Multi-Candle Patterns", order: 4,
    durationSeconds: 225, videoUrl: VIDEO_URL,
    conceptTags: ["morning star", "evening star", "dark cloud cover", "harami"],
    keyPoint: "Morning Star (3-candle): red → doji → green = bullish reversal. Evening Star = bearish equivalent. Harami (small candle inside prior candle) = momentum slowdown warning.",
    summary: "The Morning Star 3-candle pattern: large bearish candle, small indecision candle (gap is ideal), then large bullish candle closing above midpoint of first candle. One of the strongest reversal signals. Dark Cloud Cover is bearish: opens above prior close, closes below its midpoint. Harami: second candle's body is contained inside first candle — trend running out of steam.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-candle-004"],
  },
  {
    id: "ls-candle-005", pathId: "lp-candlestick", title: "Applying Candles on Live Indian Charts", order: 5,
    durationSeconds: 240, videoUrl: VIDEO_URL,
    conceptTags: ["Zerodha Kite", "TradingView", "pattern + context", "confirmation"],
    keyPoint: "Patterns alone are not enough. Combine candlestick patterns with support/resistance, volume, and trend direction for high-probability setups.",
    summary: "On Zerodha Kite or TradingView, switch to candlestick view. Look for patterns at meaningful price levels — previous support, 52-week high/low, round numbers. Volume confirmation makes the pattern stronger. On Nifty weekly chart, a Hammer near a multi-month support with above-average volume has historically preceded significant rallies. Practice identifying patterns before risking capital.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-candle-005"],
  },

  // ── Technical Analysis ──
  {
    id: "ls-tech-001", pathId: "lp-technical", title: "Support & Resistance", order: 1,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["support", "resistance", "role reversal", "key levels"],
    keyPoint: "Support = price zone where buyers historically step in. Resistance = zone where sellers dominate. Broken resistance becomes new support.",
    summary: "Support and resistance are the foundation of technical analysis. Support: a price level where falling price has repeatedly bounced. Resistance: a level where rising price has repeatedly stalled. When a resistance is decisively broken with volume, it often flips to support (role reversal). The more times a level has been tested without breaking, the more significant it is. Mark these on your charts before trading.",
    isCompleted: false, isUnlocked: true, quiz: lessonQuizzes["ls-tech-001"],
  },
  {
    id: "ls-tech-002", pathId: "lp-technical", title: "Moving Averages", order: 2,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["SMA", "EMA", "200 DMA", "Golden Cross", "Death Cross"],
    keyPoint: "50 DMA crossing above 200 DMA = Golden Cross (bullish). Below = Death Cross (bearish). 200 DMA = the long-term trend barometer that institutions watch.",
    summary: "Moving averages smooth price to show trend direction. SMA (Simple) gives equal weight to all days. EMA (Exponential) weighs recent prices more — reacts faster. The 200 DMA is the most watched: price above = bull trend, below = bear trend. Golden Cross (50 crosses above 200) is a widely followed buy signal in Nifty. Institutions defend these levels actively.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-tech-002"],
  },
  {
    id: "ls-tech-003", pathId: "lp-technical", title: "RSI: When Markets Are Stretched", order: 3,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["RSI", "overbought", "oversold", "divergence", "14-period"],
    keyPoint: "RSI above 70 = overbought. Below 30 = oversold. Divergence (price makes new high but RSI doesn't) = trend weakness — one of the most reliable signals.",
    summary: "RSI (Relative Strength Index) measures momentum on a 0–100 scale. Above 70 suggests the market has run up too fast (overbought). Below 30 means oversold. But in strong uptrends, RSI can stay above 70 for extended periods. The most powerful signal is divergence: stock makes a new 52-week high but RSI makes a lower high — hidden weakness before a reversal.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-tech-003"],
  },
  {
    id: "ls-tech-004", pathId: "lp-technical", title: "Volume: The Market's Truth Detector", order: 4,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["volume confirmation", "breakout", "OBV", "institutional activity"],
    keyPoint: "High volume + price move = conviction. Low volume + price move = suspect. Breakouts without volume fail 60–70% of the time.",
    summary: "Volume is the number of shares changing hands. It validates price moves. A breakout above resistance on 3x average volume is far more reliable than the same breakout on 0.5x volume. Price rising on declining volume = distribution (institutions quietly selling into strength). On-Balance Volume (OBV) accumulates volume — if OBV trends up while price is flat, accumulation is happening.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-tech-004"],
  },
  {
    id: "ls-tech-005", pathId: "lp-technical", title: "Trend Lines & Channels", order: 5,
    durationSeconds: 225, videoUrl: VIDEO_URL,
    conceptTags: ["uptrend line", "downtrend line", "price channel", "breakout"],
    keyPoint: "Uptrend line connects higher lows. Downtrend line connects lower highs. Breakout from a channel on volume = potential acceleration of the move.",
    summary: "A trend line connects at least two swing lows (uptrend) or swing highs (downtrend). The more times price touches and bounces off a trend line, the more significant it is. Price channels contain price between parallel trend lines. When price breaks out of a channel with volume, the measured move is typically equal to the channel's height. Draw trend lines on daily or weekly charts for more reliable signals.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-tech-005"],
  },

  // ── Risk Management ──
  {
    id: "ls-risk-001", pathId: "lp-risk", title: "Position Sizing: Never Risk More Than 2%", order: 1,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["2% rule", "position size formula", "capital protection", "leverage"],
    keyPoint: "Risk only 2% of total capital per trade. Formula: Position Size = (Capital × Risk%) / Stop Distance. This one rule separates surviving traders from blown accounts.",
    summary: "The 2% rule: if your total trading capital is ₹1 lakh, never risk more than ₹2,000 on a single trade. Position size = (₹1L × 2%) ÷ ₹10 stop = 20 shares. Simple. Many traders blow accounts because they size based on conviction, not math. With this rule, you can lose 50 consecutive trades and still have 36% of your capital. Survival enables recovery.",
    isCompleted: false, isUnlocked: true, quiz: lessonQuizzes["ls-risk-001"],
  },
  {
    id: "ls-risk-002", pathId: "lp-risk", title: "Stop Loss: Your Only Protection", order: 2,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["hard stop", "trailing stop", "stop widening", "mental stop"],
    keyPoint: "Always use a hard stop loss — a pre-placed order. Mental stops are broken by emotions every time. Never widen a stop after entry.",
    summary: "A stop loss is a pre-defined exit price if the trade goes against you. Hard stop = actual order placed in the system. Mental stop = 'I'll sell if it drops to X' — broken 90% of the time because of hope. Trailing stop locks in profits as price moves favorably. The #1 mistake: moving your stop further away when a trade goes against you. This turns small losses into account-damaging ones.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-risk-002"],
  },
  {
    id: "ls-risk-003", pathId: "lp-risk", title: "Risk-Reward: Math of Consistent Profits", order: 3,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["R:R ratio", "1:2 RR", "win rate", "expectancy"],
    keyPoint: "With 1:2 R:R you only need a 34% win rate to be profitable. With 1:3 R:R, even 26% wins make money. Better R:R makes the math work in your favour.",
    summary: "Risk-Reward ratio: before every trade, define maximum loss (R) and minimum target (reward). 1:2 R:R means risking ₹1 to make ₹2. The power: even with 40% win rate at 1:2, you profit (0.4 × 2 = 0.8 > 0.6 × 1 = 0.6). Most new traders obsess over win rate, ignoring R:R. Professional traders with 40% win rates earn more than amateurs with 70% win rates at 1:0.5 R:R.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-risk-003"],
  },
  {
    id: "ls-risk-004", pathId: "lp-risk", title: "Diversification That Actually Works", order: 4,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["unsystematic risk", "sector correlation", "portfolio construction"],
    keyPoint: "True diversification means low correlation between holdings, not just more stocks. 15 banking stocks is NOT diversified — they all fall together in a sector crash.",
    summary: "Diversification reduces unsystematic (stock-specific) risk. Systematic risk (market-wide crashes) cannot be diversified away. For a ₹5–10 lakh portfolio: 6–10 stocks across different sectors is sufficient. Overloading one sector (even if each is a different company) provides false comfort. Add asset class diversity too: equity + debt + gold reduces overall portfolio volatility significantly.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-risk-004"],
  },
  {
    id: "ls-risk-005", pathId: "lp-risk", title: "Managing Drawdowns", order: 5,
    durationSeconds: 225, videoUrl: VIDEO_URL,
    conceptTags: ["drawdown", "peak-to-trough", "recovery math", "circuit breaker"],
    keyPoint: "A 50% drawdown needs 100% return to recover. Preserve capital above all. Every rupee not lost is a rupee still compounding.",
    summary: "Drawdown = decline from your portfolio peak to trough. A 20% drawdown needs 25% to recover. A 50% drawdown needs 100%. This compounding math is why professionals obsess over capital preservation. Practical tools: daily max loss limit (stop trading if down X% in a day), monthly review of strategy performance, position size reduction during drawdown periods until confidence returns.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-risk-005"],
  },

  // ── Trading Psychology ──
  {
    id: "ls-psych-001", pathId: "lp-psychology", title: "FOMO: The Market's Most Expensive Emotion", order: 1,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["FOMO", "impulse trading", "chasing price", "trade plan"],
    keyPoint: "FOMO makes you buy after a move has already happened — at the worst possible entry. The cure: define entry criteria BEFORE markets open, so you never chase.",
    summary: "FOMO (Fear Of Missing Out) causes traders to buy after a stock has already risen 10–15%. You enter just as the early movers are taking profits. The trade plan is the antidote: decide before markets open which setups you'll take and at what price. If the setup doesn't trigger, move on. There will always be another trade. Missing a move costs nothing. Chasing it costs real money.",
    isCompleted: false, isUnlocked: true, quiz: lessonQuizzes["ls-psych-001"],
  },
  {
    id: "ls-psych-002", pathId: "lp-psychology", title: "Loss Aversion: Why You Hold Losers Too Long", order: 2,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["loss aversion", "anchoring", "sunk cost", "mental accounting"],
    keyPoint: "The pain of losing ₹5,000 feels twice as bad as the joy of making ₹5,000. This makes you hold losers (avoiding pain) and sell winners early. Flip this by thinking in % of capital, not absolute rupees.",
    summary: "Daniel Kahneman's research: losses feel 2x stronger than gains. In trading, this manifests as holding losers hoping they'll 'come back' and taking profits too early. Anchoring: you refuse to sell below your buy price because you 'need to get back to even.' Treat every position as: if you didn't own this today, would you buy it? If no — exit. The buy price is irrelevant to the future.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-psych-002"],
  },
  {
    id: "ls-psych-003", pathId: "lp-psychology", title: "Building a Process That Overrides Emotion", order: 3,
    durationSeconds: 195, videoUrl: VIDEO_URL,
    conceptTags: ["trading plan", "daily max loss", "rules-based trading", "consistency"],
    keyPoint: "A written trading plan with rules removes real-time decisions. Rules don't feel emotions. Your job becomes execution, not improvisation.",
    summary: "Profitable traders have documented systems: entry criteria (what chart pattern + what market condition), exit rules (stop and target), position size formula, and a daily max loss limit. The daily max loss is crucial: if you're down 2% by 11am, you stop for the day. This prevents the spiral: one bad trade leads to revenge trade leads to account damage. Discipline is a system, not a personality trait.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-psych-003"],
  },
  {
    id: "ls-psych-004", pathId: "lp-psychology", title: "The Trading Journal: Your Unfair Advantage", order: 4,
    durationSeconds: 210, videoUrl: VIDEO_URL,
    conceptTags: ["trading journal", "pattern recognition", "self-review", "edge refinement"],
    keyPoint: "Your journal is your personal performance database. Most traders skip it. Those who do it consistently improve 2–3x faster than those who don't.",
    summary: "A trading journal records: stock, entry price, exit price, rationale for entry, emotional state during the trade, what actually happened vs what you expected, and one lesson. Review weekly: you'll notice patterns — do you consistently exit too early on winning trades? Do you break your rules after 2 losses? These patterns are invisible without data. The journal converts experience into learning.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-psych-004"],
  },
  {
    id: "ls-psych-005", pathId: "lp-psychology", title: "The Mental Edge: Thinking in Probabilities", order: 5,
    durationSeconds: 225, videoUrl: VIDEO_URL,
    conceptTags: ["probabilistic thinking", "expectancy", "process focus", "detachment"],
    keyPoint: "Every trade is just one sample from a distribution. Even a perfect setup loses sometimes. Your edge only shows over 100+ trades. Focus on process, not individual outcomes.",
    summary: "Professional traders think in probabilities: 'this setup works 55% of the time with 1:2 R:R — expectancy is positive.' Individual trade outcome is irrelevant. This mental shift removes the emotional weight of each trade. You execute the process and let the edge compound. Mark Douglas's 'Trading in the Zone' describes this mindset precisely. Detachment from outcome is not indifference — it's operational clarity.",
    isCompleted: false, isUnlocked: false, quiz: lessonQuizzes["ls-psych-005"],
  },
];

// ─── Learning Path Data ───────────────────────────────────────────────────────

export const localLearningPaths: LearningPath[] = [
  {
    id: "lp-market",
    title: "Market Fundamentals",
    description: "How Indian stock markets work — BSE, NSE, SEBI, orders, and your first trade.",
    category: "Markets",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    totalLessons: 5,
    estimatedMinutes: 18,
  },
  {
    id: "lp-candlestick",
    title: "Candlestick Mastery",
    description: "Read price action like a pro — from basic anatomy to powerful multi-candle patterns.",
    category: "Technical Analysis",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1642790551116-18a150d975b6?w=400&q=80",
    totalLessons: 5,
    estimatedMinutes: 19,
  },
  {
    id: "lp-technical",
    title: "Technical Analysis Basics",
    description: "Support, resistance, moving averages, RSI, and volume — the trader's toolkit.",
    category: "Technical Analysis",
    level: "Beginner",
    thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&q=80",
    totalLessons: 5,
    estimatedMinutes: 18,
  },
  {
    id: "lp-risk",
    title: "Risk Management",
    description: "Position sizing, stop losses, R:R ratios, and drawdown management. Survival first.",
    category: "Risk & Capital",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    totalLessons: 5,
    estimatedMinutes: 18,
  },
  {
    id: "lp-psychology",
    title: "Trading Psychology",
    description: "FOMO, loss aversion, discipline, journaling, and building a probabilistic mindset.",
    category: "Psychology",
    level: "Intermediate",
    thumbnail: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&q=80",
    totalLessons: 5,
    estimatedMinutes: 17,
  },
];

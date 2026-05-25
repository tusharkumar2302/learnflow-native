export interface ChapterConcept {
  term: string;
  definition: string;
}

export interface ChapterNote {
  chapterId: string;
  title: string;
  summary: string;
  concepts: ChapterConcept[];
  keyPoints: string[];
  practicalTip: string;
  commonMistake: string;
}

export const localNotes: Record<string, ChapterNote> = {

  // ── AI Tools for Financial Research ───────────────────────────────────────

  "ch-ai-001": {
    chapterId: "ch-ai-001",
    title: "Why AI is Changing Financial Research",
    summary:
      "The research process that once took an analyst a full day — reading filings, scanning news, comparing peers — can now be completed in under an hour using AI-assisted tools. This shift isn't about replacing human judgement; it's about removing the grunt work so you can spend more time on the decisions that actually matter.\n\nLarge Language Models like GPT-4 can read, summarise, and cross-reference documents at superhuman speed. For retail investors, this levels the playing field against institutional research desks that previously held a significant information advantage.",
    concepts: [
      { term: "Large Language Model (LLM)", definition: "A neural network trained on vast amounts of text that can understand and generate human language. Used in tools like ChatGPT and Perplexity." },
      { term: "Hallucination", definition: "When an AI generates a confident-sounding answer that is factually incorrect. A critical risk when using AI for financial data." },
      { term: "Retrieval-Augmented Generation (RAG)", definition: "A technique that grounds AI responses in real documents — reducing hallucinations by making the model cite actual sources." },
      { term: "Information asymmetry", definition: "The gap in information access between institutional investors and retail investors. AI tools are narrowing this gap." },
    ],
    keyPoints: [
      "AI tools accelerate research — they don't replace judgement. Verify every key claim independently.",
      "LLMs are best at summarising, comparing, and explaining — not predicting prices or earnings.",
      "Institutional desks already use AI. Retail investors who don't adapt will fall further behind.",
      "The biggest risk with AI is over-confidence in its output. Always ask: what's the source?",
      "Free tools like ChatGPT, Perplexity, and Gemini are sufficient for most retail research needs.",
    ],
    practicalTip:
      "Start by using AI to summarise a company's latest annual report. Upload the PDF to ChatGPT and ask: 'What are the 3 biggest risks this company disclosed?' Compare the output with your own reading to calibrate the tool's accuracy.",
    commonMistake:
      "Treating AI output as a buy/sell recommendation. AI summarises information — it has no knowledge of current market prices, your risk profile, or future events. Use it as a starting point, never an endpoint.",
  },

  "ch-ai-002": {
    chapterId: "ch-ai-002",
    title: "Screening Stocks with AI Tools",
    summary:
      "Traditional stock screening requires you to set manual filters across dozens of financial databases. AI-powered screeners let you describe what you're looking for in plain language and get a ranked shortlist — dramatically cutting the time from idea to watchlist.\n\nTools like Screener.in (Indian-specific), Trendlyne, and AI-enhanced versions of Tickertape allow you to combine quantitative filters with qualitative signals. The skill is knowing which inputs to trust and which need manual verification.",
    concepts: [
      { term: "Stock screener", definition: "A tool that filters stocks based on financial criteria like P/E ratio, ROE, or debt levels. AI screeners add natural language and pattern recognition." },
      { term: "Return on Equity (ROE)", definition: "Net profit divided by shareholder equity. Measures how efficiently a company uses investors' money. A higher ROE generally indicates better capital efficiency." },
      { term: "Debt-to-Equity (D/E) ratio", definition: "Total debt divided by shareholder equity. High D/E means the company relies heavily on borrowed money — higher risk in downturns." },
      { term: "Price-to-Earnings (P/E) ratio", definition: "Stock price divided by earnings per share. Indicates how much investors pay for each rupee of earnings. High P/E can mean growth expectations or overvaluation." },
    ],
    keyPoints: [
      "Start screening with 3-4 quality filters: ROE > 15%, D/E < 1, consistent revenue growth, positive free cash flow.",
      "AI screeners can find hidden patterns across thousands of stocks — use them to generate ideas, not decisions.",
      "Indian-specific tools (Screener.in, Trendlyne) use BSE/NSE data — always prefer these over global tools for Indian stocks.",
      "A screener output is a suspect list, not a conviction list. Every stock still needs fundamental analysis.",
      "Screener results change daily — run your screen weekly, not once and hold forever.",
    ],
    practicalTip:
      "On Screener.in, create a custom screen: ROE > 15%, Debt < 0.5x equity, Sales growth > 10% (5yr), and PE < 30. Save it and review the output every Sunday. Over time, you'll learn which filters produce quality businesses vs. traps.",
    commonMistake:
      "Using only valuation filters (low P/E, low P/B) without quality filters. Cheap stocks are often cheap for a reason — weak business, falling earnings, or high debt. Always combine value with quality.",
  },

  "ch-ai-003": {
    chapterId: "ch-ai-003",
    title: "Using ChatGPT for Financial Analysis",
    summary:
      "ChatGPT becomes a powerful research tool when you know how to ask the right questions. The quality of output scales directly with the quality of your prompt — vague inputs produce vague outputs. Specific, structured prompts produce analysis-grade responses.\n\nFor financial use cases, the most valuable applications are: synthesising multiple analyst reports, extracting key risks from annual filings, comparing business models, and explaining complex financial concepts in plain language.",
    concepts: [
      { term: "Prompt engineering", definition: "The practice of crafting specific, structured inputs to AI tools to get high-quality, reliable outputs. The most important skill when using AI for research." },
      { term: "Zero-shot prompt", definition: "Asking AI a question without examples. Works for simple tasks. For complex financial analysis, few-shot (with examples) works better." },
      { term: "Chain-of-thought prompting", definition: "Asking AI to 'think step by step' before answering. Significantly improves accuracy for multi-step reasoning tasks like financial comparisons." },
      { term: "Context window", definition: "The amount of text an AI can process at once. GPT-4 can handle large documents (up to ~128K tokens), making it suitable for full annual reports." },
    ],
    keyPoints: [
      "Specify output format in your prompt: 'Respond in 5 bullet points' or 'Create a table comparing X and Y'.",
      "Give context: 'I am a retail investor in India analyzing mid-cap companies...' — this shapes the response quality.",
      "Ask AI to play devil's advocate: 'What are the 3 strongest bear cases for this company?'",
      "Never ask for price predictions — AI cannot predict markets and will produce plausible-sounding nonsense.",
      "Cross-verify any specific numbers (revenue, profit, margins) against primary sources like BSE filings.",
    ],
    practicalTip:
      "Use this prompt template for any company: 'Analyse [Company Name] as a potential long-term investment. Cover: (1) business model in 3 sentences, (2) 3 growth drivers, (3) 3 key risks, (4) one metric I should track monthly. Format as a structured report.' Refine it based on the output you get.",
    commonMistake:
      "Pasting the entire annual report as one prompt and expecting a complete analysis. Break it into sections — ask about the business model first, then risks, then financials separately. Focused prompts produce far better results.",
  },

  "ch-ai-004": {
    chapterId: "ch-ai-004",
    title: "Automating Your Portfolio Tracking",
    summary:
      "Manual portfolio tracking is error-prone and time-consuming. Automated systems using spreadsheet integrations, broker APIs, and notification tools give you an accurate picture of your portfolio's performance without constant maintenance.\n\nFor Indian investors, tools like Zerodha Console, INDmoney, and Smallcase provide good built-in dashboards. Advanced users can build custom Google Sheets connected to the Kite API or use portfolio tracking apps that aggregate across brokers.",
    concepts: [
      { term: "API (Application Programming Interface)", definition: "A way for software to talk to software. Broker APIs like Zerodha Kite API let you fetch your portfolio data into external tools." },
      { term: "XIRR", definition: "Extended Internal Rate of Return. The correct metric for measuring portfolio returns when investments happen at different times. More accurate than simple returns for SIPs or irregular investing." },
      { term: "Portfolio rebalancing", definition: "Periodically buying/selling to restore your target asset allocation. Removes emotion from the process and ensures you aren't accidentally over-concentrated in one sector." },
      { term: "Webhook", definition: "A push notification from one system to another when an event happens — e.g., your broker notifying your tracking sheet when a trade executes." },
    ],
    keyPoints: [
      "Track XIRR, not absolute returns or simple percentage — it accounts for timing of investments accurately.",
      "Zerodha Console gives free XIRR and P&L reports — use it before building custom solutions.",
      "Set up price alerts for your holdings. Most broker apps support this — use it to track stop-loss levels without constant monitoring.",
      "Automate your SIP date reminders so you never miss a monthly investment due to market fear.",
      "Review portfolio allocation quarterly, not daily. Daily tracking leads to emotional over-trading.",
    ],
    practicalTip:
      "Create a simple Google Sheet with columns: Stock, Buy Price, Quantity, Current Price (pull from a data source), Current Value, Gain/Loss %. Add a 'Notes' column for your investment thesis. When you want to sell, re-read your own thesis first — it forces a deliberate decision.",
    commonMistake:
      "Checking your portfolio value every day. Research consistently shows that more frequent monitoring leads to worse decisions. Set a weekly or monthly review schedule and stick to it.",
  },

  "ch-ai-005": {
    chapterId: "ch-ai-005",
    title: "AI for News & Sentiment Analysis",
    summary:
      "Markets react to information — and most retail investors consume that information too slowly. By the time a news article is read and acted upon, the market has typically already priced in the obvious interpretation. Sentiment analysis tools help you understand the information flow faster, identify when sentiment diverges from fundamentals, and avoid panic-driven decisions.\n\nAI-powered sentiment tools scan thousands of news articles, social media posts, and analyst reports to generate a real-time sentiment score for individual stocks and sectors.",
    concepts: [
      { term: "Sentiment analysis", definition: "Using AI to classify text as positive, negative, or neutral about a stock or market. A high volume of negative sentiment can precede price declines." },
      { term: "Market sentiment", definition: "The overall mood of investors — bullish (optimistic) or bearish (pessimistic). Sentiment often diverges from fundamentals in both directions." },
      { term: "Contrarian investing", definition: "Buying when sentiment is extremely negative and selling when it's extremely positive. Based on the idea that crowds are often wrong at extremes." },
      { term: "News catalyst", definition: "A specific event (earnings miss, regulatory change, management change) that triggers a sharp price move. Identifying catalysts before they are priced in is the goal of news analysis." },
    ],
    keyPoints: [
      "ET Markets, Moneycontrol, and NSE announcement feeds are the primary sources for Indian market news.",
      "Negative sentiment often creates buying opportunities — but only if fundamentals are intact.",
      "Distinguish between noise (market gossip) and signal (earnings, management guidance, regulatory filings).",
      "Management commentary in earnings calls is often more revealing than the numbers themselves.",
      "Avoid acting on social media sentiment alone — it's the noisiest and least reliable source.",
    ],
    practicalTip:
      "Set up Google Alerts for your top 5 holdings using '[Company name] + India + financial'. You'll get email digests of relevant news. Pair this with NSE's EDGAR filing alerts to catch company announcements within minutes.",
    commonMistake:
      "Reacting immediately to news headlines. Read the full article and the company's official announcement before deciding. Headlines are often misleading — the detail often changes the picture completely.",
  },

  "ch-ai-006": {
    chapterId: "ch-ai-006",
    title: "Building Your Research Workflow",
    summary:
      "The difference between consistently good investors and inconsistent ones is often not intelligence — it's process. A structured research workflow ensures you examine every important dimension of a business before committing capital, and it makes you accountable to your own standards over time.\n\nAI tools dramatically speed up each step of the workflow but work best when embedded in a clear sequence — starting with business understanding, moving to financial analysis, and only then reaching a valuation and decision.",
    concepts: [
      { term: "Investment thesis", definition: "A clear written statement of why you are investing in a company: what tailwinds it has, what competitive advantage it holds, and what could go wrong." },
      { term: "Research checklist", definition: "A repeatable list of questions to answer before every investment decision. Eliminates selective attention and cognitive shortcuts." },
      { term: "Circle of competence", definition: "Coined by Warren Buffett — invest only in businesses you genuinely understand. AI can help you understand faster but can't expand your circle for you." },
      { term: "Moat analysis", definition: "Evaluating a company's sustainable competitive advantage: is it brand, cost, switching costs, or network effects? Moat determines pricing power and long-term ROE." },
    ],
    keyPoints: [
      "Write your investment thesis in 3-5 sentences before buying. If you can't explain it simply, you don't understand it.",
      "Use a checklist: business model → competitive moat → financials → valuation → risks → position size.",
      "AI accelerates steps 1-3 (business, moat, financials). Steps 4-6 still require your own judgement.",
      "Document every decision with a date. Reviewing past decisions — right and wrong — is how you improve.",
      "Set a 'kill criteria': define the conditions under which you would exit before you enter the position.",
    ],
    practicalTip:
      "Create a one-page investment memo for each stock you buy: business in 2 sentences, why now in 1 sentence, 3 things that could go wrong, target price, stop-loss level. Review it each quarter. Over time, this document collection becomes your personal research database.",
    commonMistake:
      "Skipping the business understanding step and going straight to valuation. Valuation without context is meaningless — a low P/E on a structurally declining business is a trap, not an opportunity.",
  },

  // ── Stock Market Basics ───────────────────────────────────────────────────

  "ch-stocks-001": {
    chapterId: "ch-stocks-001",
    title: "How Indian Stock Markets Work",
    summary:
      "The Indian equity market operates across two exchanges: the Bombay Stock Exchange (BSE), Asia's oldest, and the National Stock Exchange (NSE), India's largest by daily volume. Both operate electronically, with trading sessions running Monday to Friday from 9:15 AM to 3:30 PM IST.\n\nWhen you buy a share, you are buying a proportional ownership in a company. The price reflects the collective opinion of millions of participants about what that ownership is worth today — which is constantly changing as new information arrives.",
    concepts: [
      { term: "BSE (Bombay Stock Exchange)", definition: "Asia's oldest stock exchange, founded in 1875. Tracks the Sensex (30 large-cap companies). ISIN codes from BSE are used for company identification." },
      { term: "NSE (National Stock Exchange)", definition: "India's largest exchange by volume, founded in 1992. Tracks the Nifty 50 index. Most derivatives trading in India happens on NSE." },
      { term: "SEBI", definition: "Securities and Exchange Board of India. The regulatory body that governs all market participants — exchanges, brokers, listed companies, and investors." },
      { term: "Demat account", definition: "Electronic account that holds shares in digital form. Required to buy/sell stocks in India. Maintained by depositories NSDL or CDSL." },
      { term: "Market capitalisation", definition: "Total value of a company's outstanding shares (share price × total shares). Classifies companies as large-cap (>₹20,000 crore), mid-cap, or small-cap." },
    ],
    keyPoints: [
      "India has two main exchanges — BSE and NSE. For most retail investors, they are interchangeable for equity trading.",
      "Shares settle in T+1 (trade day plus one business day) in India since 2023.",
      "You need a PAN, Aadhaar, and a Demat+trading account to invest in Indian equities.",
      "SEBI protects investor rights — use the SCORES portal to file complaints against brokers.",
      "Index funds that track Nifty 50 or Sensex are the simplest way to participate in Indian market growth.",
    ],
    practicalTip:
      "Open a Demat account with a discount broker (Zerodha, Groww, or Upstox) using your Aadhaar and PAN. Complete the KYC process online — it takes about 20 minutes. Start with ₹500 in a Nifty 50 index fund before touching individual stocks.",
    commonMistake:
      "Confusing BSE and NSE as two different investments. The same company is listed on both — prices are nearly identical. You don't need accounts on both exchanges to invest in Indian stocks.",
  },

  "ch-stocks-002": {
    chapterId: "ch-stocks-002",
    title: "Reading a Balance Sheet",
    summary:
      "The balance sheet is a snapshot of a company's financial health at a specific point in time. It shows what the company owns (assets), what it owes (liabilities), and what remains for shareholders (equity). The fundamental equation — Assets = Liabilities + Equity — must always hold.\n\nFor investors, the balance sheet reveals capital structure (how the business is funded), liquidity (ability to meet short-term obligations), and asset quality (whether assets generate returns or are just inflating the balance sheet).",
    concepts: [
      { term: "Current assets", definition: "Assets that will be converted to cash within 12 months — cash, receivables, inventory. A high current asset ratio indicates short-term financial health." },
      { term: "Current liabilities", definition: "Obligations due within 12 months — trade payables, short-term borrowings. Compare against current assets to assess liquidity." },
      { term: "Current ratio", definition: "Current assets divided by current liabilities. A ratio above 1.5 generally indicates the company can meet short-term obligations comfortably." },
      { term: "Goodwill", definition: "An intangible asset arising from acquisitions — the premium paid above book value. Inflates balance sheets and should be scrutinised carefully." },
      { term: "Shareholders' equity", definition: "Total assets minus total liabilities. The net worth belonging to shareholders. Growing equity over time indicates value creation." },
    ],
    keyPoints: [
      "Check the debt level first: high debt relative to equity increases risk during downturns.",
      "Look for growing shareholders' equity year-over-year — it signals the business retains and grows value.",
      "Goodwill and intangibles are often the riskiest line items — they can be written down suddenly.",
      "A company with strong cash and low debt has more strategic flexibility (acquisitions, dividends, buybacks).",
      "Compare balance sheet metrics against peers in the same industry — capital intensity varies widely.",
    ],
    practicalTip:
      "On Screener.in, open any company and click 'Balance Sheet'. Track three numbers over 5 years: total borrowings, shareholders' equity, and cash. If borrowings are rising faster than equity while cash is falling, the business is relying on debt to fund itself — a red flag.",
    commonMistake:
      "Focusing only on asset size and ignoring asset quality. A large balance sheet filled with receivables, inventory, or goodwill may not be as strong as it appears — these items can depreciate or prove uncollectable.",
  },

  "ch-stocks-003": {
    chapterId: "ch-stocks-003",
    title: "Key Financial Ratios Explained",
    summary:
      "Financial ratios distil complex financial statements into comparable numbers. They let you compare companies of different sizes, track a single company over time, and quickly identify outliers — both positive and negative. No single ratio tells the whole story, but together they paint a clear picture of financial health and valuation.\n\nFor Indian market analysis, five ratios cover 80% of what you need: P/E, ROE, D/E, Current Ratio, and Free Cash Flow yield.",
    concepts: [
      { term: "P/E ratio (Price-to-Earnings)", definition: "Share price divided by earnings per share. Tells you how much you're paying for each rupee of earnings. High P/E = growth expectations or overvaluation." },
      { term: "ROE (Return on Equity)", definition: "Net profit divided by shareholders' equity. Measures management's efficiency in generating profit from shareholders' capital. Best-in-class companies sustain ROE > 20%." },
      { term: "Free Cash Flow (FCF)", definition: "Cash generated from operations minus capital expenditure. The actual cash a business creates for owners — often more reliable than reported profit." },
      { term: "EV/EBITDA", definition: "Enterprise Value divided by EBITDA (earnings before interest, tax, depreciation, and amortisation). Better than P/E for comparing capital-intensive businesses or those with different debt levels." },
      { term: "Interest coverage ratio", definition: "EBIT divided by interest expense. Measures how easily a company can service its debt. Ratio below 1.5 is a serious warning sign." },
    ],
    keyPoints: [
      "Never use a single ratio to evaluate a stock. P/E alone is meaningless without growth context.",
      "ROE > 15% consistently over 5+ years is a sign of a quality business with a durable advantage.",
      "High P/E is only justified if earnings are growing fast enough to close the gap quickly (PEG ratio).",
      "Free cash flow is harder to manipulate than reported profit — prioritise it in your analysis.",
      "Compare ratios within the same sector — a bank and an FMCG company have completely different ratio benchmarks.",
    ],
    practicalTip:
      "Use Screener.in's 10-year financial data to calculate average ROE over a full market cycle (including 2020 COVID crash). If a company maintained ROE > 15% even during the worst year, that's genuine quality — not just a bull-market illusion.",
    commonMistake:
      "Comparing P/E ratios across different sectors. A P/E of 15 is expensive for a PSU bank but cheap for a consumer brand. Always benchmark against sector peers and the company's own historical P/E range.",
  },

  "ch-stocks-004": {
    chapterId: "ch-stocks-004",
    title: "Order Types and Trade Execution",
    summary:
      "Understanding order types is the difference between executing at the price you want and getting an unpleasant surprise. Each order type has a specific use case — market orders for speed, limit orders for price control, and stop-loss orders for risk management.\n\nIn the Indian equity market, most retail investors only need to master three: market orders, limit orders, and stop-loss orders. Everything else is for active traders with specific tactical needs.",
    concepts: [
      { term: "Market order", definition: "An instruction to buy or sell immediately at the best available price. Guaranteed execution but price may differ from the last traded price, especially in illiquid stocks." },
      { term: "Limit order", definition: "An instruction to buy or sell at a specific price or better. Gives price control but may not execute if the market doesn't reach your price." },
      { term: "Stop-loss order", definition: "An order that triggers a sell when the price falls to a specified level. Protects against large losses by automating the exit decision." },
      { term: "Slippage", definition: "The difference between the price you expected and the price you actually got. Common in illiquid stocks during high-volatility periods." },
      { term: "GTT (Good Till Triggered)", definition: "A persistent order that stays active until triggered or cancelled — useful for setting buy levels below current price or stop-loss levels without daily management." },
    ],
    keyPoints: [
      "Always use limit orders for illiquid stocks — market orders in thin markets can execute at dramatically different prices.",
      "Set a stop-loss for every trade before entering. Define the maximum loss you're willing to accept upfront.",
      "GTT orders on Zerodha let you set a 'buy below' price for months — useful for patient long-term buying.",
      "After-market orders (AMO) let you place orders for next-day execution outside market hours.",
      "Brokerage and taxes (STT, GST, SEBI turnover fee) reduce returns — factor them into your trade decisions.",
    ],
    practicalTip:
      "For every stock purchase, immediately place a GTT stop-loss order at 15-20% below your buy price. This forces you to define your risk before entry and automates the exit if the thesis breaks down. You don't need to watch prices all day.",
    commonMistake:
      "Using market orders on small-cap or mid-cap stocks during volatile sessions. The spread between bid and ask can be wide — you could buy at 3-5% above the last traded price without realising it. Always check the order book depth first.",
  },

  "ch-stocks-005": {
    chapterId: "ch-stocks-005",
    title: "Building a Simple Portfolio",
    summary:
      "Portfolio construction is where research meets position sizing. Even if every stock you pick is a winner, poor allocation — too concentrated in one company or sector — can destroy returns when one bet goes wrong.\n\nFor most retail investors, a simple 3-layer portfolio (core index + quality businesses + speculative ideas) provides adequate diversification without requiring constant management.",
    concepts: [
      { term: "Diversification", definition: "Spreading investments across multiple assets to reduce the impact of any single loss. Effective diversification reduces risk without proportionally reducing returns." },
      { term: "Asset allocation", definition: "The percentage split between asset classes — equities, debt, gold, and cash. The right allocation depends on your time horizon and risk tolerance." },
      { term: "Position sizing", definition: "Deciding how much capital to allocate to each investment. Typically expressed as a percentage of total portfolio. Most investors cap individual stocks at 5-10%." },
      { term: "Rebalancing", definition: "Periodically restoring your target allocation by selling outperformers and buying underperformers. Forces disciplined profit-taking and buying low." },
      { term: "Correlation", definition: "How closely two investments move together. A well-diversified portfolio holds assets with low or negative correlations to each other." },
    ],
    keyPoints: [
      "Own 12-20 stocks for reasonable diversification. Fewer than 8 is concentrated; more than 25 dilutes your best ideas.",
      "No single stock should exceed 10% of your portfolio without exceptional conviction and understanding.",
      "Core holding: 40-50% in Nifty 50 index fund for stability and market returns at zero research cost.",
      "Sector concentration is a hidden risk — owning 5 banking stocks isn't diversification.",
      "Review and rebalance once per quarter, not more often. Frequent rebalancing creates tax events and trading costs.",
    ],
    practicalTip:
      "Write your entire portfolio on one page: stock name, % allocation, investment thesis in one sentence, and entry date. If any single stock occupies more than 15% of the page's weight, it probably occupies too much of your portfolio too. This visual exercise makes concentration obvious.",
    commonMistake:
      "Thinking more stocks equals more diversification. Owning 30 mid-cap stocks in the same sector offers very little diversification benefit. True diversification comes from uncorrelated assets and sectors, not just quantity.",
  },

  // ── Technical Analysis Foundations ────────────────────────────────────────

  "ch-ta-001": {
    chapterId: "ch-ta-001",
    title: "Reading Candlestick Charts",
    summary:
      "Candlestick charts were invented in 18th century Japan by rice traders and remain one of the most information-dense visual tools in trading. Each candle represents four price points for a given time period: open, high, low, and close. The body shows the range between open and close; the wicks show the intra-period extremes.\n\nLearning to read candlestick patterns fluently takes time, but a handful of high-reliability patterns cover most situations a swing trader will encounter.",
    concepts: [
      { term: "Candlestick body", definition: "The rectangular part of the candle showing the open-to-close range. A green (or white) body means close > open (bullish). A red (or black) body means close < open (bearish)." },
      { term: "Wicks / Shadows", definition: "The thin lines above and below the body. Upper wick = highest price; lower wick = lowest price. Long wicks show strong rejection of extreme prices." },
      { term: "Doji", definition: "A candle where open and close are nearly equal, forming a cross shape. Indicates indecision between buyers and sellers — often precedes a reversal." },
      { term: "Hammer", definition: "A candle with a small body at the top and a long lower wick. Found at the bottom of downtrends — buyers stepped in to reject the lower price." },
      { term: "Engulfing pattern", definition: "Two-candle pattern where the second candle's body completely engulfs the first. Bullish engulfing at support = strong reversal signal; bearish engulfing at resistance = reversal down." },
    ],
    keyPoints: [
      "Always read candles in the context of the trend and surrounding price action — a single candle means little in isolation.",
      "Long lower wicks at support levels are high-probability signals — they show sellers tried to push lower and failed.",
      "A series of consecutive red candles with decreasing length (narrowing bodies) often signals exhaustion of the downtrend.",
      "Use daily charts for trend analysis; 15-minute or hourly charts for entry timing.",
      "Volume confirms candlestick signals — a bullish engulfing with 3x average volume is far more reliable than one with below-average volume.",
    ],
    practicalTip:
      "Pick one stock you know well and review its daily chart for the past year. Identify every major doji, hammer, and engulfing pattern. Mark whether each led to the expected move. This 'pattern audit' builds intuition faster than reading theory.",
    commonMistake:
      "Trading every candlestick pattern you see. Most patterns have a 55-65% success rate at best — only high-quality setups at key support/resistance levels with volume confirmation are worth acting on.",
  },

  "ch-ta-002": {
    chapterId: "ch-ta-002",
    title: "Support, Resistance and Trend Lines",
    summary:
      "Support and resistance are the most fundamental concepts in technical analysis. Support is a price level where demand has historically been strong enough to stop a decline; resistance is where supply has consistently capped a rally. These levels exist because human psychology is consistent — traders remember prices where they previously bought, sold, or got stopped out.\n\nTrend lines connect a series of higher lows (uptrend) or lower highs (downtrend) to visualise the dominant directional bias. A break of a significant trend line often signals a change in market structure.",
    concepts: [
      { term: "Support level", definition: "A price zone where buying interest is historically strong enough to halt declines. The more times a level has been tested and held, the stronger it is." },
      { term: "Resistance level", definition: "A price zone where selling pressure is historically strong enough to cap rallies. Old resistance often becomes new support after a breakout." },
      { term: "Role reversal", definition: "When support breaks and becomes resistance, or resistance breaks and becomes support. One of the most reliable phenomena in technical analysis." },
      { term: "Trend line", definition: "A straight line connecting two or more price lows in an uptrend (or highs in a downtrend). The more points touching the line, the more significant it is." },
      { term: "Breakout", definition: "When price moves decisively above resistance or below support. A valid breakout typically has above-average volume and follow-through in the subsequent sessions." },
    ],
    keyPoints: [
      "Round numbers (₹100, ₹500, ₹1000) act as psychological support/resistance for Indian stocks.",
      "52-week highs and lows are the most watched support/resistance levels — institutional orders cluster there.",
      "The more times a level is tested without breaking, the more significant the eventual break will be.",
      "Draw trend lines on weekly charts for major trends; use daily charts for trading-level precision.",
      "False breakouts (price briefly breaks a level then reverses) are common — wait for a daily close above/below before acting.",
    ],
    practicalTip:
      "On any stock chart, mark the two most significant support and resistance levels. Then set price alerts at those levels on your broker app. When the price approaches, you're notified — then you decide in advance what action you'll take, rather than reacting emotionally in the moment.",
    commonMistake:
      "Drawing too many lines. A chart covered in lines provides false confidence and contradictory signals. Identify the 2-3 most significant levels and ignore the noise in between.",
  },

  "ch-ta-003": {
    chapterId: "ch-ta-003",
    title: "Moving Averages in Practice",
    summary:
      "A moving average smooths out price noise by calculating the average price over a specified period. The 20-day, 50-day, and 200-day moving averages are the most widely watched in Indian equity markets — and because so many traders watch them, they become self-fulfilling to some degree.\n\nMoving averages serve two primary purposes: trend direction identification and dynamic support/resistance levels. When price is above the 200-day MA, the long-term trend is up; when below, it's down.",
    concepts: [
      { term: "Simple Moving Average (SMA)", definition: "Average of closing prices over N periods. Each day gets equal weight. The 200-day SMA is the most important long-term trend indicator." },
      { term: "Exponential Moving Average (EMA)", definition: "Moving average that gives more weight to recent prices. Responds faster to price changes than SMA. Preferred by shorter-term traders." },
      { term: "Golden Cross", definition: "When the 50-day MA crosses above the 200-day MA. A bullish signal indicating a potential long-term uptrend. Widely watched by institutional investors." },
      { term: "Death Cross", definition: "When the 50-day MA crosses below the 200-day MA. A bearish signal. Often followed by institutional selling." },
      { term: "Mean reversion", definition: "The tendency for price to return to its moving average after deviating significantly. A stock trading 30% above its 200 MA may be prone to correction." },
    ],
    keyPoints: [
      "The 200-day MA is the most important single indicator for identifying whether a stock is in a bull or bear phase.",
      "Price bouncing off a rising 20-day EMA in an uptrend is a high-probability long entry setup.",
      "Moving averages are lagging indicators — they react to price, they don't predict it.",
      "In trending markets, MAs work well. In choppy, range-bound markets, they give false signals frequently.",
      "The slope of the moving average matters as much as the price-MA relationship. A flat 200-day MA means no trend.",
    ],
    practicalTip:
      "Add the 50-day and 200-day SMA to your watchlist stocks. Before any trade, check whether price is above or below both MAs. Only buy stocks where price is above both — this simple filter alone eliminates most losing trades in trending markets.",
    commonMistake:
      "Adding too many moving averages to the chart. Three or four MAs on a single chart create a confusing web. Use a maximum of two — one for trend direction (200-day) and one for entry timing (20 or 50-day).",
  },

  "ch-ta-004": {
    chapterId: "ch-ta-004",
    title: "RSI and Momentum Indicators",
    summary:
      "Momentum indicators measure the rate of price change rather than the price itself. They tell you not just which direction price is moving, but how fast — and whether that speed is increasing or decreasing. RSI (Relative Strength Index) is the most widely used momentum indicator and one of the most useful for identifying overbought/oversold conditions and trend strength.\n\nMomentum divergence — where price makes a new high but RSI makes a lower high — is one of the most reliable early warning signals for trend reversals in Indian equities.",
    concepts: [
      { term: "RSI (Relative Strength Index)", definition: "An oscillator (0-100) that measures the speed and magnitude of recent price changes. Readings above 70 suggest overbought conditions; below 30 suggests oversold." },
      { term: "MACD (Moving Average Convergence Divergence)", definition: "Shows the relationship between two EMAs (typically 12 and 26-day). A bullish signal when the MACD line crosses above the signal line with rising histogram bars." },
      { term: "Overbought", definition: "When RSI exceeds 70 — price has risen so fast it may be due for a pause or pullback. Not a sell signal by itself in strong uptrends." },
      { term: "Divergence", definition: "When price and an indicator move in opposite directions. Bearish divergence (price new high, RSI lower high) signals weakening momentum — a potential reversal warning." },
      { term: "Momentum", definition: "The rate of acceleration of a price move. High momentum means price is moving fast; declining momentum (even with rising price) can signal the move is maturing." },
    ],
    keyPoints: [
      "RSI divergence is more useful than RSI absolute levels — watch for divergence at key support/resistance.",
      "In strong uptrends, RSI can stay above 70 for weeks. Don't short just because RSI is 'overbought'.",
      "The 50 level on RSI acts as a midpoint — RSI holding above 50 confirms an uptrend; below 50 confirms downtrend.",
      "MACD crossovers work best on daily charts in trending stocks — they produce too many false signals in choppy markets.",
      "Always confirm momentum signals with price action and volume — indicators are secondary, price is primary.",
    ],
    practicalTip:
      "Scan for Nifty 50 stocks where RSI has corrected from above 70 back to the 40-50 zone while price holds above its 50-day MA. This combination — RSI reset in an uptrend — is a classic high-probability entry setup used by professional momentum traders.",
    commonMistake:
      "Using RSI as a standalone entry trigger. RSI at 30 (oversold) is not a buy signal — it's often a warning that selling pressure is intense. Many stocks that appear oversold on RSI continue to fall for weeks. Context is everything.",
  },

  "ch-ta-005": {
    chapterId: "ch-ta-005",
    title: "Volume and Market Breadth",
    summary:
      "Price tells you what happened; volume tells you how much conviction was behind it. A breakout on double the average volume is a very different event from the same breakout on half the average volume. Volume is the closest thing to real-time data about institutional participation — and institutions move markets.\n\nMarket breadth indicators look beyond individual stocks to measure the health of the overall market. A Nifty 500 advance/decline ratio below 0.5 during a rally means most stocks are falling even as the index rises — a warning sign of internal weakness.",
    concepts: [
      { term: "Volume", definition: "The number of shares traded in a given period. High volume on a price move validates the move; low volume suggests it may not sustain." },
      { term: "On-Balance Volume (OBV)", definition: "A cumulative volume indicator. Rising OBV means volume is higher on up days than down days — accumulation. Divergence from price is a signal." },
      { term: "Advance/Decline ratio", definition: "Number of advancing stocks divided by declining stocks. A ratio above 1.5 indicates healthy broad participation in a rally." },
      { term: "Volume spike", definition: "A day where volume is 2-3x the 20-day average. Often signals a climactic move, institutional accumulation, or panic selling at a bottom." },
      { term: "Distribution", definition: "When price is rising but volume on down days consistently exceeds volume on up days — institutions are quietly selling into strength." },
    ],
    keyPoints: [
      "Volume should confirm every breakout. A breakout without above-average volume has a much higher failure rate.",
      "The highest-volume day in a downtrend often marks the selling climax — a potential bottom.",
      "Watch the NSE advance/decline ratio daily. If Nifty 50 rises but more stocks are falling than rising, the rally is narrow.",
      "High volume at resistance indicates strong selling pressure; high volume at support indicates strong buying.",
      "Declining volume in an uptrend signals a loss of momentum — the rally is running out of buyers.",
    ],
    practicalTip:
      "Add a 20-day average volume line to your stock charts. Before acting on any breakout or breakdown, check if the volume bar that day is visually taller than the 20-day average. If it's not, wait for confirmation rather than chasing the move.",
    commonMistake:
      "Ignoring volume entirely and focusing only on price patterns. Many chart patterns fail precisely because they lack volume confirmation. Every pattern is more reliable when accompanied by expanding volume on the decisive day.",
  },

  "ch-ta-006": {
    chapterId: "ch-ta-006",
    title: "Chart Patterns That Work",
    summary:
      "Chart patterns are recurring formations in price action that have shown statistically significant predictive value across markets and time periods. They exist because human psychology — fear, greed, hope, and regret — is consistent. The same emotional dynamics that formed a head-and-shoulders pattern in 1950 form it today in Indian mid-caps.\n\nThe most reliable patterns in Indian markets are those that form over weeks to months on daily or weekly charts — not intraday micro-patterns that produce mostly noise.",
    concepts: [
      { term: "Head and Shoulders", definition: "A reversal pattern with three peaks: a central high (head) flanked by two lower highs (shoulders). A break below the 'neckline' connecting the two troughs signals a trend reversal." },
      { term: "Cup and Handle", definition: "A bullish continuation pattern. Price forms a rounded bottom (cup) followed by a brief pullback (handle) before breaking out to new highs. Often seen in strong trending stocks." },
      { term: "Double Top / Double Bottom", definition: "Two roughly equal highs (or lows) separated by a moderate pullback. A double top at resistance is bearish; a double bottom at support is bullish." },
      { term: "Triangle patterns", definition: "Ascending, descending, or symmetrical — all involve converging highs and lows showing a tightening range. A breakout typically follows in the direction of the prior trend." },
      { term: "Flag pattern", definition: "A sharp move (flagpole) followed by a parallel, slightly counter-trend consolidation (flag). One of the most reliable continuation patterns in trending stocks." },
    ],
    keyPoints: [
      "The longer the pattern takes to form, the larger the expected move after breakout — a 6-month base is more significant than a 6-day base.",
      "Measure the expected target: for most patterns, project the height of the pattern from the breakout point.",
      "Failed patterns are trading signals in themselves — a pattern that fails often moves violently in the opposite direction.",
      "Combine patterns with sector analysis: a cup-and-handle in a leading sector has a much higher success rate.",
      "Wait for the actual breakout with volume — don't anticipate patterns. Many good-looking patterns fail before completion.",
    ],
    practicalTip:
      "Use TradingView (free tier) to scan Indian stocks for cup-and-handle patterns on weekly charts. Filter by stocks that are in sectors with positive momentum (check Nifty sectoral indices). The combination of a quality pattern in a leading sector dramatically improves hit rate.",
    commonMistake:
      "Force-fitting patterns onto charts. Not every consolidation is a cup-and-handle; not every three-peak formation is a head-and-shoulders. Be strict about pattern requirements — irregular, unclear formations are not tradeable.",
  },

  "ch-ta-007": {
    chapterId: "ch-ta-007",
    title: "Building a Trading Setup",
    summary:
      "A trading setup is a specific, repeatable combination of conditions that defines your entry, stop-loss, and target before you execute a single trade. Professional traders don't guess — they execute pre-defined setups and manage risk precisely. Without a defined setup, every trade is an emotional gamble.\n\nThe goal is to build a setup with a positive expectancy: even with a 50% win rate, if your winners are twice the size of your losers, you have a profitable system over the long run.",
    concepts: [
      { term: "Trading setup", definition: "A specific combination of technical conditions that must be present before entering a trade. Removes discretion and emotion from the entry decision." },
      { term: "Risk-reward ratio", definition: "The ratio of potential profit to potential loss. A trade with ₹500 risk and ₹1500 target has a 3:1 risk-reward. Aim for minimum 2:1 on all trades." },
      { term: "Expectancy", definition: "The average profit per trade over many trades, accounting for win rate and win/loss size. Positive expectancy is the only requirement for a sustainable trading system." },
      { term: "Position sizing", definition: "Calculating how many shares to buy based on your risk per trade and the distance to your stop-loss. Keeps risk consistent regardless of stock price." },
      { term: "Trade journal", definition: "A record of every trade: setup conditions, entry, stop, target, result, and lessons. The most powerful tool for improving performance over time." },
    ],
    keyPoints: [
      "Define your setup in writing before trading it. If you can't explain it in 3 sentences, it's not defined enough.",
      "Never risk more than 1-2% of your capital on a single trade — consistency of process matters more than any single trade.",
      "Calculate position size mathematically: (Capital × Risk %) / (Entry - Stop Loss) = number of shares.",
      "Keep a trade journal. After 50 trades, patterns of mistakes become visible — you can't see them trade by trade.",
      "Backtest your setup on at least 2 years of historical charts before trading with real money.",
    ],
    practicalTip:
      "Write your trading setup as a checklist with 5-7 conditions. Before every trade, physically check each condition. If 2 or more are absent, skip the trade. This forces discipline and quickly reveals which conditions matter most and which you're rationalising around.",
    commonMistake:
      "Changing your setup after a losing streak. Every setup has losing periods. Changing it prematurely means you never find out if it actually works long-term. Give any setup a minimum of 30 trades before evaluating its statistical validity.",
  },

  // ── Trading Psychology ─────────────────────────────────────────────────────

  "ch-psych-001": {
    chapterId: "ch-psych-001",
    title: "Why Smart People Make Bad Trades",
    summary:
      "Intelligence does not protect against bad trading decisions — in fact, it can make things worse. Intelligent people are better at constructing post-hoc rationalisations for emotional decisions. The financial markets are one of the few environments where being smarter and more analytical, without the right psychological framework, can actively hurt your performance.\n\nThe core problem is that human brains evolved for a world where quick, pattern-based decisions were essential for survival. In that world, overconfidence was beneficial. In financial markets, those same instincts systematically destroy capital.",
    concepts: [
      { term: "Cognitive bias", definition: "A systematic error in thinking that affects judgement and decision-making. In trading, biases cause predictable, repeatable mistakes." },
      { term: "Confirmation bias", definition: "The tendency to seek out information that confirms your existing view while ignoring contradicting evidence. Extremely common in stock research." },
      { term: "Overconfidence bias", definition: "Overestimating the accuracy of your own predictions. Studies show that traders who express 'high confidence' in a trade are right only slightly more often than those who are less certain." },
      { term: "Sunk cost fallacy", definition: "Continuing to hold a losing position because of money already invested, rather than evaluating the future prospects objectively. 'I can't sell at a loss' is this fallacy in action." },
      { term: "Narrative fallacy", definition: "Constructing a compelling story to explain random events. Markets are full of compelling narratives — but correlation is not causation." },
    ],
    keyPoints: [
      "Your greatest trading enemy is not the market — it's your own psychology under uncertainty and pressure.",
      "Intelligence without emotional discipline leads to sophisticated rationalisations for bad decisions.",
      "The first step to improvement is recognising your own recurring biases — keep a trade journal to find them.",
      "Process-driven trading (following a defined system) is the only reliable way to override psychological instincts.",
      "Bad trades followed by bad recoveries are more damaging than the original bad trade. Most account blow-ups start with one emotional decision.",
    ],
    practicalTip:
      "For your next 5 trades, write your reasons for entry before executing. After the trade closes, review whether you followed your reasoning or deviated. Most traders discover they deviate far more than they think — this self-awareness is the foundation of improvement.",
    commonMistake:
      "Thinking that learning more strategies will fix psychological problems. Knowing 10 strategies but lacking discipline to follow any of them is worse than knowing 1 strategy and executing it consistently. Fix psychology first.",
  },

  "ch-psych-002": {
    chapterId: "ch-psych-002",
    title: "Understanding Your Cognitive Biases",
    summary:
      "Behavioural finance research has catalogued dozens of cognitive biases that affect investor decisions. You don't need to memorise all of them — but you do need to deeply understand the five that affect traders most frequently and most severely: confirmation bias, loss aversion, recency bias, anchoring, and the disposition effect.\n\nThe goal isn't to eliminate biases (neurologically impossible) but to build systems that prevent them from driving decisions at critical moments.",
    concepts: [
      { term: "Loss aversion", definition: "The pain of losing ₹1000 feels roughly twice as intense as the pleasure of gaining ₹1000. This asymmetry causes investors to hold losers too long and sell winners too early." },
      { term: "Recency bias", definition: "Overweighting recent events in predictions. After a bull market, investors expect it to continue indefinitely. After a crash, they avoid stocks entirely." },
      { term: "Anchoring", definition: "Over-relying on the first piece of information encountered. 'I bought it at ₹500 so I won't sell below ₹500' — the market doesn't care what you paid." },
      { term: "Disposition effect", definition: "The tendency to sell winners too early and hold losers too long — the opposite of what good trading requires. A direct result of loss aversion combined with regret aversion." },
      { term: "Availability heuristic", definition: "Judging probability by how easily an example comes to mind. After a high-profile corporate fraud, investors overestimate the risk of all mid-cap companies." },
    ],
    keyPoints: [
      "Loss aversion is why stop-losses are psychologically difficult but mathematically essential.",
      "The disposition effect is responsible for most retail investors' worst portfolio outcomes — they sell their best stocks too early.",
      "Anchoring to your purchase price is irrelevant — the stock has no idea what you paid. Evaluate each position on its future prospects.",
      "Recency bias makes investors most bullish at tops and most bearish at bottoms — the exact inverse of optimal behaviour.",
      "Awareness alone does not cure biases — structured processes (checklists, pre-trade rules) are required.",
    ],
    practicalTip:
      "Create a 'bias check' question for your three most dangerous biases. Before every buy/sell decision, answer each question in writing. For loss aversion: 'Would I buy this stock today if I didn't already own it?' For anchoring: 'What is my price target based on future cash flows, not what I paid?'",
    commonMistake:
      "Thinking awareness of a bias makes you immune to it. Daniel Kahneman, who won the Nobel Prize for discovering these biases, has said he still makes decisions driven by them. The solution is systems, not self-awareness alone.",
  },

  "ch-psych-003": {
    chapterId: "ch-psych-003",
    title: "Managing Losses Without Revenge Trading",
    summary:
      "Every trader loses. The difference between those who survive and those who don't is not the frequency of losses — it's how they respond to them. Revenge trading, where an emotional trader immediately takes larger or riskier positions to 'make back' losses, is one of the most common account-destroying behaviours in retail trading.\n\nEffective loss management requires pre-trade planning (knowing your maximum loss before entering), in-trade discipline (not moving stop-losses), and post-trade protocol (scheduled review, not reactive adjustment).",
    concepts: [
      { term: "Revenge trading", definition: "Taking immediate subsequent trades to recover recent losses, typically with larger size and less analysis. Driven by emotional pain, not logical opportunity." },
      { term: "Drawdown", definition: "The peak-to-trough decline in account value. A 20% drawdown requires a 25% gain just to return to breakeven. Limiting drawdown is mathematically critical to long-term survival." },
      { term: "Maximum daily loss rule", definition: "A personal rule that stops all trading when losses exceed a predetermined level for that day. Prevents compounding emotional decision-making into catastrophic loss." },
      { term: "Stop-loss", definition: "A pre-defined price level at which you exit a losing trade. The psychological discipline of respecting stop-losses is the foundation of professional risk management." },
      { term: "Account risk rule", definition: "Never risking more than 1-2% of total capital on a single trade. Ensures that even a streak of 10 consecutive losses doesn't destroy the account." },
    ],
    keyPoints: [
      "After a losing trade, take a 15-30 minute break before considering any new position.",
      "Implement a daily stop-out rule: if losses exceed 3-5% of account value in one day, stop trading that day.",
      "Never move a stop-loss further from entry to 'give the trade more room' — this is the most common form of capital destruction.",
      "Separate loss review from emotional state: review losses at a scheduled time the next morning, not in the heat of the moment.",
      "A loss is information. Ask 'Did I follow my process?' not 'Why did the market move against me?'",
    ],
    practicalTip:
      "Create a 'trading break protocol': after any loss that exceeds 50% of your daily risk limit, close all screens and go for a 20-minute walk. This is not optional. Build it into your trading rules before you start. The physical interruption breaks the emotional feedback loop that leads to revenge trading.",
    commonMistake:
      "Averaging down into a losing trade without a pre-defined plan. 'It's lower so it's a better buy' is often rationalisation. If you didn't plan to add at that level before entering, adding now is emotional, not strategic.",
  },

  "ch-psych-004": {
    chapterId: "ch-psych-004",
    title: "Discipline Over Emotion",
    summary:
      "Trading discipline is the ability to follow your pre-defined rules when your emotions are screaming at you to do the opposite. It is the most important and most difficult skill in trading — because it requires you to consistently override instincts that evolved over millions of years.\n\nDiscipline is not a personality trait — it's a system. Consistent traders don't rely on willpower; they design their environment and processes so that the disciplined action is the path of least resistance.",
    concepts: [
      { term: "Process-driven trading", definition: "Following a defined set of rules for every trading decision, regardless of current emotional state. The opposite of intuitive or gut-feel trading." },
      { term: "Ego depletion", definition: "The phenomenon where making many decisions reduces the quality of subsequent decisions. Traders who make too many small decisions early in the day make worse risk decisions later." },
      { term: "Pre-commitment", definition: "Locking in a decision before the emotional moment arrives. Setting a stop-loss at the time of entry is pre-commitment — you can't move it in the heat of the moment if your rules forbid it." },
      { term: "Execution ritual", definition: "A consistent sequence of actions taken before every trade — checklist review, position sizing, order placement. Creates consistency regardless of emotional state." },
      { term: "Trading plan", definition: "A written document describing your strategy, risk rules, setups, position sizing, and daily/weekly review process. The foundation of disciplined trading." },
    ],
    keyPoints: [
      "Write your trading rules down. Rules in your head are negotiable; rules on paper create accountability.",
      "Reduce decision points during trading hours — plan trades in the evening, execute mechanically during the day.",
      "Physical state affects discipline: sleep deprivation, hunger, and stress all significantly impair decision quality.",
      "Don't trade on days when you're emotionally compromised. Knowing when NOT to trade is as important as knowing when to trade.",
      "Review your rules every Sunday. Trading without reviewing performance is like driving blindfolded.",
    ],
    practicalTip:
      "For one month, trade exactly one setup — only that one. Even if you see other 'obvious' opportunities, skip them. This exercise builds the core muscle of discipline and reveals whether your primary setup actually works when executed consistently.",
    commonMistake:
      "Confusing flexibility with discipline. 'I adjusted my stop because the trade looked good' is often rationalisation. Genuine flexibility is planned ('I will trail my stop if the trade is up 10%') — unplanned changes during a live trade are almost always emotional.",
  },

  "ch-psych-005": {
    chapterId: "ch-psych-005",
    title: "Sizing Risk, Not Chasing Returns",
    summary:
      "Amateur traders think about how much they can make. Professional traders think about how much they can lose. This single shift in perspective is responsible for most of the performance gap between retail and institutional outcomes.\n\nProper position sizing — based on your stop-loss distance and acceptable risk per trade — is the technical expression of this mindset. It ensures that no single trade, no matter how compelling, can significantly damage your capital base.",
    concepts: [
      { term: "Kelly Criterion", definition: "A mathematical formula for optimal position sizing based on your win rate and payoff ratio. Most traders use a fraction of Kelly (quarter-Kelly) to account for real-world uncertainty." },
      { term: "Risk per trade", definition: "The maximum amount in rupees you are willing to lose on a single trade, expressed as a percentage of total capital (typically 0.5-2%)." },
      { term: "Expected value (EV)", definition: "Win rate × average win − loss rate × average loss. Only take trades with positive expected value over time." },
      { term: "Bet sizing", definition: "Increasing position size as conviction increases, within your risk framework. Not guessing size — calculating it from your stop-loss level and risk amount." },
      { term: "Compounding", definition: "The growth of capital where returns are reinvested. Consistent small gains compound into large wealth; large losses destroy compounding permanently." },
    ],
    keyPoints: [
      "Calculate position size: Risk Amount (₹) / (Entry Price − Stop Price) = Number of Shares.",
      "A 50% account drawdown requires a 100% gain to recover. Protecting capital is mathematically more important than maximising returns.",
      "Trade size should be smaller when confidence is lower (new setup, volatile market) and can be larger when all conditions align.",
      "Don't size up to recover losses. Loss recovery requires the same systematic approach as any other trade.",
      "Consistent 1-2% risk per trade means 10 consecutive losses = 10-20% drawdown — painful but survivable. Consistent 5% risk per trade: 10 losses = 40% drawdown — possibly unrecoverable psychologically.",
    ],
    practicalTip:
      "Create a position sizing calculator in a phone note or spreadsheet. Inputs: account size, % risk, entry, stop. Output: share count. Use it for every single trade before placing an order. Over time, it becomes automatic.",
    commonMistake:
      "Sizing positions based on how confident you feel rather than on mathematical risk. Feelings of confidence peak at market tops (when everyone is buying) — precisely when risk is highest. Calculate, don't feel.",
  },

  "ch-psych-006": {
    chapterId: "ch-psych-006",
    title: "Building a Process You Can Trust",
    summary:
      "Sustainable trading performance is built on process, not prediction. You cannot control market outcomes — but you can control your research quality, your entry discipline, your risk management, and your review cycle. Building a process means defining each of these elements explicitly, so your results depend on consistent execution rather than luck or intuition.\n\nThe final psychological challenge is trusting your process through its inevitable losing periods. Every strategy has drawdowns. The traders who succeed are those who execute their process consistently even when recent results are poor.",
    concepts: [
      { term: "Edge", definition: "A statistical advantage in trading: over a large number of trades, your system makes more than it loses. Most retail traders don't know if they have an edge — because they don't track results systematically." },
      { term: "Backtesting", definition: "Testing a trading setup on historical data before using real money. Reveals how the setup performed across different market conditions, including bear markets." },
      { term: "Trade log", definition: "A detailed record of every trade: setup, entry, exit, size, result, and emotional state. The raw data required to improve any trading system." },
      { term: "Benchmark", definition: "A standard against which to measure performance. For most retail investors, beating a Nifty 50 index fund over 5 years is the relevant benchmark — harder than it sounds." },
      { term: "Statistical significance", definition: "The number of trades required before drawing conclusions about a system's performance. Generally 50-100 trades minimum — most traders abandon systems far too early." },
    ],
    keyPoints: [
      "Define your edge in writing. 'I buy stocks with breakouts from 3-month bases with above-average volume' is an edge hypothesis.",
      "Track every trade in a spreadsheet. After 50 trades, calculate win rate, average win, average loss, and expectancy.",
      "Compare yourself against a simple Nifty 50 index fund. If you're not beating it after fees and taxes, the index is a better option.",
      "Review performance monthly — celebrate process, not outcomes. A good process that happened to lose is better than a bad process that happened to win.",
      "Know the difference between a bad system and a bad period of execution. A system needs 50+ trades to evaluate statistically.",
    ],
    practicalTip:
      "Set a monthly 'performance review date'. On that date, open your trade log and answer: (1) Did I follow my rules on every trade? (2) Where did I deviate and why? (3) What is my expectancy this month? This 30-minute ritual separates improving traders from stagnating ones.",
    commonMistake:
      "Abandoning a working system after a losing streak. Every strategy has drawdown periods — this is mathematical reality, not a sign the strategy is broken. The critical question is: 'Did I execute the system correctly?' If yes, continue. If no, fix the execution.",
  },

  // ── Personal Finance for Your 20s ─────────────────────────────────────────

  "ch-pf-001": {
    chapterId: "ch-pf-001",
    title: "Where Does Your Money Actually Go?",
    summary:
      "Most people in their 20s earn a decent salary but feel perpetually short of money. The culprit is rarely low income — it's the absence of a spending framework. Without a framework, money disappears into lifestyle inflation, small daily expenses that don't register individually, and subscription services that silently drain accounts.\n\nThe first step to financial control is honest visibility: knowing exactly where every rupee goes every month before deciding where it should go.",
    concepts: [
      { term: "50-30-20 rule", definition: "A budgeting framework: 50% of take-home income on needs (rent, food, utilities), 30% on wants (dining, entertainment), 20% on savings and investments." },
      { term: "Lifestyle inflation", definition: "The tendency to increase spending as income rises, keeping savings rate constant or declining. The single biggest threat to long-term wealth building." },
      { term: "Fixed vs variable expenses", definition: "Fixed: predictable monthly costs (rent, EMI, subscriptions). Variable: spending that changes month-to-month (dining, shopping). Variable costs are where most budget leakage occurs." },
      { term: "Zero-based budgeting", definition: "Starting each month's budget from zero and allocating every rupee of income to a specific category, including savings. Leaves no untracked money." },
      { term: "Net worth", definition: "Total assets minus total liabilities. The real measure of financial health — not income, not how things look on the outside." },
    ],
    keyPoints: [
      "Track expenses for 30 days before changing anything. You need accurate data before making decisions.",
      "Most people significantly underestimate food and entertainment spending — the actual numbers are usually a shock.",
      "Subscriptions are the biggest hidden budget leaks — audit all auto-debits monthly.",
      "Save first, spend second. Set up an auto-transfer to savings on salary day so spending is constrained by what's left.",
      "The 50-30-20 rule is a starting point, not a mandate — adjust based on your city, income level, and goals.",
    ],
    practicalTip:
      "Use a budgeting app (Jupiter, Fi Money, or even a Google Sheet) to categorise every expense for one month without changing any behaviour. At the end, highlight the top three categories that surprised you. Those are your focus areas — not a complete spending overhaul.",
    commonMistake:
      "Creating an overly restrictive budget and expecting to maintain it. Extreme budget cuts are unsustainable — they lead to periods of splurging followed by guilt. Build a budget where wants are allocated, not eliminated.",
  },

  "ch-pf-002": {
    chapterId: "ch-pf-002",
    title: "Building an Emergency Fund First",
    summary:
      "An emergency fund is not an investment — it's insurance. Its purpose is to prevent a financial emergency (job loss, medical expense, car breakdown) from becoming a financial catastrophe that forces you to take on high-interest debt or liquidate long-term investments at the wrong time.\n\nBefore any SIP, before any stock market investment, before any financial goal — an emergency fund of 3-6 months of expenses is the first and most important financial action for anyone in their 20s.",
    concepts: [
      { term: "Emergency fund", definition: "Liquid savings covering 3-6 months of living expenses, held in a highly accessible account. The foundation of financial security before all investments." },
      { term: "Liquid fund", definition: "A debt mutual fund that can be redeemed in 24 hours, earns ~6-7% per year, and is safer than a savings account for emergency fund storage." },
      { term: "Opportunity cost", definition: "The return foregone by holding cash instead of investing. An emergency fund has negative expected return relative to equities — that cost is the price of insurance." },
      { term: "High-yield savings account", definition: "A savings account offering above-average interest (5-7% in India vs. 3-4% standard). Used by many for emergency fund storage alongside liquid mutual funds." },
      { term: "Insurance vs investment", definition: "The critical distinction between protecting existing wealth (insurance) and growing it (investment). Emergency funds, term insurance, and health insurance are protection — not investment vehicles." },
    ],
    keyPoints: [
      "Calculate your monthly expenses first: rent + food + utilities + EMIs + basic subscriptions = monthly burn.",
      "Target is 3 months for stable employment, 6 months for self-employed or variable income.",
      "Keep the emergency fund in a liquid mutual fund or a separate savings account — not in your investing account.",
      "Never invest emergency fund money in equities or fixed-term instruments. Accessibility matters more than returns here.",
      "Once built, leave it alone and rebuild it immediately after any use.",
    ],
    practicalTip:
      "Open a separate savings account specifically labelled 'Emergency Fund' at a different bank from your salary account. The friction of transferring from a different bank creates a natural barrier against impulsive use. Set up a monthly auto-transfer of ₹5,000-10,000 until the target is reached.",
    commonMistake:
      "Starting SIPs before having an emergency fund. If the market drops 30% six months after you start investing and you simultaneously lose your job, you'll be forced to redeem at the worst possible time. Build the foundation first.",
  },

  "ch-pf-003": {
    chapterId: "ch-pf-003",
    title: "Starting SIPs the Right Way",
    summary:
      "Systematic Investment Plans (SIPs) are the single most powerful tool for retail investors to build long-term wealth in India. They automate discipline — ensuring you invest consistently regardless of market sentiment. Rupee-cost averaging means you automatically buy more units when markets are down and fewer when they're up.\n\nThe critical decisions in setting up SIPs are: which fund to choose, how much to invest, and whether to use regular or direct plans. Getting these right from the start can mean a difference of lakhs over a 10-15 year horizon.",
    concepts: [
      { term: "SIP (Systematic Investment Plan)", definition: "A method of investing a fixed amount in a mutual fund at regular intervals (monthly). Automates investing and removes the need to time the market." },
      { term: "Rupee-cost averaging", definition: "The natural outcome of SIPs: you buy more units when NAV is low and fewer when NAV is high, reducing the average cost over time." },
      { term: "Direct vs regular plan", definition: "Direct plans have no distributor commission — expense ratios are typically 0.5-1% lower per year. Over 20 years, this difference is significant. Always choose direct plans." },
      { term: "Expense ratio", definition: "Annual fee charged by mutual funds as a percentage of assets. Lower is better. Index funds typically have expense ratios of 0.1-0.2% vs 1-2% for active funds." },
      { term: "XIRR", definition: "Extended Internal Rate of Return — the correct way to measure SIP returns, accounting for the timing of each monthly investment. Used by all major fund tracking apps." },
    ],
    keyPoints: [
      "Use direct plans via Zerodha Coin, MFCentral, or AMFI's MFU — never through bank relationship managers who push regular plans.",
      "Start with Nifty 50 or Nifty 500 index funds. They outperform most actively managed funds after fees over 10+ year periods.",
      "Invest as much as possible early — time in market matters more than timing the market.",
      "Increase SIP amount by 10-15% every year when you get a salary hike — this is called SIP step-up.",
      "Don't stop SIPs during market downturns — that's precisely when buying more units at lower prices is most valuable.",
    ],
    practicalTip:
      "Start your first SIP at the exact minimum amount (as low as ₹500/month) so there's no financial barrier. Schedule it for the 2nd of the month (one day after salary credit). After 3 months, increase to your target amount. The habit of investing consistently matters more than the initial amount.",
    commonMistake:
      "Choosing funds based on recent 1-year returns. The fund that returned 40% last year is usually the one that has already outperformed and is most likely to revert to mean. Evaluate funds over 5-7 year periods and on risk-adjusted metrics, not recent performance.",
  },

  "ch-pf-004": {
    chapterId: "ch-pf-004",
    title: "Term Insurance — Why You Need It Now",
    summary:
      "Term insurance is the purest and cheapest form of life insurance — it pays a lump sum to your family if you die during the policy term, with no investment or savings component. For a 25-year-old in good health, a ₹1 crore term plan costs roughly ₹8,000-12,000 per year — less than ₹1,000 per month.\n\nThe 20s are the best time to buy term insurance: premiums are lowest when you're young and healthy, and the cover protects your family from financial ruin if the unexpected happens before your wealth is built.",
    concepts: [
      { term: "Term insurance", definition: "Pure life cover for a fixed period (term). Pays the sum assured to nominees upon death. No maturity benefit. Lowest cost per rupee of cover." },
      { term: "Sum assured", definition: "The amount paid to nominees upon the insured person's death. Rule of thumb: minimum 10-15x annual income. For a ₹10 lakh annual earner, that's ₹1-1.5 crore cover." },
      { term: "Premium", definition: "Annual payment to keep the insurance policy active. Locked in at time of purchase — younger and healthier = permanently lower premiums for the entire policy term." },
      { term: "ULIP (Unit Linked Insurance Plan)", definition: "A product combining insurance and investment. High charges, poor insurance cover, and sub-optimal investment returns. Avoid. Buy term insurance and mutual funds separately." },
      { term: "Claim settlement ratio", definition: "The percentage of claims paid by an insurer. Choose insurers with > 95% settlement ratio. LIC, HDFC Life, and ICICI Prudential are reliable options in India." },
    ],
    keyPoints: [
      "Buy term insurance while you're young and healthy — premiums are permanently lower when you start early.",
      "Never mix insurance with investment. ULIPs and endowment plans have terrible risk-adjusted returns.",
      "Cover should be at least 10-15x your annual income, indexed for inflation.",
      "Ensure nominees are clearly named and paperwork is in order — unclaimed policies are useless.",
      "Health insurance is equally critical — a single hospitalisation without cover can wipe out years of savings.",
    ],
    practicalTip:
      "Get term insurance quotes from PolicyBazaar.com — compare premiums and settlement ratios across LIC, HDFC Life, and ICICI Pru. The 10-minute comparison can save you ₹3,000-5,000 per year. Buy online directly (cheaper than through an agent) from the insurer's website.",
    commonMistake:
      "Postponing term insurance because 'nothing will happen to me.' The entire point of insurance is that you don't know when something will happen. The younger you buy it, the lower the cost — delay directly means higher lifetime premiums for the same cover.",
  },

  "ch-pf-005": {
    chapterId: "ch-pf-005",
    title: "Your Credit Score and Why It Matters",
    summary:
      "Your credit score (CIBIL score in India) is a three-digit number between 300 and 900 that determines your ability to borrow money and at what interest rate. A score above 750 gives you access to home loans at 0.5-1% lower interest rates, which translates to lakhs of rupees saved over a 20-year loan.\n\nBuilding a strong credit history is a slow but completely controllable process. You don't need to take on debt to build credit — you just need to manage whatever credit you have impeccably.",
    concepts: [
      { term: "CIBIL score", definition: "India's most widely used credit score, ranging from 300-900. Calculated by TransUnion CIBIL based on repayment history, credit utilisation, and account age. Scores above 750 are considered excellent." },
      { term: "Credit utilisation", definition: "The percentage of your available credit limit you're using. Keeping utilisation below 30% positively impacts your score. Using 90% of your credit card limit hurts it significantly." },
      { term: "Credit history length", definition: "How long you've had credit accounts. Longer history improves scores — another reason to start building credit early and not close old accounts." },
      { term: "Hard inquiry", definition: "When a lender checks your credit report to evaluate a loan application. Multiple hard inquiries in a short period reduce your score — avoid applying to many lenders simultaneously." },
      { term: "Secured vs unsecured credit", definition: "Secured loans (home loan, car loan) are backed by collateral. Unsecured (personal loan, credit card) are not. Both affect your credit score; unsecured debt is higher risk and higher interest." },
    ],
    keyPoints: [
      "Check your CIBIL score free once per year at cibil.com — know your baseline.",
      "Never miss a credit card or loan payment — a single default can drop your score by 100+ points.",
      "Keep credit card utilisation below 30% consistently. Set a calendar reminder to pay bills in full before the due date.",
      "Don't close old credit cards even if you don't use them — account age improves your score.",
      "A credit card used for one monthly expense and paid in full automatically is the simplest way to build credit.",
    ],
    practicalTip:
      "Get one credit card with a low limit (₹20,000-50,000). Use it only for one recurring expense (petrol, groceries) — set up an auto-pay to pay the full balance on the statement date. In 12 months, you'll have a strong repayment history without any risk of debt accumulation.",
    commonMistake:
      "Avoiding credit cards entirely to 'stay out of debt.' No credit history means no credit score, which means worse loan terms when you eventually need a home loan. Controlled use of credit is essential for building the score that saves you money later.",
  },

  "ch-pf-006": {
    chapterId: "ch-pf-006",
    title: "Long-Term Wealth with Index Funds",
    summary:
      "Index funds are the single most evidence-backed investment vehicle for long-term retail wealth building. They track an index (like Nifty 50), cost nearly nothing in fees, require no manager selection skill, and over 15-20 year periods, outperform the majority of actively managed funds after accounting for charges.\n\nThe power of index funds comes not from picking the best stocks — it's from owning all of them, staying in the market through volatility, and letting compounding work over decades.",
    concepts: [
      { term: "Index fund", definition: "A mutual fund that passively replicates the composition of a market index. No active manager decisions. Expense ratios typically 0.1-0.2% vs 1-2% for active funds." },
      { term: "Nifty 50", definition: "India's benchmark index of the 50 largest companies by market cap. Represents approximately 65% of India's total market capitalisation." },
      { term: "Compounding", definition: "Earning returns on previously earned returns. ₹10,000 growing at 12% per year becomes ₹96,000 in 20 years — without adding a single rupee more." },
      { term: "Expense ratio drag", definition: "How fund charges reduce long-term returns. A 1.5% annual charge on ₹10 lakh over 20 years at 12% returns reduces final corpus by approximately ₹22 lakh compared to a 0.1% index fund." },
      { term: "Passive investing", definition: "Investing that replicates the market instead of trying to beat it. Based on the efficient market hypothesis — that market prices already incorporate all available information." },
    ],
    keyPoints: [
      "Nifty 50 index funds: lowest cost, highest diversification within Indian large-caps, zero manager risk.",
      "For higher diversification, combine a Nifty 50 fund with a Nifty Next 50 or Nifty 500 fund.",
      "Time in market beats timing the market. Starting 5 years later can cost more than ₹50 lakhs in final corpus at normal SIP levels.",
      "Global diversification: allocate 10-20% to international index funds (Motilal Oswal NASDAQ 100 or similar) to reduce India-specific risk.",
      "Review portfolio once per year, not monthly. Long-term investing is psychologically hardest when markets are volatile — that's when discipline matters most.",
    ],
    practicalTip:
      "Open a Zerodha Coin or Groww account and start a ₹5,000/month SIP in UTI Nifty 50 Direct Plan. Set a phone reminder for 5 years from today to review total corpus. Don't check it monthly — the psychology of watching volatility leads to poor decisions. Trust the process.",
    commonMistake:
      "Stopping index fund SIPs during market crashes. Market crashes are when index fund SIPs are most valuable — you're buying more units at lower prices. The investors who paused SIPs during COVID-19 in 2020 missed the largest single-year recovery in Indian market history.",
  },
};

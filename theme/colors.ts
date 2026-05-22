export const colors = {
  // Brand
  primary: "#563FA5",
  primaryDark: "#730A96",
  primaryLight: "#CAA2FC",
  accent: "#BC86FE",

  // Backgrounds
  background: "#F5F3FF",
  surface: "rgba(255, 255, 255, 0.60)",
  surfaceHigh: "rgba(255, 255, 255, 0.85)",
  surfaceDim: "rgba(255, 255, 255, 0.35)",

  // Auth screen
  authBackground: "#DCC0FF",

  // Text
  textPrimary: "#0D0D0D",
  textSecondary: "rgba(0, 0, 0, 0.50)",
  textMuted: "rgba(0, 0, 0, 0.30)",
  textInverse: "#FFFFFF",

  // Borders
  border: "rgba(0, 0, 0, 0.06)",
  borderLight: "rgba(255, 255, 255, 0.80)",

  // Semantic
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",

  // Coin
  coin: "#F5A623",
  coinBg: "rgba(180, 131, 241, 0.25)",
} as const;

export type ColorKey = keyof typeof colors;

export const colors = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg: {
    base:     "#0A0614",               // deepest layer — screen backgrounds
    elevated: "#110820",               // cards, bottom sheets
    surface:  "#1A1030",               // inputs, chips, secondary cards
    overlay:  "rgba(255,255,255,0.04)", // hairline dividers, hover states
  },

  // ── Brand purple ─────────────────────────────────────────────────────────
  brand: {
    primary: "#7C3AED",                // CTAs, active states, interactive
    muted:   "#5B21B6",                // gradient starts, deeper fills
    glow:    "#A78BFA",                // text accents, icon highlights
    dim:     "rgba(167,139,250,0.12)", // pill backgrounds, subtle fills
  },

  // ── Text ─────────────────────────────────────────────────────────────────
  text: {
    primary:   "#FFFFFF",
    secondary: "rgba(255,255,255,0.55)",
    muted:     "rgba(255,255,255,0.28)",
    accent:    "#A78BFA",
  },

  // ── Borders ───────────────────────────────────────────────────────────────
  border: {
    subtle: "rgba(255,255,255,0.06)",
    accent: "rgba(167,139,250,0.18)",
  },

  // ── Semantic ──────────────────────────────────────────────────────────────
  success: "#22C55E",
  warning: "#F59E0B",
  error:   "#EF4444",
  coin:    "#F5A623",
} as const;

export type Colors = typeof colors;

// Legacy flat aliases — for gradual migration of existing screens
export const legacyColors = {
  primary:      "#7C3AED",
  primaryDark:  "#5B21B6",
  primaryLight: "#A78BFA",
  accent:       "#A78BFA",
  background:   "#0A0614",
  surface:      "#1A1030",
  textPrimary:  "#FFFFFF",
  textSecondary:"rgba(255,255,255,0.55)",
  textMuted:    "rgba(255,255,255,0.28)",
  border:       "rgba(255,255,255,0.06)",
  success:      "#22C55E",
  warning:      "#F59E0B",
  error:        "#EF4444",
  coin:         "#F5A623",
} as const;

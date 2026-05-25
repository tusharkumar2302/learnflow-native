// Three shadow levels — use nothing outside these
export const shadows = {
  // Low elevation: subtle depth for cards, chips
  sm: {
    shadowColor:  "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 8,
    elevation: 4,
  },

  // Mid elevation: sheets, modals, prominent cards
  md: {
    shadowColor:  "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },

  // Branded CTA shadow only — purple glow beneath primary buttons
  lg: {
    shadowColor:  "#5B21B6",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.40,
    shadowRadius: 24,
    elevation: 14,
  },
} as const;

export type ShadowKey = keyof typeof shadows;

export const fontFamilies = {
  heading: {
    regular: "Teachers-Regular",
    medium: "Teachers-Medium",
    semiBold: "Teachers-SemiBold",
    bold: "Teachers-Bold",
  },
  body: {
    regular: "Poppins-Regular",
    medium: "Poppins-Medium",
    semiBold: "Poppins-SemiBold",
    bold: "Poppins-Bold",
  },
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  display: 28,
} as const;

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
} as const;

export const typography = {
  heading1: { fontFamily: fontFamilies.heading.bold, fontSize: fontSize.display },
  heading2: { fontFamily: fontFamilies.heading.semiBold, fontSize: fontSize.xxl },
  heading3: { fontFamily: fontFamilies.heading.medium, fontSize: fontSize.xl },
  bodyLarge: { fontFamily: fontFamilies.body.regular, fontSize: fontSize.lg },
  body: { fontFamily: fontFamilies.body.regular, fontSize: fontSize.md },
  bodySmall: { fontFamily: fontFamilies.body.regular, fontSize: fontSize.sm },
  label: { fontFamily: fontFamilies.body.medium, fontSize: fontSize.md },
  caption: { fontFamily: fontFamilies.body.regular, fontSize: fontSize.xs },
} as const;

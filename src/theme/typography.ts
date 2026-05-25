export const fontFamilies = {
  heading: {
    regular:  "Teachers-Regular",
    medium:   "Teachers-Medium",
    semiBold: "Teachers-SemiBold",
    bold:     "Teachers-Bold",
  },
  body: {
    regular:  "Poppins-Regular",
    medium:   "Poppins-Medium",
    semiBold: "Poppins-SemiBold",
    bold:     "Poppins-Bold",
  },
} as const;

// Locked font sizes — use these, no raw numbers in screens
export const fontSize = {
  display: 38, // onboarding hero headlines
  h1:      32, // screen titles
  h2:      24, // section headers
  h3:      18, // card titles
  body:    14, // primary readable text
  small:   12, // labels, captions
  micro:   11, // tags, metadata
} as const;

export const lineHeight = {
  display: 46,
  h1:      40,
  h2:      32,
  h3:      26,
  body:    22,
  small:   18,
  micro:   16,
} as const;

// Composed text styles — use via AppText component
export const typography = {
  display: {
    fontFamily: fontFamilies.heading.bold,
    fontSize:   fontSize.display,
    lineHeight: lineHeight.display,
  },
  h1: {
    fontFamily: fontFamilies.heading.bold,
    fontSize:   fontSize.h1,
    lineHeight: lineHeight.h1,
  },
  h2: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize:   fontSize.h2,
    lineHeight: lineHeight.h2,
  },
  h3: {
    fontFamily: fontFamilies.heading.semiBold,
    fontSize:   fontSize.h3,
    lineHeight: lineHeight.h3,
  },
  body: {
    fontFamily: fontFamilies.body.regular,
    fontSize:   fontSize.body,
    lineHeight: lineHeight.body,
  },
  bodyMedium: {
    fontFamily: fontFamilies.body.medium,
    fontSize:   fontSize.body,
    lineHeight: lineHeight.body,
  },
  bodySemiBold: {
    fontFamily: fontFamilies.body.semiBold,
    fontSize:   fontSize.body,
    lineHeight: lineHeight.body,
  },
  small: {
    fontFamily: fontFamilies.body.regular,
    fontSize:   fontSize.small,
    lineHeight: lineHeight.small,
  },
  smallMedium: {
    fontFamily: fontFamilies.body.medium,
    fontSize:   fontSize.small,
    lineHeight: lineHeight.small,
  },
  micro: {
    fontFamily: fontFamilies.body.regular,
    fontSize:   fontSize.micro,
    lineHeight: lineHeight.micro,
  },
  microMedium: {
    fontFamily: fontFamilies.body.medium,
    fontSize:   fontSize.micro,
    lineHeight: lineHeight.micro,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

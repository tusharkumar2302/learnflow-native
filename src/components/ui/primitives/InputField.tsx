import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { colors } from "@/theme";

interface InputFieldProps extends Omit<TextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  containerStyle?: ViewStyle;
  rightElement?: React.ReactNode;
  lightMode?: boolean;
}

export function InputField({
  label,
  error,
  hint,
  containerStyle,
  rightElement,
  lightMode = false,
  ...rest
}: InputFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[s.container, containerStyle]}>
      {label && (
        <Text style={[s.label, lightMode && sl.label]}>{label}</Text>
      )}

      <View
        style={[
          s.inputWrap,
          lightMode && sl.inputWrap,
          focused && (lightMode ? sl.focused : s.focused),
          !!error && s.errored,
        ]}
      >
        <TextInput
          style={[s.input, lightMode && sl.input]}
          placeholderTextColor={lightMode ? "rgba(0,0,0,0.28)" : colors.text.muted}
          selectionColor={colors.brand.primary}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {rightElement}
      </View>

      {error && <Text style={s.errorText}>{error}</Text>}
      {!error && hint && (
        <Text style={[s.hintText, lightMode && sl.hintText]}>{hint}</Text>
      )}
    </View>
  );
}

// Light-mode overrides
const sl = StyleSheet.create({
  label: {
    color: "rgba(0,0,0,0.55)",
  },
  inputWrap: {
    backgroundColor: "rgba(0,0,0,0.04)",
    borderColor: "rgba(0,0,0,0.10)",
  },
  focused: {
    borderColor: "rgba(124,58,237,0.35)",
    backgroundColor: "rgba(124,58,237,0.04)",
  },
  input: {
    color: "#0D0D0D",
  },
  hintText: {
    color: "rgba(0,0,0,0.38)",
  },
});

const s = StyleSheet.create({
  container: {
    gap: scale(6),
  },
  label: {
    fontFamily: "Poppins-Medium",
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.70)",
    letterSpacing: 0.1,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(46),
    backgroundColor: colors.bg.surface,
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    paddingHorizontal: scale(14),
  },
  focused: {
    borderColor: "rgba(167,139,250,0.50)",
    backgroundColor: colors.bg.elevated,
  },
  errored: {
    borderColor: "rgba(239,68,68,0.50)",
  },
  input: {
    flex: 1,
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(14),
    color: colors.text.primary,
    padding: 0,
    margin: 0,
  },
  errorText: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(11),
    color: colors.error,
  },
  hintText: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(11),
    color: colors.text.muted,
  },
});

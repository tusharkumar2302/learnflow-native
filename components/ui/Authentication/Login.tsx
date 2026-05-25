import { authService } from "@/lib/services";
import { authStore } from "@/stores/authStore";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { EyeIcon, ViewOffSlashIcon } from "@hugeicons/core-free-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@/theme";
import { InputField, PrimaryButton } from "@/components/ui/primitives";

export default function Login({ lightMode = false }: { lightMode?: boolean }) {
  const { setToken, setEmail: persistEmail } = authStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 360, delay: 40, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 320, delay: 40, useNativeDriver: true }),
    ]).start();
    // fadeAnim and slideAnim are stable Animated.Value refs — deps intentionally empty
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid = email.trim().length > 3 && password.length >= 6;

  const handleSignIn = useCallback(async () => {
    if (!isValid) return;
    setError("");
    setIsLoading(true);

    try {
      const result = await authService.signIn(email.trim().toLowerCase(), password);
      await setToken(result.token);
      await persistEmail(email.trim().toLowerCase());
      router.replace("/Authenticated/(tabs)/Home");
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, isValid, setToken, persistEmail]);

  return (
    <Animated.View
      style={[s.root, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      {/* Fields — open layout, no container */}
      <View style={s.fields}>
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="your@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
          returnKeyType="next"
          lightMode={lightMode}
        />
        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Min. 6 characters"
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
          lightMode={lightMode}
          rightElement={
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <HugeiconsIcon
                icon={showPassword ? ViewOffSlashIcon : EyeIcon}
                size={moderateScale(16)}
                color={lightMode ? "rgba(0,0,0,0.35)" : colors.text.muted}
                strokeWidth={1.5}
              />
            </TouchableOpacity>
          }
        />
      </View>

      <TouchableOpacity activeOpacity={0.65} style={s.forgotRow}>
        <Text style={[s.forgotText, lightMode && { color: "rgba(0,0,0,0.38)" }]}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      {error ? <Text style={s.error}>{error}</Text> : null}

      {/* Spacer pushes actions toward screen bottom */}
      <View style={s.spacer} />

      <View>
        <PrimaryButton
          label="Continue"
          onPress={handleSignIn}
          loading={isLoading}
          disabled={!isValid}
        />

        <TouchableOpacity
          onPress={() => router.push("/Authentication/signup")}
          activeOpacity={0.65}
          style={s.createRow}
        >
          <Text style={[s.createText, lightMode && { color: "rgba(0,0,0,0.42)" }]}>
            {"Don't have an account?  "}
            <Text style={s.createLink}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  fields: {
    gap: verticalScale(14),
  },
  forgotRow: {
    alignSelf: "flex-end",
    marginTop: verticalScale(10),
    paddingVertical: verticalScale(2),
  },
  forgotText: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(12),
    color: "rgba(255,255,255,0.38)",
  },
  error: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(12),
    color: colors.error,
    marginTop: verticalScale(10),
  },
  spacer: {
    flex: 1,
    minHeight: verticalScale(40),
  },
  createRow: {
    alignItems: "center",
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(4),
  },
  createText: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(13),
    color: "rgba(255,255,255,0.40)",
  },
  createLink: {
    fontFamily: "Poppins-Medium",
    color: colors.brand.glow,
  },
});

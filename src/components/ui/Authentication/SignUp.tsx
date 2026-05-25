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

export default function SignUp({ lightMode = false }: { lightMode?: boolean }) {
  const { setName, setEmail: persistEmail } = authStore();
  const [name, setNameInput] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isValid =
    name.trim().length >= 2 &&
    email.includes("@") &&
    password.length >= 6;

  const handleCreateAccount = useCallback(async () => {
    if (!isValid) return;
    setError("");
    setIsLoading(true);

    try {
      await authService.signUp(name.trim(), email.trim().toLowerCase(), password);
      setName(name.trim());
      persistEmail(email.trim().toLowerCase());
      router.push("/Authentication/otp");
    } catch {
      setError("Account creation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [name, email, password, isValid, setName, persistEmail]);

  return (
    <Animated.View
      style={[s.root, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
    >
      {/* Fields — open layout, mirrors login */}
      <View style={s.fields}>
        <InputField
          label="Full Name"
          value={name}
          onChangeText={setNameInput}
          placeholder="Arjun Sharma"
          autoCapitalize="words"
          returnKeyType="next"
          lightMode={lightMode}
        />
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
          onSubmitEditing={handleCreateAccount}
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

      {error ? <Text style={s.error}>{error}</Text> : null}

      {/* Spacer — pushes CTA toward screen bottom */}
      <View style={s.spacer} />

      <View>
        <PrimaryButton
          label="Create Account"
          onPress={handleCreateAccount}
          loading={isLoading}
          disabled={!isValid}
        />

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.65}
          style={s.signInRow}
        >
          <Text style={[s.signInText, lightMode && { color: "rgba(0,0,0,0.42)" }]}>
            {"Already have an account?  "}
            <Text style={s.signInLink}>Sign in</Text>
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
  signInRow: {
    alignItems: "center",
    marginTop: verticalScale(20),
    paddingBottom: verticalScale(4),
  },
  signInText: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(13),
    color: "rgba(255,255,255,0.40)",
  },
  signInLink: {
    fontFamily: "Poppins-Medium",
    color: colors.brand.glow,
  },
});

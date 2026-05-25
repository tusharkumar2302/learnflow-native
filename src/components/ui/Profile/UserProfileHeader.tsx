import { authService } from "@/services";
import { authStore } from "@/stores/authStore";
import { useRedeemStore } from "@/stores/coinStore";
import { useCourseStore } from "@/stores/courseStore";
import currentVid from "@/stores/currentVid";
import quizStore from "@/stores/quizStore";
import { useWalletStore } from "@/stores/walletStore";
import { useWeeklyQuizStore } from "@/stores/weeklyQuizStore";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

const UserProfileHeader = () => {
  const { width: screenWidth } = Dimensions.get("window");
  const { logout } = authStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profile, setProfile] = useState<{
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    imgUrl?: string | null;
    streak?: number;
    subscriptionTier?: string;
  } | null>(null);

  const resetCourseStore = useCourseStore((state) => state.reset);
  const resetWalletStore = useWalletStore((state) => state.reset);
  const resetRedeemStore = useRedeemStore((state) => state.reset);
  const resetWeeklyQuizStore = useWeeklyQuizStore((state) => state.reset);
  const resetQuizStore = quizStore((state) => state.reset);
  const resetCurrentVid = currentVid((state) => state.reset);

  const logOutBTn = async () => {
    try {
      setLoggingOut(true);
      Alert.alert(
        "Logout",
        "Are you sure you want to logout?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => setLoggingOut(false),
          },
          {
            text: "Logout",
            style: "destructive",
            onPress: async () => {
              try {
                resetCourseStore();
                resetWalletStore();
                resetRedeemStore();
                resetWeeklyQuizStore();
                resetQuizStore();
                resetCurrentVid();
                setProfile(null);
                await logout();
                await new Promise((resolve) => setTimeout(resolve, 150));
                router.replace({
                  pathname: "/Authentication/[id]",
                  params: { id: "login" },
                });
              } catch {
                setLoggingOut(false);
                Alert.alert("Error", "Failed to logout. Please try again.");
              }
            },
          },
        ],
        { cancelable: true, onDismiss: () => setLoggingOut(false) }
      );
    } catch {
      setLoggingOut(false);
    }
  };

  const fetchProfile = useCallback(async () => {
    setProfileLoading(true);
    try {
      const p = await authService.getProfile();
      setProfile({
        id: p.id,
        name: p.name,
        email: p.email,
        imgUrl: p.imgUrl,
        streak: p.streak,
        subscriptionTier: p.subscriptionTier,
      });
    } catch {
      // silent — profile load failure shows empty state
    } finally {
      setProfileLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const userInitial = useMemo(() => {
    const name = profile?.name || "";
    return name.trim().charAt(0).toUpperCase() || "U";
  }, [profile?.name]);

  const pickImageAndUpload = useCallback(async () => {
    Alert.alert("Coming Soon", "Photo upload will be available in a future update.");
    setLoading(false);
  }, []);

  return (
    <View
      className="mb-8 rounded-xl self-center"
      style={{ width: screenWidth * 0.875 }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 1,
            minWidth: 0,
          }}
        >
          <View style={{ position: "relative", marginRight: 12 }}>
            {profile?.imgUrl ? (
              <Image
                source={{ uri: profile.imgUrl }}
                style={{ width: 72, height: 72, borderRadius: 9999 }}
              />
            ) : (
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#E9D8FD",
                }}
              >
                <Text
                  style={{
                    fontSize: 32,
                    color: "#730A96",
                    fontFamily: "SFProDisplay-Semibold",
                  }}
                >
                  {userInitial}
                </Text>
              </View>
            )}
            <Pressable
              onPress={pickImageAndUpload}
              disabled={loading}
              style={{
                position: "absolute",
                bottom: 2,
                right: 4,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                source={require("@/assets/icons/Profile/edit.png")}
                style={{ height: 12, width: 12, opacity: loading ? 0.5 : 1 }}
              />
            </Pressable>
          </View>

          <View style={{ flexShrink: 1, minWidth: 0, gap: 3 }}>
            <Text
              style={{ color: "black", fontSize: 20, fontFamily: "Teachers-SemiBold" }}
              numberOfLines={1}
            >
              {profile?.name || (profileLoading ? "Loading..." : "User")}
            </Text>
            <Text
              style={{ fontSize: 13, color: "#730A96A6", fontFamily: "Teachers-Medium" }}
              numberOfLines={1}
            >
              {profile?.email || ""}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              {profile?.subscriptionTier && profile.subscriptionTier !== "FREE" && (
                <View style={{ backgroundColor: "rgba(115,10,150,0.10)", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, fontFamily: "Poppins-SemiBold", color: "#730A96" }}>
                    {profile.subscriptionTier.replace("ZUPER_", "")}
                  </Text>
                </View>
              )}
              {(profile?.streak ?? 0) > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(249,115,22,0.10)", borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, gap: 2 }}>
                  <Text style={{ fontSize: 11 }}>🔥</Text>
                  <Text style={{ fontSize: 10, fontFamily: "Poppins-Medium", color: "#EA580C" }}>
                    {profile?.streak}d streak
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}
          onPress={logOutBTn}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color="#E33629" />
          ) : (
            <>
              <Text className="text-red-500 text-[14px] font-semibold">
                Logout{" "}
              </Text>
              <Svg width="15" height="17" viewBox="0 0 15 17" fill="none">
                <Path
                  d="M4.40137 4.3999C4.41037 2.76865 4.48312 1.88515 5.05912 1.30915C5.71837 0.649902 6.77887 0.649902 8.89987 0.649902H9.64987C11.7716 0.649902 12.8321 0.649902 13.4914 1.30915C14.1499 1.96765 14.1499 3.0289 14.1499 5.1499V11.1499C14.1499 13.2709 14.1499 14.3322 13.4914 14.9907C12.8314 15.6499 11.7716 15.6499 9.64987 15.6499H8.89987C6.77887 15.6499 5.71837 15.6499 5.05912 14.9907C4.48312 14.4147 4.41037 13.5312 4.40137 11.8999"
                  stroke="#E33629"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                <Path
                  d="M4.3999 13.7749C2.63215 13.7749 1.7479 13.7749 1.1989 13.2259C0.649902 12.6762 0.649902 11.7927 0.649902 10.0249V6.2749C0.649902 4.50715 0.649902 3.6229 1.1989 3.0739C1.7479 2.5249 2.63215 2.5249 4.3999 2.5249"
                  stroke="#E33629"
                  strokeWidth="1.3"
                />
                <Path
                  d="M9.6499 8.1499H2.8999M2.8999 8.1499L4.3999 9.6499M2.8999 8.1499L4.3999 6.6499"
                  stroke="#E33629"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default UserProfileHeader;

import { authStore } from "@/stores/authStore";
import { useRedeemStore } from "@/stores/Coin/coinStore";
import { useCourseStore } from "@/stores/Course/courseStore";
import currentVid from "@/stores/currentVid";
import quizStore from "@/stores/quizStore";
import { useWalletStore } from "@/stores/Wallet/walletStore";
import { useWeeklyQuizStore } from "@/stores/WeeklyQuiz/weeklyQuiz";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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
  const { logout, token } = authStore();
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
  } | null>(null);

  // Get reset functions from stores
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
                // Reset all stores first to prevent accessing stale data
                resetCourseStore();
                resetWalletStore();
                resetRedeemStore();
                resetWeeklyQuizStore();
                resetQuizStore();
                resetCurrentVid();

                // Clear local state
                setProfile(null);

                // Perform logout (clears auth token)
                await logout();
                await AsyncStorage.setItem('hasOnboarded','false');

                // Small delay to ensure state is cleared
                await new Promise((resolve) => setTimeout(resolve, 150));

                // Navigate to login screen
                router.replace({
                  pathname: "/Authentication/[id]",
                  params: { id: "login" },
                });
              } catch (error) {
                console.error("❌ Logout error:", error);
                setLoggingOut(false);
                Alert.alert("Error", "Failed to logout. Please try again.");
              }
            },
          },
        ],
        { cancelable: true, onDismiss: () => setLoggingOut(false) }
      );
    } catch (error) {
      console.error("❌ Logout button error:", error);
      setLoggingOut(false);
    }
  };

  const baseUrl = process.env.EXPO_PUBLIC_API_URL;

  const fetchProfile = useCallback(async () => {
    if (!baseUrl || !token) return;
    try {
      setProfileLoading(true);
      const res = await axios.get(`${baseUrl}/api/user/profile/new`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data?.success && res.data?.data) {
        setProfile(res.data.data);
      }
    } catch (error: any) {
      console.log(
        "Failed to fetch profile",
        error?.response?.data || error?.message
      );
    } finally {
      setProfileLoading(false);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const userInitial = useMemo(() => {
    const name = profile?.name || "";
    return name.trim().charAt(0).toUpperCase() || "U";
  }, [profile?.name]);

  const pickImageAndUpload = useCallback(async () => {
    try {
      if (!baseUrl) {
        Alert.alert("Error", "API base URL is not configured.");
        return;
      }
      if (!token) {
        Alert.alert("Error", "You are not authenticated.");
        return;
      }

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "We need access to your photos to update your profile image."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets?.length) return;
      const asset = result.assets[0];
      const uri = asset.uri;
      const mimeType =
        asset.mimeType || (uri.endsWith(".png") ? "image/png" : "image/jpeg");
      const fileName =
        asset.fileName ||
        uri.split("/").pop() ||
        `upload.${mimeType.split("/")[1] || "jpg"}`;

      setLoading(true);

      const form = new FormData();
      const rnFile: any = { uri, name: fileName, type: mimeType };
      form.append("image", rnFile as any);

      const uploadRes = await axios.post(
        `${baseUrl}/api/files/image/upload`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadRes?.data?.data?.imageUrl;
      if (!imageUrl) {
        throw new Error("No imageUrl returned from upload API");
      }

      await axios.patch(
        `${baseUrl}/api/user/profile/image`,
        { imgUrl: imageUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      await fetchProfile();
      Alert.alert("Success", "Profile image updated.");
    } catch (error: any) {
      console.log(
        "Image upload/update failed",
        error?.response?.data || error?.message
      );
      Alert.alert(
        "Error",
        error?.response?.data?.message || "Failed to update profile image."
      );
    } finally {
      setLoading(false);
    }
  }, [baseUrl, token, fetchProfile]);

  return (
    <View
      className="mb-8 rounded-xl self-center"
      style={{
        width: screenWidth * 0.875,
      }}
    >
      {/* allow wrapping so logout goes to next line on very small widths */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap", // key for tiny devices
        }}
      >
        {/* Left: Avatar + Info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flexShrink: 1, // let this shrink before overflowing
            minWidth: 0, // allow Text to wrap instead of pushing out
          }}
        >
          {/* Profile Image */}
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
            {/* Edit Badge */}
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

          {/* Name + ID */}
          <View
            style={{
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            <Text
              style={{
                color: "black",
                fontSize: 20,
                fontFamily: "Teachers-SemiBold",
              }}
              numberOfLines={1}
            >
              {profile?.name || (profileLoading ? "Loading..." : "User")}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#730A96A6",
                fontFamily: "Teachers-Medium",
              }}
              numberOfLines={1}
            >
              {profile?.email || ""}
            </Text>
          </View>
        </View>

        {/* Right: Logout */}
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 8, // when wrapped, add a bit of space
          }}
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

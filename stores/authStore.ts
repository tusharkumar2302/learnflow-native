import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type para = {
  token: string | null;
  email: string | null;
  pendingRedirect: { redirect: string; courseID?: string } | null;
  name: string | null;
  isAuthenticated: boolean;
  setemail: (value: string) => Promise<void>;
  setName: (value: string) => Promise<void>;
  setToken: (value: string) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
  setPendingRedirect: (
    value: { redirect: string; courseID?: string } | null
  ) => void;
};

export const authStore = create<para>((Set) => ({
  token: null,
  email: null,
  pendingRedirect: null,
  name: null,
  isAuthenticated: false,

  setemail: async (email) => {
    Set({ email });
  },

  setName: async (name) => {
    Set({ name });
  },

  setToken: async (token) => {
    try {
      // Store in both SecureStore and AsyncStorage for redundancy
      await SecureStore.setItemAsync("authToken", token);
      await AsyncStorage.setItem("authToken", token);
      Set({ token, isAuthenticated: true });
      console.log("✅ Token set successfully");
    } catch (error) {
      console.error("❌ Error setting token:", error);
      throw error;
    }
  },

  loadToken: async () => {
    try {
      // Try SecureStore first, fallback to AsyncStorage
      let token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        token = await AsyncStorage.getItem("authToken");
      }

      if (token) {
        Set({ token, isAuthenticated: true });
        console.log("✅ Token loaded successfully");
      } else {
        Set({ token: null, isAuthenticated: false });
        console.log("ℹ️ No token found");
      }
    } catch (error) {
      console.error("❌ Error loading token:", error);
      Set({ token: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      console.log("🔄 Starting logout process...");

      // Clear all storage locations
      await Promise.all([
        SecureStore.deleteItemAsync("authToken").catch(() => {}),
        AsyncStorage.removeItem("authToken").catch(() => {}),
        AsyncStorage.removeItem("isDummyUser").catch(() => {}),
        AsyncStorage.removeItem("dummyOtp").catch(() => {}),
      ]);

      // Clear all state
      Set({
        token: null,
        name: null,
        email: null,
        isAuthenticated: false,
        pendingRedirect: null,
      });

      console.log("✅ Logout completed successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      // Even if error occurs, clear the state
      Set({
        token: null,
        name: null,
        email: null,
        isAuthenticated: false,
        pendingRedirect: null,
      });
    }
  },

  setPendingRedirect: (value) => {
    Set({ pendingRedirect: value });
  },
}));

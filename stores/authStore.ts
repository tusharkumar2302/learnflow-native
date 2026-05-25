import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

type para = {
  token: string | null;
  email: string | null;
  pendingRedirect: { redirect: string; courseID?: string } | null;
  name: string | null;
  isAuthenticated: boolean;
  setEmail: (value: string) => Promise<void>;
  setName: (value: string) => Promise<void>;
  setToken: (value: string) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
  setPendingRedirect: (
    value: { redirect: string; courseID?: string } | null
  ) => void;
};

export const authStore = create<para>((set) => ({
  token: null,
  email: null,
  pendingRedirect: null,
  name: null,
  isAuthenticated: false,

  setEmail: async (email) => {
    set({ email });
  },

  setName: async (name) => {
    set({ name });
  },

  setToken: async (token) => {
    try {
      await SecureStore.setItemAsync("authToken", token);
      await AsyncStorage.setItem("authToken", token);
      set({ token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  loadToken: async () => {
    try {
      let token = await SecureStore.getItemAsync("authToken");
      if (!token) {
        token = await AsyncStorage.getItem("authToken");
      }
      set({ token: token ?? null, isAuthenticated: !!token });
    } catch {
      set({ token: null, isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync("authToken").catch(() => {}),
        AsyncStorage.removeItem("authToken").catch(() => {}),
        AsyncStorage.removeItem("isDummyUser").catch(() => {}),
        AsyncStorage.removeItem("dummyOtp").catch(() => {}),
      ]);
    } catch {
      // silent — state clears in finally
    } finally {
      set({
        token: null,
        name: null,
        email: null,
        isAuthenticated: false,
        pendingRedirect: null,
      });
    }
  },

  setPendingRedirect: (value) => {
    set({ pendingRedirect: value });
  },
}));

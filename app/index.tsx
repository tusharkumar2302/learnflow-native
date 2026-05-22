import { useFonts } from "expo-font";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import { authStore } from "@/stores/authStore";
import Splash from "./splash/Splash";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitialized = useRef(false);
  const hasNavigated = useRef(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Teachers-Regular": require("../assets/fonts/Teachers-Regular.ttf"),
    "Teachers-Bold": require("../assets/fonts/Teachers-Bold.ttf"),
    "Teachers-SemiBold": require("../assets/fonts/Teachers-SemiBold.ttf"),
    "Teachers-Medium": require("../assets/fonts/Teachers-Medium.ttf"),
    "HelveticaNeue-Medium": require("../assets/fonts/HelveticaNeue-Medium.otf"),
    "HelveticaNeue-Bold": require("../assets/fonts/HelveticaNeue-Bold.otf"),
    "SFProDisplay-Regular": require("../assets/fonts/SFProDisplay-Regular.otf"),
    "SFProDisplay-Medium": require("../assets/fonts/SFProDisplay-Medium.otf"),
    "SFProDisplay-SemiBold": require("../assets/fonts/SFProDisplay-Semibold.otf"),
    "SFProDisplay-Bold": require("../assets/fonts/SFProDisplay-Bold.otf"),
  });

  // Initialize auth state - only run once on mount
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initAuth = async () => {
      try {
        await authStore.getState().loadToken();
      } catch (error) {
        console.error("Error loading token:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    initAuth();
  }, []);

  // Handle splash screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Slightly longer to ensure auth check completes

    return () => clearTimeout(timer);
  }, []);

  // Navigate based on auth state after initialization
  useEffect(() => {
    if (showSplash || !fontsLoaded || isInitializing || hasNavigated.current) {
      return;
    }

    hasNavigated.current = true;

    const { token, isAuthenticated } = authStore.getState();

    if (isAuthenticated && token) {
      console.log("✅ User authenticated, redirecting to Home");
      router.replace("/Authenticated/(tabs)/Home");
    } else {
      console.log("ℹ️ User not authenticated, redirecting to Auth");
      router.replace("/Authentication/Auth");
    }
  }, [showSplash, fontsLoaded, isInitializing]);

  // Show splash while initializing
  return <Splash />;
};

export default Index;

import { authStore } from "@/stores/authStore";
import { RelativePathString, router } from "expo-router";
import React from "react";
import { ImageBackground, StyleSheet, TouchableOpacity } from "react-native";

export default function Success() {
  const { pendingRedirect, setPendingRedirect } = authStore();

  const handleContinue = () => {
    if (pendingRedirect) {
      const { redirect, courseID } = pendingRedirect;
      setPendingRedirect(null);
      router.replace({
        pathname: redirect as RelativePathString,
        params: { courseID },
      });
    } else {
      router.replace("/Authenticated/(tabs)/Home");
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/You-are-in.png")}
      style={s.root}
      resizeMode="cover"
    >
      {/*
        Invisible tap overlay aligned with the "Start Learning" button in the image.
        Image is 875×1798px. At cover-scale on a 390×844 screen the button occupies
        approximately bottom 7%–14.4% of screen height.
        Adjust `bottom` / `height` if the image asset changes.
      */}
      <TouchableOpacity
        onPress={handleContinue}
        activeOpacity={0.88}
        style={s.ctaOverlay}
      />
    </ImageBackground>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
  },
  ctaOverlay: {
    position: "absolute",
    bottom: "7%",
    left: "4%",
    right: "4%",
    height: "7.5%",
  },
});

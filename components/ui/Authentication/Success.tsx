import { authStore } from "@/stores/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { RelativePathString, router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

export default function Success() {
  const { setToken, pendingRedirect, setPendingRedirect } = authStore();
  return (
    <LinearGradient
      colors={["#0B0B0D", "#191321"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.formContainer}
    >
      <View>
        <Image
          style={styles.imageTick}
          source={require("@/assets/images/tick.png")}
        ></Image>

        <View style={{ gap: 15 }}>
          <Text style={styles.titleTxt}>
            Congratulations, you’re onboarded now...
          </Text>

          <Text style={styles.decripTxt}>
            Game on. Let’s trade like never before.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.DashButton}
          onPress={() => {
            if (pendingRedirect) {
              const { redirect, courseID } = pendingRedirect;
              setPendingRedirect(null);
              router.replace({
                pathname: redirect as RelativePathString,
                params: { courseID },
              });
            } else {
              router.replace("/Authenticated/Home");
            }
          }}
        >
          <Text style={styles.DashText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  imageTick: {
    width: scale(67),
    height: scale(67),
    alignSelf: "center",
    marginTop: verticalScale(15),
    marginBottom: verticalScale(20),
    transform: [{ rotate: "26.14deg" }],
  },

  titleTxt: {
    color: "#fff",
    fontSize: moderateScale(18),
    textAlign: "center",
    fontWeight: "600",
  },

  decripTxt: {
    color: "#FFFFFF99",
    fontSize: moderateScale(12),
    textAlign: "center",
    marginBottom: verticalScale(15),
    fontWeight: "500",
  },

  formContainer: {
    marginTop: verticalScale(20),
    borderRadius: moderateScale(10),
    padding: scale(15),
  },

  DashButton: {
    backgroundColor: "#563FA5",
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(10),
    alignItems: "center",
    marginTop: verticalScale(8),
    marginBottom: verticalScale(30),
  },

  DashText: {
    color: "#fff",
    fontSize: moderateScale(14),
    fontWeight: "bold",
  },
});

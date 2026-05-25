import CoursesCarousel from "@/components/ui/Home/CoursesCarousal";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import React from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";

const Courses = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const backAction = () => {
      router.push("/Authenticated/(tabs)/Home");
      return true;
    };
    const handler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => handler.remove();
  }, []);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.title}>Courses</Text>
        <Text style={s.subtitle}>Build your trading knowledge</Text>
      </View>
      <CoursesCarousel
        showSearchBar={false}
        orientation="vertical"
        showViewAll={false}
        screen="course"
        showFilters={true}
      />
    </View>
  );
};

export default Courses;

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5F3FF",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 4,
  },
  title: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 24,
    color: "#0D0D0D",
    marginBottom: 2,
  },
  subtitle: {
    fontFamily: "Poppins-Regular",
    fontSize: 13,
    color: "rgba(0,0,0,0.42)",
  },
});

import MenuBar from "@/components/common/MenuBar";
import CoursesCarousel from "@/components/ui/Home/CoursesCarousal";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

const Courses = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const backAction = () => {
      if (menuVisible) {
        setMenuVisible(false);
        return true;
      } else {
        router.push("/Authenticated/(tabs)/Home");
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // cleanup
  }, [menuVisible]);
  return (
    <View className="bg-[#f5f3ff] flex-1 px-[0px]">
      {/* padding changed from 28px to 0 */}
      {/* Header */}
      <View
        style={{
          width: screenWidth,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 8,
          marginBottom: 4,
          paddingHorizontal: screenWidth * 0.0625,
        }}
      >
        {/* Back/Menu Button */}
        <TouchableOpacity
          onPress={() => {
            router.push("/Authenticated/(tabs)/Home");
          }}
          className="p-2 bg-[#FFFFFF59] rounded-full h-12 w-12 items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <Image
            source={require("@/assets/icons/menu-bar.png")}
            style={{ height: 13, width: 16 }}
          />
        </TouchableOpacity>
        {/* Centered Title - positioned absolutely relative to full screen */}
        <Text
          style={{
            position: "absolute",
            left: 0,
            width: screenWidth,
            textAlign: "center",
            fontSize: 20,
            fontFamily: "Poppins-Medium",
            color: "#000000",
          }}
        >
          Courses
        </Text>
      </View>
      {/*right={
          <TouchableOpacity
            onPress={() => {
              router.push("/Authenticated/NotificationScreen");
            }}
            className="p-2 bg-[#FFFFFF59] rounded-full "
          >
            <Ionicons name="notifications-outline" size={24} color="black" />
          </TouchableOpacity>
        }*/}
      <FlatList
        data={[{ id: "1", type: "course" }]}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CoursesCarousel
            showSearchBar={false}
            orientation="vertical"
            showViewAll={false}
            screen={item.type}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <MenuBar
        visible={menuVisible}
        onClose={() => {
          setMenuVisible(false);
        }}
      />
    </View>
  );
};

export default Courses;

const styles = StyleSheet.create({});

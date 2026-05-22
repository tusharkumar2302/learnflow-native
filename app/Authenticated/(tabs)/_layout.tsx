import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import React from "react";
import { Dimensions, Image, Text, View } from "react-native";

export default function _layout() {
  const { width: screenWidth } = Dimensions.get("window");
  const { height: screenHeight } = Dimensions.get("window");
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
          backgroundColor: "rgba(229, 228, 247, 0.4)",
          borderTopWidth: 0,
          // height:91,
          height: 65,
          paddingHorizontal: 20,
          paddingBottom: 8,
          // paddingTop: 10,
          paddingTop: 5,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            android_ripple={{ color: "transparent" }}
            pressColor="transparent"
            pressOpacity={1}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="Home/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: screenHeight * 0.064,
                  marginTop: 16,
                  width: screenWidth * 0.252,
                  // backgroundColor: focused ? "#CAA2FC" : "",
                  backgroundColor: focused ? "#563FA5" : "",
                  borderRadius: 50,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require("@/assets/icons/Tabs/home-icon.png")}
                  style={{
                    width: screenWidth * 0.055,
                    height: screenHeight * 0.025,
                    tintColor: focused ? "#fff" : "#0000008C",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: focused ? "#FFFFFF" : "#0000008C",
                    fontSize: 12,
                    fontWeight: focused ? "600" : "600",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {"Home"}
                </Text>
              </View>
            </View>
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="Courses"
        options={{
          href: null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: screenHeight * 0.064,
                  marginTop: 16,
                  width: screenWidth * 0.252,
                  // backgroundColor: focused ? "#CAA2FC" : "",
                  backgroundColor: focused ? "#563FA5" : "",
                  borderRadius: 50,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require("@/assets/icons/Tabs/courses-icon.png")}
                  style={{
                    width: screenWidth * 0.055,
                    height: screenHeight * 0.025,
                    tintColor: focused ? "#fff" : "#0000008C",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: focused ? "#FFFFFF" : "#0000008C",
                    fontSize: 12,
                    fontWeight: focused ? "600" : "600",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {"Courses"}
                </Text>
              </View>
            </View>
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="Coins/index"
        options={{
          href: null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: screenHeight * 0.064,
                  marginTop: 16,
                  width: screenWidth * 0.252,
                  // backgroundColor: focused ? "#CAA2FC" : "",
                  backgroundColor: focused ? "#563FA5" : "",
                  borderRadius: 50,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require("@/assets/icons/Tabs/coins-icon.png")}
                  style={{
                    width: screenWidth * 0.055,
                    height: screenHeight * 0.025,
                    tintColor: focused ? "#fff" : "#0000008C",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: focused ? "#FFFFFF" : "#0000008C",
                    fontSize: 12,
                    fontWeight: focused ? "600" : "600",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {"Coins"}
                </Text>
              </View>
            </View>
          ),
        }}
      ></Tabs.Screen>

      <Tabs.Screen
        name="Profile/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 1,
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: screenHeight * 0.064,
                  marginTop: 16,
                  width: screenWidth * 0.252,
                  // backgroundColor: focused ? "#CAA2FC" : "",
                  backgroundColor: focused ? "#563FA5" : "",
                  borderRadius: 50,
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image
                  source={require("@/assets/icons/Tabs/profile-icon.png")}
                  style={{
                    width: screenWidth * 0.055,
                    height: screenHeight * 0.025,
                    tintColor: focused ? "#fff" : "#0000008C",
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: focused ? "#FFFFFF" : "#0000008C",
                    fontSize: 12,
                    fontWeight: focused ? "600" : "600",
                    textAlign: "center",
                    marginTop: 6,
                  }}
                >
                  {"Profile"}
                </Text>
              </View>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

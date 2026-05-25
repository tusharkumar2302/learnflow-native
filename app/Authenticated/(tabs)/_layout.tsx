import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  BookOpen01Icon,
  FlashIcon,
  Home01Icon,
  UserCircleIcon,
} from "@hugeicons/core-free-icons";
import { PlatformPressable } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { type IconSvgElement } from "@hugeicons/react-native";

interface TabIconProps {
  icon: IconSvgElement;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={s.tabItem}>
      <View style={[s.pill, focused && s.pillActive]}>
        <HugeiconsIcon
          icon={icon}
          size={moderateScale(20)}
          color={focused ? "#FFFFFF" : "rgba(255,255,255,0.40)"}
          strokeWidth={focused ? 2 : 1.5}
        />
        <Text style={[s.label, focused && s.labelActive]}>{label}</Text>
      </View>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: [
          s.tabBar,
          { paddingBottom: Math.max(insets.bottom, verticalScale(8)) },
        ],
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
            <TabIcon icon={Home01Icon} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Courses"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={BookOpen01Icon} label="Courses" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="Learn/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={FlashIcon} label="Learn" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="Challenges/index" options={{ href: null }} />
      <Tabs.Screen
        name="Profile/index"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={UserCircleIcon} label="Profile" focused={focused} />
          ),
        }}
      />
      {/* Coins screen: accessible via deep link, not a tab */}
      <Tabs.Screen name="Coins/index" options={{ href: null }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  tabBar: {
    backgroundColor: "#110820",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.06)",
    height: verticalScale(60),
    paddingTop: verticalScale(4),
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(5),
    borderRadius: scale(20),
    gap: verticalScale(2),
  },
  pillActive: {
    backgroundColor: "#7C3AED",
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: moderateScale(9),
    color: "rgba(255,255,255,0.40)",
    textAlign: "center",
  },
  labelActive: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
  },
});

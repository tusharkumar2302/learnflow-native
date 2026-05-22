import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { memo, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: ReactNode;
  titleNumberOfLines?: number;
  containerStyle?: ViewStyle;
}

const ScreenHeader = memo(
  ({
    title,
    onBack,
    rightElement,
    titleNumberOfLines = 2,
    containerStyle,
  }: ScreenHeaderProps) => {
    const router = useRouter();

    const handleBack = () => {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" color="#000000D9" size={24} />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text
            style={styles.title}
            numberOfLines={titleNumberOfLines}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
        </View>

        {rightElement ? (
          <View style={styles.rightContainer}>{rightElement}</View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    );
  }
);

ScreenHeader.displayName = "ScreenHeader";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF59",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 2,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#000000",
    textAlign: "left",
  },
  rightContainer: {
    minWidth: 40,
    alignItems: "flex-end",
  },
  placeholder: {
    width: 40,
  },
});

export default ScreenHeader;

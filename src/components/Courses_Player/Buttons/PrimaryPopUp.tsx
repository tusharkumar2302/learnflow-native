import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export default function PrimaryPopUp({
  title,
  styleTxt,
  styleView,
  onPress,
}: {
  title: string;
  styleTxt?: StyleProp<TextStyle>;
  styleView?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity style={[styles.button, styleView]} onPress={onPress}>
      <Text style={[styles.buttonText, styleTxt]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
    backgroundColor: "#D2A6F4",
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
  },
  buttonText: {
    color: "#000",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});

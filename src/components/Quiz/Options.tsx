import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const OptionButton = ({
  label,
  isSelected,
  onPress,
  onDoubleTap,
  index,
}: {
  label: string;
  isSelected: boolean;
  index: number;
  onPress: () => void;
  onDoubleTap: () => void;
}) => {
  const [option, setoption] = useState("");

  useEffect(() => {
    switch (index) {
      case 0:
        setoption("Option A");
        break;

      case 1:
        setoption("Option B");
        break;

      case 2:
        setoption("Option C");
        break;

      default:
        setoption("Option D");
        break;
    }
  }, []);

  return (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.optionSelected]}
      onPress={isSelected ? onDoubleTap : onPress}
    >
      <View style={styles.radioOuter}>
        {isSelected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.optionText}>
        {option} : {label}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionButton;

const styles = StyleSheet.create({
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#4343431A",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionSelected: { borderColor: "#730A96", backgroundColor: "#ECE9F4" },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#000000A6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#730A96",
  },
  optionText: {
    fontSize: 16,
    flex: 1,
    color: "#000000A6",
    fontWeight: "400",
    fontFamily: "HelveticaNeue-Medium",
    textAlign: "left",
    paddingLeft: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
});

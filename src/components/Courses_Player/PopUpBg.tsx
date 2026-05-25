import React from "react";
import { Modal, StyleSheet, View } from "react-native";

interface PopUpBgProps {
  children: React.ReactNode;
  visible?: boolean;
}

const PopUpBg = ({ children, visible }: PopUpBgProps) => {
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.content}>{children}</View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
});

export default PopUpBg;

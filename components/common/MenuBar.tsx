import React from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import Modal from "react-native-modal";

type SlidingMenuProps = {
  visible: boolean;
  onClose: () => void;
};

const { height } = Dimensions.get("window");

const SlidingMenu: React.FC<SlidingMenuProps> = ({ visible, onClose }) => {
  return (
    <Modal
      isVisible={visible}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      onBackdropPress={onClose}
      backdropColor="black"
      backdropOpacity={0.4}
      style={{
        margin: 0,
        justifyContent: "flex-start",
        alignItems: "flex-start",
        height: height,
      }}
    >
      <View
        className="w-[75vw] bg-white p-6 absolute top-0 left-0"
        style={{ height }}
      >
        <Text className="text-xl mb-4">Home</Text>
        <Text className="text-xl mb-4">Profile</Text>
        <Text className="text-xl mb-4">Settings</Text>
        <TouchableOpacity onPress={onClose}>
          <Text className="text-xl text-red-500 mt-8">Close Menu</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default SlidingMenu;

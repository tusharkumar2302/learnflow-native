import { Image, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="#0F0820" />
      <Image
        source={require("@/assets/images/Splash-screen.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0820",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    width: "100%",
  },
});

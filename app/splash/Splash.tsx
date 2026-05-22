import { useRouter } from "expo-router";
import { Image, StatusBar, StyleSheet, TouchableOpacity } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import BackgroundWrapper from "../../components/common/BackgroundWrapper";

const Splash = () => {
  const router = useRouter();
  return (
    <BackgroundWrapper colors={["#000000", "#000000"] as const}>
      <StatusBar style="light" backgroundColor="#000000" />

      <TouchableOpacity
        style={styles.center}
      >
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>
    </BackgroundWrapper>
  );
};

export default Splash;

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    width: scale(282),
    height: verticalScale(52),
    resizeMode: "contain",
  },
});

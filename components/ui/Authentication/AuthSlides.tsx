import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
import PagerView from "react-native-pager-view";

const slides = [
  {
    title: "Deposit $100 into\nZuperior & access\nZuperlearn",
    image: require("@/assets/modal/deposit.png"),
  },
  {
    title: "Watch FREE\nCourses & Earn\nZuper Coins",
    image: require("@/assets/images/slide2.png"),
  },
  {
    title: "Redeem your\nZuperCoins to\nZuperior Account",
    image: require("@/assets/images/slide3.png"),
  },
];

export const AuthSlides = () => {
  const [page, setPage] = useState(0);

  return (
    <>
      <PagerView
        style={{ height: verticalScale(300) }}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {slides.map((item, index) => (
          <View key={index} style={styles.slide}>
            <Text style={styles.heading}>{item.title}</Text>

            <View style={styles.imageContainer}>
              <Image
                source={item.image}
                style={styles.image}
                resizeMode="contain"
              />
            </View>
          </View>
        ))}
      </PagerView>

      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, page === i && styles.activeDot]} />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    // paddingTop: verticalScale(20),
  },

  heading: {
    fontSize: scale(30),
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
    lineHeight: verticalScale(30),
    marginBottom: verticalScale(10),
  },

  imageContainer: {
    width: "100%",
    height: verticalScale(200),
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "#000",
  },

  image: {
    width: scale(200),
    height: verticalScale(200),
    // borderWidth: 1,
    // borderColor: "#000",
  },

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // borderWidth: 1,
    // borderColor: "#000",
    // marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },

  dot: {
    width: scale(20),
    height: scale(8),
    borderRadius: scale(4),
    backgroundColor: "#00000030",
    marginHorizontal: scale(4),
  },

  activeDot: {
    backgroundColor: "#7C66C2",
    width: scale(18),
    borderRadius: scale(4),
  },
});

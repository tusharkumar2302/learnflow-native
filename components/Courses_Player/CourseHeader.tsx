import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CourseHeaderProps {
  title: string;
  points: number;
  Totalpoints: number;
}

const CourseHeader: React.FC<CourseHeaderProps> = ({
  title,
  points,
  Totalpoints,
}) => {
  const router = useRouter();
  const handleBackPress = () => {
    router.replace("/Authenticated/(tabs)/Courses");
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity> 

      <View style={styles.contentContainer}>
        <Text
          className="font-poppins-medium text-[16px] max-w-[70%]"
          ellipsizeMode="tail"
          numberOfLines={2}
        >
          {title}
        </Text>

        <View style={styles.pointsContainer}>
          <Image
            style={styles.headerCoin}
            source={require("@/assets/icons/CourseVdo/iconLogo.png")}
          />
          <Text style={styles.points}>{Totalpoints}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
   // paddingVertical: 8,
    backgroundColor: "#f6f0ff",
   // marginTop: 10,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    padding: 0,
    backgroundColor: "#FFFFFF59",
    borderRadius: 20,
    height: 46,
    width: 46,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    fontFamily: "Poppins-Medium",
    flex: 1,
    marginRight: 8,
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 0,
  },
  points: {
    fontSize: 14,
    color: "#730A96",
    fontWeight: "700",
    fontFamily: "HelveticaNeue-Bold",
  },
  headerCoin: {
    height: 18,
    width: 18,
  },
});

export default CourseHeader;

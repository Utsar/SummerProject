import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { baseStyles } from "../styles/baseStyles";
import { useSelector } from "react-redux";

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState("Guest");
  const user = useSelector((state) => state.user); // Assuming you have user state in Redux

  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome {userName}!</Text>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate("Profile")}
      >
        <Text style={styles.navButtonText}>Go to Profile</Text>
      </TouchableOpacity>
      {/* Add more navigational elements here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...baseStyles.container,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    ...baseStyles.title,
    marginBottom: 20,
  },
  navButton: {
    ...baseStyles.button,
    marginBottom: 10,
  },
  navButtonText: {
    ...baseStyles.buttonText,
  },
});

export default HomeScreen;

// HomeScreen.js
import React from "react";
import { Button, View, Text, StyleSheet } from "react-native";
import { baseStyles } from "../styles/baseStyles";

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome to the Home Screen!</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate("Profile")}
      />
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
});

export default HomeScreen;

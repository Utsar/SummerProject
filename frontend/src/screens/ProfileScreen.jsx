// src/screens/ProfileScreen.js

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const ProfileScreen = ({ user }) => {
  // Assuming user object is passed in as a prop or fetched from a context.
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.profilePicture }}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
      {/* Add more user details if needed */}
    </View>
  );
};

// styles for ProfileScreen

export default ProfileScreen;

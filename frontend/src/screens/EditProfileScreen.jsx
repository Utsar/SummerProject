// src/screens/EditProfileScreen.js

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const EditProfileScreen = ({ user, navigation }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  // ... other user details

  const handleUpdate = async () => {
    try {
      const response = await axios.put("/editProfile", {
        username,
        email, // ... other details
      });
      // Handle successful update and navigate back.
      navigation.goBack();
    } catch (error) {
      // Handle update errors.
      console.error("Profile update failed:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      {/* Add more fields as needed */}
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

// similar styles to other screens

export default EditProfileScreen;

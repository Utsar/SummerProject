// src/screens/RegistrationScreen.js

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // This can be a link to an image or a blob.

  const handleRegister = async () => {
    try {
      const response = await axios.post("/register", {
        username,
        email,
        password,
        profilePicture,
      });
      // Handle successful registration, perhaps navigate to login or home screen.
      navigation.navigate("Login");
    } catch (error) {
      // Handle errors like duplicate username/email.
      console.error("Registration failed:", error);
    }
  };

  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>Register</Text>
      <TextInput
        style={baseStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={baseStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* ... other input fields */}
      <TouchableOpacity style={baseStyles.button} onPress={handleRegister}>
        <Text style={baseStyles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegistrationScreen;

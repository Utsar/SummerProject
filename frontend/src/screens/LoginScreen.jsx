// src/screens/LoginScreen.js

import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("/login", {
        username,
        password,
      });
      // Handle successful login, navigate to home or other screen.
      navigation.navigate("Home");
    } catch (error) {
      // Handle login errors.
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>Login</Text>
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
      <TouchableOpacity style={baseStyles.button} onPress={handleLogin}>
        <Text style={baseStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

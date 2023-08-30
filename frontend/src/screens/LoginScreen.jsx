import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import { baseStyles } from "../styles/baseStyles";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateForm = () => {
    if (!email || !password) {
      return false;
    }
    // Add more validation checks here as needed
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Both fields are required.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/login", {
        email,
        password,
      });
      setLoading(false);
      // Store the token securely (Not shown here)
      Alert.alert("Success", "Login successful.");
      navigation.navigate("Home");
    } catch (error) {
      setLoading(false);
      setError("Login failed.");
      Alert.alert("Error", "Login failed.");
      console.error("Login failed:", error);
    }
  };

  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>Login</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={baseStyles.errorText}>{error}</Text>}
      <TextInput
        accessibilityLabel="Email Input"
        style={baseStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        accessibilityLabel="Password Input"
        style={baseStyles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        accessibilityLabel="Login Button"
        style={baseStyles.button}
        onPress={handleLogin}
      >
        <Text style={baseStyles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

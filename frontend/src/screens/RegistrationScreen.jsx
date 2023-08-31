import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import baseStyles from "../styles/baseStyles";

const RegistrationScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();

  const validateForm = () => {
    if (!username || !email || !password) {
      return "All fields are required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    return null;
  };

  const handleRegister = async () => {
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://backend-url/register", {
        username,
        email,
        password,
      });

      signIn(response.data.user, response.data.token); // Assuming the backend returns a user object and a token
      navigation.navigate("Login");
    } catch (e) {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={baseStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={baseStyles.title}>Register</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
          <TextInput
            style={baseStyles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
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
          <TouchableOpacity style={baseStyles.button} onPress={handleRegister}>
            <Text style={baseStyles.buttonText}>Register</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

RegistrationScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});

export default RegistrationScreen;

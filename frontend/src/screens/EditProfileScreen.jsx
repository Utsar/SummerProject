import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { baseStyles } from "../styles/baseStyles";

const EditProfileScreen = ({ user, navigation }) => {
  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const response = await axios.put("/editProfile", {
        username,
        email,
      });
      setLoading(false);
      setSuccess("Profile updated successfully.");
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      setError("Profile update failed.");
      console.error("Profile update failed:", error);
    }
  };

  return (
    <View style={baseStyles.container}>
      <Text style={baseStyles.title}>Edit Profile</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error && <Text style={baseStyles.errorText}>{error}</Text>}
      {success && <Text style={baseStyles.successText}>{success}</Text>}
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={baseStyles.input}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={baseStyles.input}
      />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
};

export default EditProfileScreen;

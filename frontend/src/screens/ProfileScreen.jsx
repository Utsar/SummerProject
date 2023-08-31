import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth"; // Importing our useAuth hook
import { getUserProfile } from "../services/user/userService";

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth(); // Get user and token from our custom hook

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user || !token) {
          throw new Error("User or token is not available.");
        }
        const fetchedUserProfile = await getUserProfile(user._id, token);
        // Update user state with fetched profile (assuming that useAuth provides a method to do so)
        // For now, let's just log it
        console.log(fetchedUserProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, token]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!user) {
    return <Text>No user data available. Please log in.</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: user.profilePicture }}
        style={styles.profileImage}
      />
      <Text style={styles.username}>{user.username}</Text>
      <Text style={styles.email}>{user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  username: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  email: {
    fontSize: 16,
    margin: 5,
  },
});

export default ProfileScreen;

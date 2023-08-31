import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../services/locationService";
import axios from "axios"; // Import axios for making API calls
import { baseStyles } from "../styles/baseStyles"; // Import baseStyles for consistent styling

/**
 * NearbyUsersScreen Component
 * - Displays other users near the user's current location on a map.
 * - Fetches nearby users based on the user's current location.
 */
const NearbyUsersScreen = () => {
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch nearby users based on the current location
  const fetchNearbyUsers = async () => {
    setLoading(true); // Set loading to true while fetching data
    try {
      const { latitude, longitude } = location; // Destructure latitude and longitude from location state
      const response = await axios.get("/api/getNearbyStreamingUsers", {
        params: { latitude, longitude }, // Pass latitude and longitude as query params
      });
      setNearbyUsers(response.data.users); // Update the nearbyUsers state
      setLoading(false); // Set loading to false after fetching data
    } catch (err) {
      setError("Failed to fetch nearby users"); // Set error message
      setLoading(false); // Set loading to false
    }
  };

  // UseEffect to fetch nearby users whenever the location changes
  useEffect(() => {
    if (location) fetchNearbyUsers(); // If location exists, fetch nearby users
  }, [location]);

  // UseEffect to fetch the user's current location when the component mounts
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const userLocation = await getCurrentLocation(); // Fetch user's current location
        setLocation(userLocation); // Update location state
      } catch (err) {
        setError("Failed to get location"); // Set error message
        setLoading(false); // Set loading to false
      }
    };
    fetchLocation();
  }, []);

  return (
    <View style={baseStyles.container}>
      {loading ? (
        <ActivityIndicator style={baseStyles.loadingIndicator} size="large" />
      ) : error ? (
        <View style={baseStyles.errorContainer}>
          <Text style={baseStyles.errorText}>{error}</Text>
          <TouchableOpacity
            style={baseStyles.retryButton}
            onPress={fetchNearbyUsers}
          >
            <Text style={baseStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MapView
          style={baseStyles.mapView}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {nearbyUsers.map((user) => (
            <Marker
              key={user._id}
              coordinate={user.location.coordinates}
              title={user.username}
              description="Click to view profile"
              // Future enhancement: Add onPress to navigate to user's profile
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

export default NearbyUsersScreen;

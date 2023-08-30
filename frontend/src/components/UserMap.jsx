import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../services/locationService";
import { baseStyles } from "../styles/baseStyles";

// Environment variables
const DEFAULT_LATITUDE = process.env.DEFAULT_LATITUDE || -34.397;
const DEFAULT_LONGITUDE = process.env.DEFAULT_LONGITUDE || 150.644;

/**
 * UserMap Component
 * - Displays the user's current location on a map.
 * - Fetches the user's current location using the Geolocation service.
 * - Displays the location using a marker on the map.
 */
const UserMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  return (
    <View style={baseStyles.container}>
      {loading ? (
        <ActivityIndicator
          style={baseStyles.loadingIndicator}
          size="large"
          color="#0000ff"
        />
      ) : error ? (
        <View style={baseStyles.errorContainer}>
          <Text style={baseStyles.errorText}>{error}</Text>
          <TouchableOpacity
            style={baseStyles.retryButton}
            onPress={fetchLocation}
          >
            <Text style={baseStyles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <MapView
          style={baseStyles.mapView}
          initialRegion={{
            latitude: location ? location.latitude : DEFAULT_LATITUDE,
            longitude: location ? location.longitude : DEFAULT_LONGITUDE,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
            />
          )}
        </MapView>
      )}
    </View>
  );
};

export default UserMap;

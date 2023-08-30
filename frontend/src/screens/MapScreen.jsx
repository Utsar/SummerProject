import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { baseStyles } from "../styles/baseStyles";
import { getCurrentLocation } from "../services/locationService"; // Import your location service

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserLocation = async () => {
    try {
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);
      setLoading(false);
    } catch (err) {
      setError("Failed to load map");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserLocation();
  }, []);

  return (
    <View style={baseStyles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location ? location.latitude : 37.78825,
            longitude: location ? location.longitude : -122.4324,
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

const styles = StyleSheet.create({
  map: {
    ...baseStyles.map,
    flex: 1,
  },
});

export default MapScreen;

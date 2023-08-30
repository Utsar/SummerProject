import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../services/locationService";

/**
 * UserMap Component
 * - Displays the user's current location on a map.
 * - Fetches the user's current location using the Geolocation service.
 * - Displays the location using a marker on the map.
 */
const UserMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the user's current location and set it to the state
    const fetchLocation = async () => {
      try {
        const userLocation = await getCurrentLocation();
        setLocation(userLocation);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchLocation();
  }, []);

  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: location ? location.latitude : -34.397,
        longitude: location ? location.longitude : 150.644,
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
  );
};

export default UserMap;

import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../services/locationService";

/**
 * NearbyUsersScreen Component
 * - Displays other users near the user's current location on a map.
 */
const NearbyUsersScreen = () => {
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);

  useEffect(() => {
    const fetchNearbyUsers = async () => {
      // Pseudo: Fetch users from backend API using current location
      const users = await fetchUsersNearLocation(location);
      setNearbyUsers(users);
    };

    // If location is set, fetch nearby users
    if (location) fetchNearbyUsers();
  }, [location]);

  useEffect(() => {
    // Fetch the user's current location and set it to the state
    const fetchLocation = async () => {
      try {
        const userLocation = await getCurrentLocation();
        setLocation(userLocation);
      } catch (err) {
        console.error("Failed to get location:", err);
      }
    };

    fetchLocation();
  }, []);

  return (
    <MapView style={{ flex: 1 }} initialRegion={"TODO"}>
      {nearbyUsers.map((user) => (
        <Marker
          key={user._id}
          coordinate={user.location.coordinates}
          title={user.username}
          description="Click to view profile"
          // Possibly add an onPress to view user's profile or send a video request
        />
      ))}
    </MapView>
  );
};

export default NearbyUsersScreen;

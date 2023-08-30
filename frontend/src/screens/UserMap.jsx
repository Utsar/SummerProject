import React, { useState, useEffect } from "react";
import MapView, { Marker } from "react-native-maps";
import { getCurrentLocation } from "../services/locationService";
import { baseStyles } from "../styles/baseStyles";

const UserMap = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
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
      style={styles.map}
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

const styles = StyleSheet.create({
  map: {
    ...baseStyles.map,
    flex: 1,
  },
});

export default UserMap;

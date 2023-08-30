import React from "react";
import MapView from "react-native-maps";
import { baseStyles } from "../styles/baseStyles";

const MapScreen = () => {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    />
  );
};

const styles = {
  map: {
    ...baseStyles.map,
    flex: 1,
  },
};

export default MapScreen;

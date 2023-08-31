import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import PropTypes from "prop-types";
import { useDebounce } from "../hooks/useDebounce"; // Import the debounce hook

const SearchScreen = () => {
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false); // To track loading state
  const [cache, setCache] = useState({}); // To store cached results

  // Debounce the location query
  const debouncedLocation = useDebounce(location, 300);

  useEffect(() => {
    if (debouncedLocation && !cache[debouncedLocation]) {
      setLoading(true);
    }
  }, [debouncedLocation]);

  // Error handling function
  const handleError = (error) => {
    console.error("An error occurred:", error);
    setLoading(false);
  };

  const handlePress = (data, details = null) => {
    const newLocation = details?.formatted_address || "";
    setLocation(newLocation);
    setLoading(false);

    // Store this in cache
    setCache((prevCache) => ({ ...prevCache, [newLocation]: details }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a location:</Text>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <GooglePlacesAutocomplete
        placeholder="Enter Location"
        minLength={3} // Set minimum length to 3
        fetchDetails={true}
        query={{
          key: process.env.GOOGLE_API_KEY,
          language: "en",
        }}
        onPress={handlePress}
        onFail={handleError} // Error handling
        styles={styles.googlePlaces}
      />
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => setLocation("")}
      >
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
      <Text style={styles.locationText}>
        Your selected location is: {location}
      </Text>
    </View>
  );
};

SearchScreen.propTypes = {
  // Define your prop validations here, if any
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  clearButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  clearButtonText: {
    color: "#333",
  },
  locationText: {
    marginTop: 20,
    fontSize: 16,
  },
  googlePlaces: {
    textInputContainer: {
      backgroundColor: "grey",
    },
    textInput: {
      height: 38,
      color: "#5d5d5d",
      fontSize: 16,
    },
    predefinedPlacesDescription: {
      color: "#1faadb",
    },
  },
});

export default SearchScreen;

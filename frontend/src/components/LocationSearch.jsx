import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { debounce } from "lodash";
import { baseStyles } from "../../../styles/baseStyles"; // Update the import path based on your folder structure

// Debounced function for fetching suggestions
const debouncedFetch = debounce((query, setSuggestions) => {
  // Simulated function to fetch suggestions from Google Places
  // setSuggestions(fetchedData);
}, 300);

const LocationSearch = ({ onLocationSelect }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const fetchSuggestions = (query) => {
    try {
      debouncedFetch(query, setSuggestions);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <View style={baseStyles.container}>
      <TextInput
        style={baseStyles.input}
        value={input}
        onChangeText={(text) => {
          setInput(text);
          fetchSuggestions(text);
        }}
        placeholder="Search for a location..."
        placeholderTextColor="#ccc"
        accessibilityLabel="Search for a location"
      />
      {error && <Text style={baseStyles.text}>Error: {error}</Text>}
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.placeId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={baseStyles.button}
            onPress={() => {
              setInput(item.description);
              onLocationSelect(item);
              setSuggestions([]);
            }}
            accessibilityLabel={`Select location ${item.description}`}
          >
            <Text style={baseStyles.buttonText}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

LocationSearch.propTypes = {
  onLocationSelect: PropTypes.func.isRequired,
};

export default LocationSearch;

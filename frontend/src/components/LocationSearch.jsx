import React, { useState } from "react";
import { TextInput, FlatList, TouchableOpacity, Text } from "react-native";

/**
 * LocationSearch Component
 * - Allows users to search for a location.
 * - Displays autocomplete suggestions based on the user's input.
 * - User can select a suggestion to set a location.
 */
const LocationSearch = ({ onLocationSelect }) => {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Simulated function to fetch suggestions from Google Places
  const fetchSuggestions = (query) => {
    // Pseudo: Use Google Places API to fetch suggestions based on query
    // setSuggestions(fetchedData);
  };

  return (
    <>
      <TextInput
        value={input}
        onChangeText={(text) => {
          setInput(text);
          fetchSuggestions(text);
        }}
        placeholder="Search for a location..."
      />
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.placeId}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setInput(item.description);
              onLocationSelect(item);
              setSuggestions([]);
            }}
          >
            <Text>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </>
  );
};

export default LocationSearch;

import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const SearchScreen = () => {
  const [location, setLocation] = useState("");

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Search for a location:</Text>
      <GooglePlacesAutocomplete
        placeholder="Enter Location"
        minLength={2}
        fetchDetails={true}
        query={{
          key: process.env.GOOGLE_API_KEY,
          language: "en",
        }}
        onPress={(data, details = null) => {
          setLocation(details.formatted_address);
        }}
        styles={{
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
        }}
      />
      <Text>Your selected location is: {location}</Text>
    </View>
  );
};

export default SearchScreen;

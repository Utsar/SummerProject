// src/components/Error.js
import React from "react";
import { View, Text, Button } from "react-native";

const Error = ({ message, onRetry }) => (
  <View>
    <Text>Error: {message}</Text>
    <Button title="Retry" onPress={onRetry} />
  </View>
);

export default Error;

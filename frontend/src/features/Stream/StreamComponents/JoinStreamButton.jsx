import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, TouchableOpacity } from "react-native";
import { joinStream } from "../../../store/slices/streamSlice"; // Update the import path
import { baseStyles } from "../../../styles/baseStyles";

const JoinStreamButton = () => {
  const dispatch = useDispatch();
  const { isFree, userBalance, streamCost } = useSelector(
    (state) => state.stream
  );

  const handleJoin = () => {
    // Here, you'd typically make an API call to join the stream
    // For now, we'll just update the Redux state
    dispatch(joinStream({ isFree, userBalance, streamCost }));
  };

  if (!isFree && userBalance < streamCost) {
    return null;
  }

  return (
    <View style={baseStyles.container}>
      <TouchableOpacity style={baseStyles.button} onPress={handleJoin}>
        <Text style={baseStyles.buttonText}>Join Stream</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JoinStreamButton;

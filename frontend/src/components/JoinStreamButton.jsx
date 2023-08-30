// components/JoinStreamButton.js

import React from "react";
import { Button } from "react-native";

const JoinStreamButton = ({ isFree, userBalance, streamCost, onJoin }) => {
  if (!isFree && userBalance < streamCost) {
    return null; // Don't show the button if the user can't afford a fee-based stream.
  }

  return <Button title="Join Stream" onPress={onJoin} />;
};

export default JoinStreamButton;

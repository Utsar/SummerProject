// components/StreamerInstructions.js

import React, { useEffect } from "react";
import { View, Text } from "react-native";
import io from "socket.io-client";

const socket = io("http://your-server-url:3000");

const StreamerInstructions = () => {
  useEffect(() => {
    socket.on("receive-instruction", (instruction) => {
      // Handle the instruction here, e.g., update state, show a notification, etc.
      console.log(instruction);
    });

    return () => {
      socket.off("receive-instruction");
    };
  }, []);

  return <View>{/* Your component UI here */}</View>;
};

export default StreamerInstructions;

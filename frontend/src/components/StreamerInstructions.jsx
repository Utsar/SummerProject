import React, { useEffect } from "react";
import { View, Text, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useSocket } from "../contexts/SocketContext";
import { addInstruction } from "../slices/streamSlice";

const StreamerInstructions = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const instructions = useSelector((state) => state.stream.instructions);

  useEffect(() => {
    socket.on("receive-instruction", (instruction) => {
      dispatch(addInstruction(instruction));
    });

    return () => {
      socket.off("receive-instruction");
    };
  }, [socket, dispatch]);

  return (
    <View>
      <Text>Instructions:</Text>
      <FlatList
        data={instructions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
    </View>
  );
};

export default StreamerInstructions;

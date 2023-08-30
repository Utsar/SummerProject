// StreamChat.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import io from "socket.io-client";

const socket = io("http://your-server-url:3000");

const StreamChat = () => {
  const [message, setMessage] = useState("");
  const [instructions, setInstructions] = useState([]);

  useEffect(() => {
    socket.on("receive-instruction", (data) => {
      setInstructions((prev) => [...prev, data]);
    });
  }, []);

  const sendInstruction = () => {
    socket.emit("send-instruction", message);
    setMessage("");
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={instructions}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => <Text>{item}</Text>}
      />
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Type your instruction"
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 8,
          marginVertical: 8,
        }}
      />
      <Button title="Send Instruction" onPress={sendInstruction} />
    </View>
  );
};
export default StreamChat;

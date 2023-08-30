import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  initializeSocket,
  sendInstruction as sendSocketInstruction,
} from "../services/socketService";
import { baseStyles } from "../styles/baseStyles";

const StreamChat = ({ userId }) => {
  const [message, setMessage] = useState("");
  const [instructions, setInstructions] = useState([]);
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeSocket((data) => {
      setInstructions((prev) => [...prev, data]);
      flatListRef.current.scrollToEnd({ animated: true });
    });
  }, []);

  const sendInstruction = () => {
    sendSocketInstruction(message, userId);
    setMessage("");
  };

  return (
    <View style={baseStyles.container}>
      <FlatList
        ref={flatListRef}
        data={instructions}
        keyExtractor={(item, index) => `instruction-${index}`}
        renderItem={({ item }) => (
          <Text style={baseStyles.text}>
            {item.userId === userId ? "You" : item.userId}: {item.instruction}
          </Text>
        )}
      />
      <TextInput
        value={message}
        onChangeText={(text) => setMessage(text)}
        placeholder="Type your instruction"
        style={baseStyles.input}
        accessibilityLabel="Type your instruction here"
      />
      <Button
        title="Send Instruction"
        onPress={sendInstruction}
        accessibilityLabel="Send the instruction"
      />
    </View>
  );
};

StreamChat.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default StreamChat;

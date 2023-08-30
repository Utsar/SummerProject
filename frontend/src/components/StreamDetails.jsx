// StreamDetails.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import JoinStreamButton from "../components/JoinStreamButton"; // Import the JoinStreamButton component

const StreamDetails = ({ route, navigation }) => {
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { streamId } = route.params;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/stream/details/${streamId}`)
      .then((response) => {
        setStream(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [streamId]);

  const handleJoinStream = () => {
    // TODO: Handle the logic to join the stream
    navigation.navigate("StreamPlayer", { streamId: stream._id });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error fetching stream details: {error}</Text>
      ) : (
        <>
          <Text style={styles.streamName}>{stream.name}</Text>
          <Text style={styles.streamDesc}>{stream.description}</Text>
          <Text style={styles.streamInfo}>
            {stream.isFree ? "Free" : `Fee: $${stream.fee}`}
          </Text>
          <JoinStreamButton
            isFree={stream.isFree}
            userBalance={" TODO Fetch user's balance "} //TODO Fetch user's balance
            streamCost={stream.fee}
            onJoin={handleJoinStream}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  streamName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  streamDesc: {
    fontSize: 16,
    marginTop: 8,
  },
  streamInfo: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
  },
});

export default StreamDetails;

import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet } from "react-native";
import axios from "axios";

const StreamList = ({ navigation }) => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/stream/list")
      .then((response) => {
        setStreams(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Streams</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>Error fetching streams: {error}</Text>
      ) : (
        <FlatList
          data={streams}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.streamItem}>
              <Text style={styles.streamName}>{item.name}</Text>
              <Text style={styles.streamInfo}>
                {item.isFree ? "Free" : `Fee: $${item.fee}`}
              </Text>
              <Button
                title="View Details"
                onPress={() =>
                  navigation.navigate("StreamDetails", { streamId: item._id })
                }
              />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  streamItem: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
    borderRadius: 5,
  },
  streamName: {
    fontSize: 18,
  },
  streamInfo: {
    fontSize: 14,
    color: "#555",
  },
});

export default StreamList;

import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import Video from "react-native-video";
import { baseStyles } from "../styles/baseStyles";

const StreamPlayer = ({ route }) => {
  const { streamId } = route.params;

  // State to manage loading and error
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  // Function to execute when the video is fully loaded
  const onVideoLoad = () => {
    setLoading(false);
  };

  // Function to execute when there is an error in video loading
  const onVideoError = () => {
    setError(true);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading && <ActivityIndicator size="large" color="#0000ff" />}
      {isError ? (
        <Text>Error loading the video</Text>
      ) : (
        <Video
          source={{ uri: `/stream/${streamId}` }} // Consider moving base URL to environment variables
          style={styles.video}
          controls={true}
          onLoad={onVideoLoad} // Function to run when the video loads
          onError={onVideoError} // Function to run if an error occurs
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: baseStyles.backgroundColor,
  },
  video: {
    ...baseStyles.video,
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default StreamPlayer;

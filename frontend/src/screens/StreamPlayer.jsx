// StreamPlayer.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Video from "react-native-video";
import { baseStyles } from "../styles/baseStyles";

const StreamPlayer = ({ route }) => {
  const { streamId } = route.params;

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: `/stream/${streamId}` }}
        style={styles.video}
        controls={true}
      />
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

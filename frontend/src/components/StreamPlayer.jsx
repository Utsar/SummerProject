// StreamPlayer.js
import React from "react";
import { View } from "react-native";
import Video from "react-native-video";

const StreamPlayer = ({ route }) => {
  const { streamId } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri: `/stream/${streamId}` }}
        style={{ position: "absolute", top: 0, left: 0, bottom: 0, right: 0 }}
        controls={true}
      />
    </View>
  );
};
export default StreamPlayer;

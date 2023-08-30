import React, { useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setStreams, setLoading, setError } from "../store/streamSlice";
import Loading from "../components/Loading";
import Error from "../components/Error";
import baseStyles from "../styles/baseStyles"; // Replace with your actual baseStyles import

const StreamList = ({ navigation }) => {
  // Redux state
  const streams = useSelector((state) => state.stream.streams);
  const loading = useSelector((state) => state.stream.loading);
  const error = useSelector((state) => state.stream.error);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));
        const response = await axios.get("/stream/list"); // Replace with your actual API endpoint
        dispatch(setStreams(response.data));
      } catch (err) {
        dispatch(setError(err.message));
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <View style={[baseStyles.container, styles.container]}>
      <Text style={[baseStyles.title, styles.title]}>Available Streams</Text>
      {loading ? (
        <Loading />
      ) : error ? (
        <Error errorMessage={error} />
      ) : (
        <FlatList
          data={streams}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={[baseStyles.card, styles.streamItem]}>
              <Text style={[baseStyles.cardTitle, styles.streamName]}>
                {item.name}
              </Text>
              <Text style={[baseStyles.cardSubtitle, styles.streamInfo]}>
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
  // Add any additional styles specific to StreamList here
});

export default StreamList;

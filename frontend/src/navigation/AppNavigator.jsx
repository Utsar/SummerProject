import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StreamList from "./StreamList";
import StreamDetails from "./StreamDetails";
import StreamPlayer from "./StreamPlayer";
// ... import other screens

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StreamList">
        <Stack.Screen name="StreamList" component={StreamList} />
        <Stack.Screen name="StreamDetails" component={StreamDetails} />
        <Stack.Screen name="StreamPlayer" component={StreamPlayer} />
        {/* ... other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

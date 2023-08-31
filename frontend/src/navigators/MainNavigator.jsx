// src/navigators/MainNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeNavigator from "./HomeNavigator";
// Import other feature-based navigators here

const MainStack = createStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator initialRouteName="Home">
      <MainStack.Screen name="Home" component={HomeNavigator} />
      {/* Add other feature-based navigators here */}
    </MainStack.Navigator>
  );
};

export default MainNavigator;

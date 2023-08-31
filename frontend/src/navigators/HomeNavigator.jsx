// src/navigators/HomeNavigator.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import StreamScreen from "../screens/StreamScreen";
import { useAuth } from "../hooks/useAuth";

const HomeStack = createStackNavigator();

const HomeNavigator = () => {
  const { user } = useAuth();

  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen
        name="Profile"
        component={user ? ProfileScreen : HomeScreen}
      />
      <HomeStack.Screen name="Stream" component={StreamScreen} />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;

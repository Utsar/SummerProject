import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let userInfo;

      try {
        userToken = await AsyncStorage.getItem("userToken");
        userInfo = JSON.parse(await AsyncStorage.getItem("userInfo"));
      } catch (e) {
        console.error("Restoring token failed", e);
      }

      setToken(userToken);
      setUser(userInfo);
    };

    bootstrapAsync();
  }, []);

  const authContextValue = {
    user,
    token,
    signIn: async (newUser, newToken) => {
      setUser(newUser);
      setToken(newToken);
      await AsyncStorage.setItem("userToken", newToken);
      await AsyncStorage.setItem("userInfo", JSON.stringify(newUser));
    },
    signOut: async () => {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userInfo");
    },
  };

  return authContextValue;
};

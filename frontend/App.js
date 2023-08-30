// App.js
import React from "react";
import { Provider } from "react-redux"; // Make sure to import this if it's not already done
import store from "./store"; // Import the store
import { ThemeProvider } from "./contexts/ThemeContext";
import { SocketProvider } from "./contexts/SocketContext"; // Import the SocketProvider
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        {" "}
        {/* Wrap your components inside the SocketProvider */}
        <ThemeProvider>
          <AppNavigator />
        </ThemeProvider>
      </SocketProvider>
    </Provider>
  );
}

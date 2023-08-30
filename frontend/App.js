// App.js

import React from "react";
import store from "./store"; // Import the store
import { ThemeProvider } from "./contexts/ThemeContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </Provider>
  );
}

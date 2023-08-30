// frontend/src/store/index.js

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice"; // Import the user reducer
import streamReducer from "./slices/streamSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    stream: streamReducer,
  },
});

export default store;

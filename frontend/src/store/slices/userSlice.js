// frontend/src/slices/userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: null,
  username: null,
  balance: 0,
  // ... Add more fields as needed
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      // Handle login logic here
      state.id = action.payload.id;
      state.username = action.payload.username;
    },
    logout: (state) => {
      // Handle logout logic here
      return initialState;
    },
    updateBalance: (state, action) => {
      // Update the user balance
      state.balance = action.payload;
    },
    // ... Add more reducers as needed
  },
});

export const { login, logout, updateBalance } = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

export const streamSlice = createSlice({
  name: "stream",
  initialState: {
    streams: [],
    loading: false,
    error: null,
    isFree: true,
    userBalance: 0,
    streamCost: 0,
  },
  reducers: {
    setStreams: (state, action) => {
      state.streams = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    joinStream: (state, action) => {
      const { isFree, userBalance, streamCost } = action.payload;
      state.isFree = isFree;
      state.userBalance = userBalance;
      state.streamCost = streamCost;
    },
  },
});

export const { setStreams, setLoading, setError, joinStream } =
  streamSlice.actions;
export default streamSlice.reducer;

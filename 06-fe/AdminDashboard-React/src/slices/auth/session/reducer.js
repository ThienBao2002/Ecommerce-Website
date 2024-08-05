import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  isSessionActive: false,
  sessionError: null,
  loading: false,
  decodedToken: null,
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    sessionStarted(state) {
      state.isSessionActive = true;
      state.sessionError = null;
      state.loading = false;
    },
    sessionEnded(state) {
      state.isSessionActive = false;
      state.sessionError = null;
      state.loading = false;
    },
    sessionErrorOccurred(state, action) {
      state.isSessionActive = false;
      state.sessionError = action.payload;
      state.loading = false;
    },
    setSessionLoading(state, action) {
      state.loading = action.payload;
    },
    setDecodedToken(state, action) {
      state.decodedToken = action.payload;
    },
  },
});

export const {
  sessionStarted,
  sessionEnded,
  sessionErrorOccurred,
  setSessionLoading,
  setDecodedToken
} = sessionSlice.actions;

export default sessionSlice.reducer;

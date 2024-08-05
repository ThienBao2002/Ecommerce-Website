import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  forgetSuccessMsg: [],
  forgetError: [],
  forgetSuccessMsgReset: [],
  forgetErrorReset: [],
};

const forgotPasswordSlice = createSlice({
  name: "forgotpwd",
  initialState,
  reducers: {
    userForgetPasswordSuccess(state, action) {
      state.forgetSuccessMsg = action.payload
    },
    userForgetPasswordError(state, action) {
      state.forgetError = action.payload
    },
    userForgetPasswordSuccessReset(state, action) {
      state.forgetSuccessMsgReset = action.payload
    },
    userForgetPasswordErrorReset(state, action) {
      state.forgetErrorReset = action.payload
    },
  },
});

export const {
  userForgetPasswordSuccess,
  userForgetPasswordError,
  userForgetPasswordSuccessReset,
  userForgetPasswordErrorReset
} = forgotPasswordSlice.actions

export default forgotPasswordSlice.reducer;

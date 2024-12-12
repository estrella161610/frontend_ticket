import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    status: "not-authenticated", //authenticated, not-authenticated, registered, checking
    user: {},
    users: [],
    editUser: {},
    successMessage: undefined,
    errorMessage: undefined,
  },

  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = {};
      state.successMessage = undefined;
      state.errorMessage = undefined;
    },
    onLogin: (state, action) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.successMessage = undefined;
      state.errorMessage = undefined;
    },
    onRegister: (state, action) => {
      state.status = "registered";
      state.user = action.payload;
      state.successMessage = undefined;
      state.errorMessage = undefined;
    },
    onLogout: (state) => {
      state.status = "not-authenticated";
      state.user = {};
    },
    onSuccessMessageAuth: (state, action) => {
      state.status = "authenticated";
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = undefined;
    },
    onErrorMessageAuth: (state, action) => {
      state.status = "not-authenticated";
      state.errorMessage = action.payload;
    },
    clearErrorMessage: (state) => {
      state.errorMessage = undefined;
    },
  },
});

export const {
  onChecking,
  onLogin,
  onRegister,
  onLogout,
  onSuccessMessageAuth,
  clearSuccessMessage,
  onErrorMessageAuth,
  clearErrorMessage,
} = authSlice.actions;
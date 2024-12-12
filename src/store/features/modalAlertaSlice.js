import { createSlice } from "@reduxjs/toolkit";

export const modalAlertaSlice = createSlice({
  name: "modalAlerta",
  initialState: {
    isOpen: false,
  },
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalAlertaSlice.actions;
export default modalAlertaSlice.reducer;
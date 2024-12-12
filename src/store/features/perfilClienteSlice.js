import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

//Acción asíncrona para obtener el perfil del cliente
export const fetchPerfilCliente = createAsyncThunk(
  "perfilCliente/fetchPerfilCliente",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/cliente/profile");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el perfil de cliente:", error);
      return rejectWithValue(
        error.response?.data || "Error al obtener el perfil"
      );
    }
  }
);

//Acción asíncrona para actualizar el perfil de cliente
export const updatePerfilCliente = createAsyncThunk(
  "perfilCliente/updatePerfilCliente",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        "/cliente/profile/actualizar",
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el perfil de cliente:", error);
      return rejectWithValue(
        error.response?.data || "Error al actualizar el perfil"
      );
    }
  }
);

const perfilClienteSlice = createSlice({
  name: "perfilCliente",
  initialState: {
    perfil: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Perfil
      .addCase(fetchPerfilCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPerfilCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
      })
      .addCase(fetchPerfilCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Perfil
      .addCase(updatePerfilCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePerfilCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
      })
      .addCase(updatePerfilCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default perfilClienteSlice.reducer;

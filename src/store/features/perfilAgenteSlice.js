import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

//Acción asíncrona para obtener el perfil del agente
export const fetchPerfilAgente = createAsyncThunk(
  "perfilAgente/fetchPerfilAgente",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/agente/profile");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el perfil de agente:", error);
      return rejectWithValue(
        error.response?.data || "Error al obtener el perfil"
      );
    }
  }
);

//Acción asíncrona para actualizar el perfil de agente
export const updatePerfilAgente = createAsyncThunk(
  "perfilAgente/updatePerfilAgente",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(
        "/agente/profile/actualizar",
        updatedData
      );
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el perfil de agente:", error);
      return rejectWithValue(
        error.response?.data || "Error al actualizar el perfil"
      );
    }
  }
);

const perfilAgenteSlice = createSlice({
  name: "perfilAgente",
  initialState: {
    perfil: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Perfil
      .addCase(fetchPerfilAgente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPerfilAgente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
      })
      .addCase(fetchPerfilAgente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Perfil
      .addCase(updatePerfilAgente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePerfilAgente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
      })
      .addCase(updatePerfilAgente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default perfilAgenteSlice.reducer;

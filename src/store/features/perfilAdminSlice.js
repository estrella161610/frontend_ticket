import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener el perfil de administrador
export const fetchPerfilAdmin = createAsyncThunk(
  "perfilAdmin/fetchPerfilAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/admin/profile");
      return response.data;
    } catch (error) {
      console.error("Error al obtener el perfil de administrador:", error);
      return rejectWithValue(error.response?.data || "Error al obtener el perfil");
    }
  }
);

// Acción asíncrona para actualizar el perfil de administrador
export const updatePerfilAdmin = createAsyncThunk(
  "perfilAdmin/updatePerfilAdmin",
  async (updatedData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put("/admin/profile/actualizar", updatedData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar el perfil de administrador:", error);
      return rejectWithValue(error.response?.data || "Error al actualizar el perfil");
    }
  }
);

const perfilAdminSlice = createSlice({
  name: "perfilAdmin",
  initialState: {
    perfil: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Perfil
      .addCase(fetchPerfilAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPerfilAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
      })
      .addCase(fetchPerfilAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Perfil
      .addCase(updatePerfilAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePerfilAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.perfil = action.payload;
      })
      .addCase(updatePerfilAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default perfilAdminSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los tickets abiertos
export const fetchAssignedTickets = createAsyncThunk(
  "botonesInicio/fetchAssignedTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/ticket/asignados");
      return response.data["tickets abiertos"];
    } catch (error) {
      console.error("Error fetching assigned tickets:", error);
      return rejectWithValue(error.response?.data || "Error al obtener los tickets abiertos");
    }
  }
);

// Acción asíncrona para obtener los tickets resueltos
export const fetchResolvedTickets = createAsyncThunk(
  "botonesInicio/fetchResolvedTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/ticket/resueltos");
      return response.data["tickets resueltos"];
    } catch (error) {
      console.error("Error fetching resolved tickets:", error);
      return rejectWithValue(error.response?.data || "Error al obtener los tickets resueltos");
    }
  }
);

const botonesInicioSlice = createSlice({
  name: "botonesInicio",
  initialState: {
    assignedTickets: 0,
    resolvedTickets: 0,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignedTickets = action.payload;
      })
      .addCase(fetchAssignedTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchResolvedTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResolvedTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.resolvedTickets = action.payload;
      })
      .addCase(fetchResolvedTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default botonesInicioSlice.reducer;

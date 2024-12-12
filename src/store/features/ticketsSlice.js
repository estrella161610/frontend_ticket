import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los tickets desde la API
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/ticket");
      // console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return rejectWithValue(error.response?.data || "Error al obtener los tickets");
    }
  }
);

// Acción asíncrona para crear un nuevo ticket desde la API
export const createTicket = createAsyncThunk(
  "tickets/createTicket",
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/ticket", ticketData);
      // console.log("Response:", response.data);
      return response.data; //devolvemos el ticket creado
    } catch (error) {
      console.error("Error creating ticket:", error);
      return rejectWithValue(error.response?.data || "Error al crear el ticket");
    }
  }
);

//Acción asíncrona para actualizar un ticket desde la API
export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async ({ id, ticketData }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.put(`/ticket/${id}`, ticketData);
      return response.data; // Devolvemos el ticket actualizado
    } catch (error) {
      console.error("Error updating ticket:", error);
      return rejectWithValue(error.response?.data || "Error al actualizar el ticket");
    }
  }
);

//Acción asíncrona para asignar un ticket a un agente
export const assignTicket = createAsyncThunk(
  "tickets/assignTicket",
  async ({ id, idAgente }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(`/ticket/asignar/${id}`, { id_agente: idAgente });
      return { id, ...response.data }; // Incluye el ID del ticket para facilitar la actualización
    } catch (error) {
      console.error("Error assigning ticket:", error);
      return rejectWithValue(error.response?.data || "Error al asignar el ticket");
    }
  }
);

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    ticket: [], 
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //VER TICKETS
      .addCase(fetchTickets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket = action.payload; 
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //CREATE TICKET
      .addCase(createTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ticket.push(action.payload); // Agrega el nuevo ticket a la lista
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //UPDATE TICKET
      .addCase(updateTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        // Actualiza el ticket en el estado
        const index = state.ticket.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.ticket[index] = action.payload;
        }
      })
      .addCase(updateTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //ASGINAR TICKET
      .addCase(assignTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(assignTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        // Busca y actualiza el ticket asignado en el estado
        const index = state.ticket.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.ticket[index] = {
            ...state.ticket[index],
            id_agente: action.payload.id_agente,
          };
        }
      })
      .addCase(assignTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default ticketsSlice.reducer;
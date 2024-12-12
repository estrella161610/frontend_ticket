import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los mensajes de un ticket
export const fetchMensajes = createAsyncThunk(
    "mensajes/fetchMensajes",
    async (ticketId) => {
        try {
            const response = await axiosClient.get(`/ticket/mensajes/${ticketId}`);
            return response.data.mensajes; // Devuelve solo los mensajes
        } catch (error) {
            console.error("Error fetching mensajes:", error);
            throw error;
        }
    }
);

// Acción asíncrona para enviar un mensaje
export const enviarMensaje = createAsyncThunk(
    "mensajes/enviarMensaje",
    async (nuevoMensaje) => {
        try {
            const response = await axiosClient.post("/ticket/mensajes", nuevoMensaje);
            return response.data.mensaje; // Devuelve el mensaje enviado
        } catch (error) {
            console.error("Error sending mensaje:", error);
            throw error;
        }
    }
);

const mensajesSlice = createSlice({
    name: "mensajes",
    initialState: {
        mensajes: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Obtener mensajes
            .addCase(fetchMensajes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchMensajes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.mensajes = action.payload;
            })
            .addCase(fetchMensajes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Enviar mensaje
            .addCase(enviarMensaje.fulfilled, (state, action) => {
                state.mensajes.push(action.payload); // Agrega el nuevo mensaje a la lista
            })
            .addCase(enviarMensaje.pending, (state) => {
                // state.isLoading = true;
                state.error = null;
            })
            .addCase(enviarMensaje.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            });
    },
});

export const { setMensajes } = mensajesSlice.actions;
export default mensajesSlice.reducer;
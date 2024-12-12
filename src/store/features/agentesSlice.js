import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los agentes desde la API
export const fetchAgentes = createAsyncThunk(
    "agentes/fetchAgentes",
    async () => {
        try {
            const response = await axiosClient.get("/agente");
            return response.data;
        } catch (error) {
            console.error("Error fetching agentes:", error);
            throw error;
        }
    }
);

//Acción asíncrona para agregar un agente
export const addAgente = createAsyncThunk (
    "agentes/addAgente",
    async (nuevoAgente) => {
        try {
            const response = await axiosClient.post("/agente", nuevoAgente);
            return response.data;
        } catch (error) {
            console.error("Error adding agente: ", error);
            throw error
        }
    }
);

//Acción asíncrona para actualizar un agente
export const updateAgentes = createAsyncThunk(
    "agentes/updateAgente",
    async ({ id, updateData }) => {
        try {
            const response = await axiosClient.put(`/agente/${id}`, updateData);
            return response.data;
        } catch (error) {
            console.error("Error updating agente: ", error);
            throw error;
        }
    }
);

//Acción asíncrona para eliminar una sede
export const deleteAgente = createAsyncThunk(
    "agentes/deleteAgente",
    async (id) => {
        try {
            await axiosClient.delete(`/agente/${id}`);
            return id;
        } catch (error) {
            console.error("Error deleting agente: ", error);
            throw error;
        }
    }
);
// Acción para importar 
export const importarAgente = createAsyncThunk(
    "agentes/importar",
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosClient.post("/agente/import", formData);
            return response.data; // Asegúrate de que esto sea un array
        } catch (error) {
            console.error("Error en la importación:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error al importar agentes");
        }
    }
);

// Acción para exportar
export const exportarAgente = createAsyncThunk(
    "agentes/exportar",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/agente/export", {
                responseType: "blob", // Para recibir un archivo
            });
            // Crear un objeto URL para el archivo descargado
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'usuarios.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();

            return 'Exportación exitosa';
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al exportar agentes");
        }
    }
);

const agentesSlice = createSlice ({
    name: "agentes",
    initialState: {
        agentes: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) =>{
        builder
            //GET
            .addCase(fetchAgentes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAgentes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.agentes = action.payload;
            })
            .addCase(fetchAgentes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            //ADD (CREATE)
            .addCase(addAgente.fulfilled, (state, action) => {
                state.agentes.push(action.payload);
            })
            .addCase(addAgente.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAgente.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            //PUT (UPDATE)
            .addCase(updateAgentes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAgentes.fulfilled, (state, action) => {
                const index = state.agentes.findIndex(agente => agente.id === action.payload.id);
                if (index !== -1) {
                    state.agentes[index] = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateAgentes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })

            //DELETE
            .addCase(deleteAgente.fulfilled, (state, action) => {
                state.agentes = state.agentes.filter((agente) => agente.id !== action.payload);
            })
            //IMPORTAR
            .addCase(importarAgente.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(importarAgente.fulfilled, (state, action) => {
                state.isLoading = false;
                state.Agentes = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(importarAgente.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //EXPORTAR
            .addCase(exportarAgente.fulfilled, (state) => {
                state.isLoading = false;
                // Guarda un mensaje de éxito si es necesario
                state.successMessage = "Agentes exportados exitosamente";
            });
    },
});

export default agentesSlice.reducer;
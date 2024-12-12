import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los clientes desde la API
export const fetchClientes = createAsyncThunk(
    "clientes/fetchClientes",
    async () => {
        try {
            const response = await axiosClient.get("/cliente");
            return response.data;
        } catch (error) {
            console.error("Error fetching clientes:", error);
            throw error;
        }
    }
);

// Acción asíncrona para agregar un cliente
export const addCliente = createAsyncThunk(
    "clientes/addCliente",
    async (nuevoCliente) => {
        try {
            const response = await axiosClient.post("/cliente", nuevoCliente);
            return response.data;
        } catch (error) {
            console.error("Error adding cliente:", error);
            throw error;
        }
    }
);

// Acción asíncrona para actualizar un cliente
export const updateCliente = createAsyncThunk(
    "clientes/updateCliente",
    async ({ id, updatedData }) => {
        try {
            const response = await axiosClient.put(`/cliente/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error updating cliente:", error);
            throw error;
        }
    }
);

// Acción asíncrona para eliminar un cliente
export const deleteCliente = createAsyncThunk(
    "clientes/deleteCliente",
    async (id) => {
        try {
            await axiosClient.delete(`/cliente/${id}`); // Llama al endpoint DELETE
            return id; // Devuelve el ID del cliente eliminado
        } catch (error) {
            console.error("Error deleting cliente:", error);
            throw error;
        }
    }
);

// Acción para importar 
export const importarCliente = createAsyncThunk(
    "clientes/importar",
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosClient.post("/cliente/import", formData);
            return response.data; // Asegúrate de que esto sea un array
        } catch (error) {
            console.error("Error en la importación:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error al importar clientes");
        }
    }
);

// Acción para exportar
export const exportarCliente = createAsyncThunk(
    "clientes/exportar",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/cliente/export", {
                responseType: "blob", // Para recibir un archivo
            });
            // Crear un objeto URL para el archivo descargado
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'clientes.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();

            return 'Exportación exitosa';
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al exportar clientes");
        }
    }
);


const clientesSlice = createSlice({
    name: "clientes",
    initialState: {
        clientes: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Mostrar clientes
            .addCase(fetchClientes.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchClientes.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientes = action.payload;
            })
            .addCase(fetchClientes.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Agregar cliente
            .addCase(addCliente.fulfilled, (state, action) => {
                state.clientes.push(action.payload);
            })
            .addCase(addCliente.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addCliente.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Modificar cliente
            .addCase(updateCliente.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCliente.fulfilled, (state, action) => {
                const index = state.clientes.findIndex(cliente => cliente.id === action.payload.id);
                if (index !== -1) {
                    state.clientes[index] = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateCliente.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            // Eliminar cliente
            .addCase(deleteCliente.fulfilled, (state, action) => {
                state.clientes = state.clientes.filter((cliente) => cliente.id !== action.payload);
            })//IMPORTAR
            .addCase(importarCliente.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(importarCliente.fulfilled, (state, action) => {
                state.isLoading = false;
                state.clientes = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(importarCliente.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //EXPORTAR
            .addCase(exportarCliente.fulfilled, (state) => {
                state.isLoading = false;
                // Guarda un mensaje de éxito si es necesario
                state.successMessage = "Clientes exportados exitosamente";
            });

    },
});

export default clientesSlice.reducer;
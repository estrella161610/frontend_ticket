import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los grupos desde la API
export const fetchGrupos = createAsyncThunk(
    "grupos/fetchGrupos",
    async () => {
        try {
            const response = await axiosClient.get("/grupo");
            return response.data; // Asegúrate de que la respuesta sea un array de grupos
        } catch (error) {
            console.error("Error fetching grupos:", error);
            throw error;
        }
    }
);

// Acción asíncrona para agregar un grupo
export const addGrupo = createAsyncThunk(
    "grupos/addGrupo",
    async (nuevoGrupo) => {
        try {
            const response = await axiosClient.post("/grupo", nuevoGrupo);
            return response.data; // Asegúrate de que la respuesta incluya el nuevo grupo
        } catch (error) {
            console.error("Error adding grupo:", error);
            throw error;
        }
    }
);

// Acción asíncrona para actualizar un grupo
export const updateGrupo = createAsyncThunk(
    "grupos/updateGrupo",
    async ({ id, updatedData }) => {
        try {
            const response = await axiosClient.put(`/grupo/${id}`, updatedData);
            return response.data; // Asegúrate de que la respuesta incluya el grupo actualizado
        } catch (error) {
            console.error("Error updating grupo:", error);
            throw error;
        }
    }
);

// Acción asíncrona para eliminar un grupo
export const deleteGrupo = createAsyncThunk(
    "grupos/deleteGrupo",
    async (id) => {
        try {
            await axiosClient.delete(`/grupo/${id}`); // Llama al endpoint DELETE
            return id; // Devuelve el ID del grupo eliminado
        } catch (error) {
            console.error("Error deleting grupo:", error);
            throw error;
        }
    }
);

// Acción para importar 
export const importarGrupo = createAsyncThunk(
    "grupos/importar",
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosClient.post("/grupo/import", formData);
            return response.data; // Asegúrate de que esto sea un array
        } catch (error) {
            console.error("Error en la importación:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error al importar grupos");
        }
    }
);

// Acción para exportar
export const exportarGrupo = createAsyncThunk(
    "grupos/exportar",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/grupo/export", {
                responseType: "blob", // Para recibir un archivo
            });
            // Crear un objeto URL para el archivo descargado
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Grupos.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();

            return 'Exportación exitosa';
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al exportar grupos");
        }
    }
);

const gruposSlice = createSlice({
    name: "grupos",
    initialState: {
        grupos: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Mostrar grupos
            .addCase(fetchGrupos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchGrupos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.grupos = action.payload; // Guarda los grupos en el estado
            })
            .addCase(fetchGrupos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message; // Guarda el mensaje de error
            })
            // Agregar grupo
            .addCase(addGrupo.fulfilled, (state, action) => {
                state.grupos.push(action.payload); // Agrega el nuevo grupo al estado
            })
            .addCase(addGrupo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addGrupo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message; // Guarda el mensaje de error
            })
            // Modificar grupo
            .addCase(updateGrupo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateGrupo.fulfilled, (state, action) => {
                const index = state.grupos.findIndex(grupo => grupo.id === action.payload.id);
                if (index !== -1) {
                    state.grupos[index] = action.payload; // Actualiza el grupo en el estado
                }
                state.isLoading = false;
            })
            .addCase(updateGrupo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message; // Guarda el mensaje de error
            })
            // Eliminar grupo
            .addCase(deleteGrupo.fulfilled, (state, action) => {
                state.grupos = state.grupos.filter(grupo => grupo.id !== action.payload); // Elimina el grupo del estado
            })
            //IMPORTAR
            .addCase(importarGrupo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(importarGrupo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.grupos = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(importarGrupo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //EXPORTAR
            .addCase(exportarGrupo.fulfilled, (state) => {
                state.isLoading = false;
                // Guarda un mensaje de éxito si es necesario
                state.successMessage = "Grupos exportados exitosamente";
            });
    },
});

export default gruposSlice.reducer;
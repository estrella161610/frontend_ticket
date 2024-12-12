import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los departamentos desde la API 
export const fetchDepartamentos = createAsyncThunk(
    "departamentos/fetchDepartamentos",
    async () => {
        try {
            const response = await axiosClient.get("/departamento");
            return response.data;
        } catch (error) {
            console.error("Error fetching departamentos:", error);
            throw error;
        }
    }
);

// Acción asíncrona para agregar un departamento 
export const addDepartamento = createAsyncThunk(
    "departamentos/addDepartamento",
    async (nuevoDepartamento) => {
        try {
            const response = await axiosClient.post("/departamento", nuevoDepartamento);
            return response.data;
        } catch (error) {
            console.error("Error adding departamento:", error);
            throw error;
        }
    }
);

// Acción asíncrona para actualizar un departamento 
export const updateDepartamento = createAsyncThunk(
    "departamentos/updateDepartamento",
    async ({ id, updatedData }) => {
        try {
            const response = await axiosClient.put(`/departamento/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error updating departamento:", error);
            throw error;
        }
    }
);

// Acción asíncrona para eliminar departamento
export const deleteDepartamento = createAsyncThunk("departamentos/deleteDepartamento", async (id) => {
    try {
        await axiosClient.delete(`/departamento/${id}`); // Llama al endpoint DELETE
        return id; // Devuelve el ID de la sede eliminada
    } catch (error) {
        console.error("Error deleting departamento:", error);
        throw error;
    }
});

// Acción para importar departamentos
export const importarDepartamentos = createAsyncThunk(
    "departamentos/importar",
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const response = await axiosClient.post("/departamento/import", formData);
            return response.data; // Asegúrate de que esto sea un array
        } catch (error) {
            console.error("Error en la importación:", error.response?.data || error.message);
            return rejectWithValue(error.response?.data || "Error al importar departamentos");
        }
    }
);

// Acción para exportar departamentos
export const exportarDepartamentos = createAsyncThunk(
    "departamentos/exportar",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosClient.get("/departamento/export", {
                responseType: "blob", // Para recibir un archivo
            });
            // Crear un objeto URL para el archivo descargado
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'departamentos.xlsx'); // Nombre del archivo
            document.body.appendChild(link);
            link.click();
            link.remove();

            return 'Exportación exitosa';
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al exportar departamentos");
        }
    }
);


const departamentosSlice = createSlice({
    name: "departamentos",
    initialState: {
        departamentos: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //MOSTRAR
            .addCase(fetchDepartamentos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchDepartamentos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.departamentos = action.payload;
            })
            .addCase(fetchDepartamentos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //AGREGAR
            .addCase(addDepartamento.fulfilled, (state, action) => {
                state.departamentos.push(action.payload);
            })
            .addCase(addDepartamento.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addDepartamento.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //MODIFICAR
            .addCase(updateDepartamento.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateDepartamento.fulfilled, (state, action) => {
                const index = state.departamentos.findIndex(dep => dep.id === action.payload.id);
                if (index !== -1) {
                    state.departamentos[index] = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateDepartamento.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //DELETE
            .addCase(deleteDepartamento.fulfilled, (state, action) => {
                state.departamentos = state.departamentos.filter((dep) => dep.id !== action.payload); // Elimina la sede del estado
            })
            //IMPORTAR
            .addCase(importarDepartamentos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(importarDepartamentos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.departamentos = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(importarDepartamentos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            //EXPORTAR
            .addCase(exportarDepartamentos.fulfilled, (state) => {
                state.isLoading = false;
                // Guarda un mensaje de éxito si es necesario
                state.successMessage = "Departamentos exportados exitosamente";
            });
    },
});

export default departamentosSlice.reducer;
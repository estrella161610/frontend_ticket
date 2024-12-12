import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener las sedes desde la API
export const fetchSedes = createAsyncThunk("sedes/fetchSedes", async () => {
  try {
    const response = await axiosClient.get("/sede");
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error("Error fetching sedes:", error);
    throw error; // Re-lanza el error
  }
});

// Acción asíncrona para agregar una sede
export const addSede = createAsyncThunk("sedes/addSedes", async (nuevaSede) => {
  try {
    const response = await axiosClient.post("/sede", nuevaSede);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding sedes:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
});

//Acción asíncrona para actualizar una sede
export const updateSede = createAsyncThunk(
  "sedes/updateSede",
  async ({ id, updatedSede }) => {
    try {
      const response = await axiosClient.put(`/sede/${id}`, updatedSede);
      return response.data; // Devuelve los datos actualizados
    } catch (error) {
      console.error(
        "Error updating sede:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  }
);

//!Pendente
// Acción asíncrona para eliminar una sede
export const deleteSede = createAsyncThunk("sedes/deleteSede", async (id) => {
  try {
    await axiosClient.delete(`/sede/${id}`); // Llama al endpoint DELETE
    return id; // Devuelve el ID de la sede eliminada
  } catch (error) {
    console.error("Error deleting sede:", error);
    throw error;
  }
});


// Acción para importar 
export const importarSede = createAsyncThunk(
  "sedes/importar",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axiosClient.post("/sede/import", formData);
      return response.data; // Asegúrate de que esto sea un array
    } catch (error) {
      console.error("Error en la importación:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || "Error al importar sedes");
    }
  }
);

// Acción para exportar
export const exportarSede = createAsyncThunk(
  "sedes/exportar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get("/sede/export", {
        responseType: "blob", // Para recibir un archivo
      });
      // Crear un objeto URL para el archivo descargado
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sedes.xlsx'); // Nombre del archivo
      document.body.appendChild(link);
      link.click();
      link.remove();

      return 'Exportación exitosa';
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error al exportar sedes");
    }
  }
);

const sedesSlice = createSlice({
  name: "sedes",
  initialState: {
    sedes: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //GET
      .addCase(fetchSedes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSedes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sedes = action.payload;
      })
      .addCase(fetchSedes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      //ADD (CREATE)
      .addCase(addSede.fulfilled, (state, action) => {
        state.sedes.push(action.payload);
      })
      .addCase(addSede.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addSede.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      //PUT (UPDATE)
      .addCase(updateSede.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSede.fulfilled, (state, action) => {
        const index = state.sedes.findIndex(
          (sed) => sed.id === action.payload.id
        );
        if (index !== -1) {
          state.sedes[index] = action.payload;
        }
        state.isLoading = false;
      })
      .addCase(updateSede.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      //DELETE
      .addCase(deleteSede.fulfilled, (state, action) => {
        state.sedes = state.sedes.filter((sede) => sede.id !== action.payload); // Elimina la sede del estado
      })
      //IMPORTAR
      .addCase(importarSede.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(importarSede.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sedes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(importarSede.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      //EXPORTAR
      .addCase(exportarSede.fulfilled, (state) => {
        state.isLoading = false;
        // Guarda un mensaje de éxito si es necesario
        state.successMessage = "Sedes exportados exitosamente";
      });
  },
});

export default sedesSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

// Acción asíncrona para obtener los admin desde la API 
export const fetchAdmin = createAsyncThunk(
    "admin/fetchAdmin",
    async () => {
        try {
            const response = await axiosClient.get("/admin");
            return response.data;
        } catch (error) {
            console.error("Error fetching admin:", error);
            throw error;
        }
    }
);

// Acción asíncrona para agregar un admin
export const addAdmin = createAsyncThunk(
    "admin/addAdmin",
    async (nuevoAdmin) => {
        try {
            const response = await axiosClient.post("/admin", nuevoAdmin);
            return response.data;
        } catch (error) {
            console.error("Error adding admin:", error);
            throw error;
        }
    }
);

// Acción asíncrona para actualizar un admin
export const updateAdmin = createAsyncThunk(
    "admin/updateAdmin",
    async ({id, updatedData}) => {
        try {
            const response = await axiosClient.put(`/admin/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Error updating admin:", error);
            throw error;
        }
    }
);

// Acción asíncrona para eliminar un admin
export const deleteAdmin = createAsyncThunk(
    "admin/deleteAdmin",
    async (id) => {
        try {
            await axiosClient.delete(`/admin/${id}`); // Llama al endpoint DELETE
            return id; // Devuelve el ID del admin eliminado
        } catch (error) {
            console.error("Error deleting admin:", error);
            throw error;
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        admin: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            //GET
            .addCase(fetchAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAdmin.fulfilled, (state, action) => {
                state.isLoading = false;
                state.admin = action.payload;
            })
            .addCase(fetchAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //POST
            .addCase(addAdmin.fulfilled, (state, action) => {
                state.admin.push(action.payload);
            })
            .addCase(addAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //PUT
            .addCase(updateAdmin.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateAdmin.fulfilled, (state, action) => {
                const index = state.admin.findIndex((admin) => admin.id === action.payload.id);
                if (index !== -1) {
                    state.admin[index] = action.payload;
                }
                state.isLoading = false;
            })
            .addCase(updateAdmin.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            //DELETE
            .addCase(deleteAdmin.fulfilled, (state, action) => {
                state.admin = state.admin.filter((admin) => admin.id !== action.payload);
            });
    }
});

export const adminReducer = adminSlice.reducer;
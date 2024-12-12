import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "../../api/Axios";

//Ación para cambiar la contraseña del agente
export const changePassword =  createAsyncThunk(
    'auth/changePassword',
    async ({password, new_password, new_password_confirmation}, {rejectWithValue}) => {
        try{
            const response = await axiosClient.put("/agente/password", {
                password: password,
                new_password: new_password,
                new_password_confirmation: new_password_confirmation,
            });
            return response.data;
        } catch(error){
            console.error("Error cambiando la contraseña:", error);
            console.error("Detalles del error:", error.response); // Mostrar detalles del error
            return rejectWithValue(error.response?.data || "Error al cambiar la contraseña");
        }
    }
);

const chgPassAgentSlice = createSlice({
    name: 'password',
    initialState: {
        message: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(changePassword.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        })
        .addCase(changePassword.fulfilled, (state, action) => {
            state.isLoading = false;
            state.message = action.payload.message || 'Cambio de contraseña exitoso';
        })
        .addCase(changePassword.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.payload.message || 'Error al cambiar la contraseña';
        });
    }
});

export default chgPassAgentSlice.reducer;
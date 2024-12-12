import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    status: 'Conectado', // Estado por defecto
};

const messageStatusSlice = createSlice({
    name: 'messageStatus',
    initialState,
    reducers: {
        setMessageStatus(state, action) {
            state.status = action.payload; // Actualiza el estado con el nuevo valor
        },
    },
});

// Exporta la acción
export const { setMessageStatus } = messageStatusSlice.actions;

// Exporta el reducer
export default messageStatusSlice.reducer;
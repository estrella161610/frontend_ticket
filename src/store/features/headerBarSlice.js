import { createSlice } from '@reduxjs/toolkit';

const headerBarSlice = createSlice({
    name: 'headerBar',
    initialState: {
        addedItems: [], // Array para almacenar los ítems agregados
        activeModal: null, // Modal activo (puede ser null si no hay uno)
    },
    reducers: {
        addItem: (state, action) => {
            const { type, label } = action.payload;
            // Asegurarte de que el ítem no se agregue si ya existe
            const existingItem = state.addedItems.find(item => item.type === type);
            if (!existingItem) {
                state.addedItems.push({ type, label });
            }
        },
        removeItem: (state, action) => {
            const type = action.payload;
            state.addedItems = state.addedItems.filter(item => item.type !== type);
        },
        setActiveModal: (state, action) => {
            state.activeModal = action.payload; // Actualiza el modal activo
        },
    },
});

// Exporta las acciones
export const { addItem, removeItem, setActiveModal } = headerBarSlice.actions;

// Exporta el reducer por defecto
export default headerBarSlice.reducer;
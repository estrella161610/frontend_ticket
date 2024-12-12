import { createSlice } from '@reduxjs/toolkit';

// Estado inicial
const initialState = {
  selectedItem: 0, // Índice del ítem seleccionado, inicializa con el primer ítem
};

// Crea el slice
const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload; // Actualiza el ítem seleccionado
    },
  },
});

// Exporta las acciones
export const { setSelectedItem } = selectionSlice.actions;

// Exporta el reducer
export default selectionSlice.reducer;
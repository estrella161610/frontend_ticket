import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/Axios';

const endpoints = {
  sinResolver: '/bandeja/sin-resolver',
  sinAsignar: '/bandeja/sin-asignacion',
  todosSinResolver: '/bandeja/todos-sin-resolver',
  actualizados: '/bandeja/actualizados',
  pendientes: '/bandeja/pendientes',
  resueltos: '/bandeja/resueltos',
  borrados: '/bandeja/borrados',
};

// Crear un thunk para cada endpoint
export const fetchBandeja = createAsyncThunk('bandeja/fetchBandeja', async (view) => {
  const response = await axiosClient.get(endpoints[view]);
  return response.data;
});

const bandejaSlice = createSlice({
  name: 'bandeja',
  initialState: {
    bandeja: [],
    loading: false,
    error: null,
    counts: {
      sinResolver: 0,
      sinAsignar: 0,
      todosSinResolver: 0,
      actualizados: 0,
      pendientes: 0,
      resueltos: 0,
      borrados: 0,
    },
  },
  reducers: {
    setCounts: (state, action) => {
      state.counts = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBandeja.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBandeja.fulfilled, (state, action) => {
        state.loading = false;
        state.bandeja = action.payload;
        // Actualizar el contador para la vista actual
        const view = action.meta.arg;
        state.counts[view] = action.payload.length; // Actualiza el contador
      })
      .addCase(fetchBandeja.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setCounts } = bandejaSlice.actions;
export default bandejaSlice.reducer;
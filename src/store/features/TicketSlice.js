import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const initialState = {
  ticket: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Crear un thunk para manejar la creación del ticket
export const createTicket = createAsyncThunk(
  'ticket/createTicket',
  async (newTicket, { rejectWithValue,getState }) => {
    const token = getState().auth.token;

if (!token) {
  console.error('No se encontró el token');
  return;  
}

try {
 
  const response = await axios.post('https://api.tickets.binmotion.com.mx/api/ticket', newTicket, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  
      'Accept': 'application/json',  
    }
  });

 
  return response.data;  

} catch (error) {
 
  if (error.response) {
    console.error('Error de servidor:', error.response.data);
    return rejectWithValue(error.response.data.message || 'Unknown error');
  } else if (error.request) {
    console.error('No se recibió respuesta del servidor:', error.request);
    return rejectWithValue('No se recibió respuesta del servidor');
  } else {
  
    console.error('Error en la configuración de la solicitud:', error.message);
    return rejectWithValue(error.message);
        }
    }
  }
);

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTicket.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTicket.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.ticket = action.payload; // Guarda el ticket creado en el estado
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default ticketSlice.reducer;

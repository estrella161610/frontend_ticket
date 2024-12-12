// src/store/features/notificationsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/Axios';

// Acción para obtener notificaciones no leídas
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async () => {
    const response = await axiosClient.get('/notificacion/obtener');
    return response.data;
  }
);

// Acción para marcar notificación como leída
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (id) => {
    const response = await axiosClient.post(`/notificacion/marcar/${id}`);
    return { id, ...response.data };
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(
          (n) => n.id === action.payload.id
        );
        if (index !== -1) {
          state.notifications[index].status = 'read';
        }
      });
  },
});

export default notificationsSlice.reducer;

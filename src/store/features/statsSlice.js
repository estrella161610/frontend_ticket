import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axiosClient from '../../api/Axios';

export const fetchStats = createAsyncThunk(
    'stats/fetchStats', 
    async () => {
        try {
            const response = await axiosClient.get("/inicio/home/estadisticas");
            return response.data;
          } catch (error) {
            console.error("Error fetching stats:", error);
            return (error.response?.data || "Error al obtener las estadísticas");
          }
    }
);

const statsSlice = createSlice({
    name: 'stats',
    initialState: {
        stats: null,
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export default statsSlice.reducer;

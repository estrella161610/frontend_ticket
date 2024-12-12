import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from "../../api/Axios";

export const fetchSearchResults = createAsyncThunk(
  'search/fetchResults',
  async ({ query, category }, { rejectWithValue }) => {
    try {
      let url = '/search';

      // Caso 1: Solo `query`, sin `category` (búsqueda general)
      if (query && !category) {
        url += `?query=${query}`;
      }
      // Caso 2: `query` y `category` (búsqueda en una categoría específica)
      else if (query && category) {
        url += `?query=${query}&type=${category}`;
      }
      // Caso 3: Solo `category`, sin `query` (últimos 5 resultados de una categoría)
      else if (!query && category) {
        url += `?type=${category}`;
      }

      const response = await axiosClient.get(url);
      console.log('Respuesta de la API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en la búsqueda:', error);
      return rejectWithValue(error.response?.data || 'Error en la búsqueda');
    }
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState: {
    query: '',
    category: null,
    results: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchResults.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchResults.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results || [];
    })
      .addCase(fetchSearchResults.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Error en la búsqueda';
      });
  },
});

export const { setQuery, setCategory } = searchSlice.actions;
export default searchSlice.reducer;

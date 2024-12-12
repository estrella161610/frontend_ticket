import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    contentItem: 'stats', //Estado inicial en estadísticas
};

const contentSlice =  createSlice({
    name: 'content',
    initialState,
    reducers:{
        setContentItem: (state, action) => {
            state.contentItem = action.payload
        },
    },
});

export const { setContentItem } = contentSlice.actions;

export default contentSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

    const initialState = {
        activeBtn: 0,
        visibleView: 0,
    };

    const viewSlice = createSlice ({
        name: 'view',
        initialState,
        reducers: {
            setVisibleView: (state, action) => {
                state.visibleView = action.payload.index;
                state.activeBtn = action.payload.index;
            },
        },
    });

    export const { setVisibleView } = viewSlice.actions;
    export default viewSlice.reducer;
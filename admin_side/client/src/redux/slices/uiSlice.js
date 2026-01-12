import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toggle: false,
    toggleDev: false,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setToggle: (state, action) => {
            state.toggle = action.payload;
        },
        setToggleDev: (state, action) => {
            state.toggleDev = action.payload;
        },
        toggleMode: (state) => {
            state.toggle = !state.toggle;
        },
        toggleDevMode: (state) => {
            state.toggleDev = !state.toggleDev;
        },
    },
});

export const { setToggle, setToggleDev, toggleMode, toggleDevMode } =
    uiSlice.actions;

export default uiSlice.reducer;

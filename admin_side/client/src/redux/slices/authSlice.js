import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    userLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setUserLoading: (state, action) => {
            state.userLoading = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
            state.accessToken = null;
            state.userLoading = false;
        },
    },
});

export const { setUser, setAccessToken, setUserLoading, logoutUser } = authSlice.actions;
export default authSlice.reducer;

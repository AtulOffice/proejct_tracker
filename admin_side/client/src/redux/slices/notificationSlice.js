import { createSlice } from "@reduxjs/toolkit";
import { fetchNotifications } from "../../apiCall/notefication.Api";

const initialState = {
    notificationlist: [],
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: "notifications",
    initialState,

    reducers: {
        addNotification: (state, action) => {
            const exists = state.notificationlist.some(
                (n) => n._id === action.payload._id
            );

            if (!exists) {
                state.notificationlist.unshift(action.payload);
            }
        },

        setNotifications: (state, action) => {
            state.notificationlist = action.payload;
        },

        markAsRead: (state, action) => {
            const id = action.payload;

            const notification = state.notificationlist.find(
                (n) => n._id === id
            );

            if (notification) {
                notification.read = true;
            }
        },

        markAllAsRead: (state) => {
            state.notificationlist.forEach((n) => {
                n.read = true;
            });
        },

        clearNotifications: (state) => {
            state.notificationlist = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notificationlist = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    addNotification,
    setNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;

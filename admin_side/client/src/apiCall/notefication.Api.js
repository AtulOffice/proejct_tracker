import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../api/axiosClient";


export const fetchNotifications = createAsyncThunk(
    "notifications/fetchNotifications",
    async (_, { rejectWithValue }) => {
        try {
            const res = await apiClient.get("/notifications/getAll");
            return res.data?.Notifications;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error fetching");
        }
    }
);

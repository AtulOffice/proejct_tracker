import apiClient from "../api/axiosClient.js";

export const fetchWorkStatus = async ({ page = 1, search = "" } = {}) => {
    try {
        const res = await apiClient.get(`/worksts/pagination`, {
            params: { page, limit: 15, search },
        });

        return {
            data: res.data?.data,
            hasMore: page < res.data?.totalPages,
        };
    } catch (err) {
        console.error("Failed to fetch work status:", err);
        throw err;
    }
};

export const fetchAllworkStatusAdmin = async ({ search = "" } = {}) => {
    try {
        const res = await apiClient.get(`/worksts/fetchAllworkStatus`, {
            params: { search },
        });
        return res.data?.data;
    } catch (err) {
        console.error("Failed to fetch all work status:", err);
        throw err;
    }
};

export const fetchCommisioningProgressByAdmin = async ({ projectId }) => {
    try {
        const res = await apiClient.get(
            `/worksts/fetchAllworkStatusbyProjectforAdmin/${projectId}`
        );
        return res.data?.data;
    } catch (err) {
        console.error("Failed to fetch commissioning progress:", err);
        throw err;
    }
};

export const getAdminProjectProgressByPlanning = async ({ planId }) => {
    try {
        const res = await apiClient.get(
            `/getAdminProjectProgressByPlanning/${planId}`
        );
        return res.data;
    } catch (err) {
        console.error("Failed to fetch admin project progress:", err);
        throw err;
    }
};

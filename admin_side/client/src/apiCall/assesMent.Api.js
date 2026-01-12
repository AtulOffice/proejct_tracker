import apiClient from "../api/axiosClient";

export const saveWeeklyAssment = async ({
    weekStart,
    engineers,
    tasksByDate,
}) => {
    try {
        const res = await apiClient.post(`/devrecord/save`, { weekStart, engineers, tasksByDate });
        return res.data;
    } catch (err) {
        console.error("error while saving", err);
        throw err;
    }
};

export const fetchWeeklyAssmentbyId = async (id) => {
    try {
        const res = await apiClient.get(`/devrecord/fetchbyid/${id}`);
        return res.data;
    } catch (err) {
        console.error("error while saving", err);
        throw err;
    }
};


export const fetchWeeklyAssment = async ({ search = "" } = {}) => {
    try {
        const res = await apiClient.get(`/devrecord/fetchall`, {
            params: { search },
        });
        return res.data;
    } catch (err) {
        console.error("error while fetching weekly assessment", err);
        throw err;
    }
};

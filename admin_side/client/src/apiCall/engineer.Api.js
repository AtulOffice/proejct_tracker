import apiClient from "../api/axiosClient.js";

export const saveAllEngineers = async (data) => {
    try {
        const res = await apiClient.post(
            `/engineer/addEngineer`, data,
        );
        return res.data;
    } catch (err) {
        console.error("error while saving", err);
        throw err;
    }
};

export const getavailableEngineers = async () => {
    try {
        const res = await apiClient.get(`/engineer/getAvailableEngineers`);
        return res.data;
    } catch (err) {
        console.error("error while fetching all engineer", err);
        throw err;
    }
};

export const getAssignedEngineers = async () => {
    try {
        const res = await apiClient.get(`/engineer/getAssignedEngineers`);
        return res.data;
    } catch (err) {
        console.error("error while fetching all engineer", err);
        throw err;
    }
};

export const getAllEngineers = async () => {
    try {
        const res = await apiClient.get(`/engineer/getAllEngineers`);
        return res.data;
    } catch (err) {
        console.error("error while fetching all engineer", err);
        throw err;
    }
};
export const EditAllEngineers = async (id, data) => {
    try {
        const res = await apiClient.put(`/engineer/editEngineer/${id}`, data,);
        return res.data;
    } catch (err) {
        console.error("error while updating data", err);
        throw err;
    }
};

export const deleteEngineer = async (id) => {
    try {
        const res = await apiClient.delete(`/engineer/deleteEngineer/${id}`);
        return res.data;
    } catch (err) {
        console.error("error while deleting data", err);
        throw err;
    }
};


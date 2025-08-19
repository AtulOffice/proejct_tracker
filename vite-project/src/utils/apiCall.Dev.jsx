import axios from "axios";
import toast from "react-hot-toast";

export const fetchProjectsDev = async ({ page, search }) => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL
            }/projectDev/paginationdev?page=${page}&limit=6&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err
    }
};

export const statusSave = async (data) => {
    console.log("Saving project status with data:", data);
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_API_URL}/projectDev/save`,
            data
        );
        return res.data;
    } catch (err) {
        if (err.response) {
            throw err.response;
        }
        console.error("Failed to save project status:", err);
        throw new Error("Failed to save project status");
    }
};

export const getStatus = async (id) => {
    try {
        const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/projectDev/fetch/${id}`
        );
        return res.data;
    } catch (err) {
        console.error("Failed to fetch project status by job number:", err);
        if (err.response) {
            throw err.response;
        }
        throw new Error("Failed to fetch project status");
    }
}


export const statusupdate = async (data, id) => {
    try {
        const res = await axios.put(
            `${import.meta.env.VITE_API_URL}/projectDev/updatebyid/${id}`,
            data
        );
        console.log("Project status updated successfully api call page :", res.data);
        return res.data;
    } catch (err) {
        if (err.response) {
            throw err.response;
        }
        console.error("Failed to save project status:", err);
        throw new Error("Failed to save project status");
    }
};
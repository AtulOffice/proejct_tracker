import toast from "react-hot-toast";
import apiClient from "../api/axiosClient.js";

export const fetchProjectOveriew = async () => {
    try {
        const res = await apiClient.get(`/getProjectOverview`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjects = async ({ page, search }) => {
    try {
        const res = await apiClient.get(
            `/pagination?page=${page}&limit=15&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectslatest = async ({ page, search }) => {
    try {
        const res = await apiClient.get(
            `/latestProjectpagination?page=${page}&limit=15&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectsCatogary = async ({ status, page, search }) => {
    try {
        const res = await apiClient.get(
            `/catogray/pagination?page=${page}&limit=15&status=${status}&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectsDevelopment = async ({ page, search }) => {
    try {
        const res = await apiClient.get(
            `/devlopment/pagination?page=${page}&limit=15&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectsSotype = async ({ soType, page, search }) => {
    try {
        const res = await apiClient.get(
            `/sotype/pagination?page=${page}&limit=15&soType=${soType}&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectsUrgent = async ({
    status,
    page,
    startDate,
    search,
}) => {
    try {
        const res = await apiClient.get(
            `/urgentProject/pagination?page=${page}&limit=15&status=${status}&startDate=${startDate}&search=${search}`
        );
        return { data: res.data.data, hashMore: page < res.data.totalPages };
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectsUrgentAction = async ({ search }) => {
    try {
        const res = await apiClient.get(`/urgentProjectAction?search=${search}`);
        return res.data.data;
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetfchProejctAll = async ({ search }) => {
    try {
        const res = await apiClient.get(`/allProjectsfetch?search=${search}`);
        return res.data.data;
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetfchProejctADev = async ({ search }) => {
    try {
        const res = await apiClient.get(`/allProjectsfetchdev?search=${search}`);
        return res.data.data;
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const addProject = async ({ formData, engineerData, Docs }) => {
    try {
        await apiClient.post(`/save`, {
            ...formData,
            momDate: formData.momDate ? [formData.momDate] : [],
            engineerName: engineerData
                ? [...new Set(engineerData.map((eng) => eng.engineerName?.trim()))]
                : [],
            momsrNo: formData.momsrNo
                ? formData.momsrNo.split(",").map((item) => item.trim())
                : [],
            projectName: formData.client,
            startDate: formData?.requestDate ?? null,
            endDate: formData?.deleveryDate ?? null,
            engineerData,
            ...Docs,
        });

        toast.success("Data saved successfully");
    } catch (e) {
        if (e.response) toast.error(e.response?.data?.message);
        else toast.error("something went wrong");
        console.log(e);
        throw e;
    }
};

export const deleteProject = async (id, jobNumber) => {
    try {
        await apiClient.delete(`/delete/${id}`);
        toast.success(`JobId ${jobNumber} deleted successfully`);
    } catch (e) {
        if (e.response) toast.error(e.response?.data?.message);
        toast.error("something went wrong");
        console.log(e);
        throw e;
    }
};

export const updateProject = async (project, navigate) => {
    try {
        const res = await apiClient.get(
            `/projectDev/existancecheck/${project.jobNumber}`
        );

        if (res?.data?.exists) {
            toast.error("Project development status already exists");
        } else {
            navigate(`/develop/${project.jobNumber}`, {
                state: { fromButton: true },
            });
        }
    } catch (error) {
        console.error("Error checking project existence:", error);
        toast.error("Failed to fetch project data");
        throw error;
    }
};

export const fetchSearchData = async ({ jobNumber }) => {
    try {
        const response = await apiClient.get(`/fetchbyjob?jobNumber=${jobNumber}`);
        return response.data.data;
    } catch (e) {
        console.log(e.message);
        throw e;
    }
};

export const fetchbyProjectbyId = async (id) => {
    try {
        const response = await apiClient.get(`/fetch/${id}`);
        return response.data.data;
    } catch (e) {
        console.log(e.message);
        throw e;
    }
};

export const fetchProjectsAllnewDocs = async () => {
    try {
        const res = await apiClient.get(`/getProjectforDocs`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

export const fetchProjectsAllnewDocsbyId = async (id) => {
    try {
        const res = await apiClient.get(`/getProjectforDocsbyid/${id}`);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch projects:", err);
        throw err;
    }
};

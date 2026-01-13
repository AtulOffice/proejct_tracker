import apiClient from "../api/axiosClient";

export const fetchProjectsDev = async ({ page, search }) => {
  try {
    const res = await apiClient.get(
      `/projectDev/paginationdev?page=${page}&limit=6&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectsDevprogress = async ({
  page,
  search,
  statusFilter,
}) => {
  try {
    const res = await apiClient.get(
      `/projectDev/paginationdevprog?page=${page}&limit=6&search=${search}&statusprog=${statusFilter}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const statusSave = async ({ data }) => {
  try {
    const res = await apiClient.post(`/projectDev/save`, data);
    return res.data;
  } catch (err) {
    console.error("Failed to save project status:", err);
    if (err.response) throw err.response;
    throw err;
  }
};

export const getStatus = async (Jobnumber) => {
  try {
    const res = await apiClient.get(`/projectDev/fetchbyjobnumber/${Jobnumber}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch project status by job number:", err);
    if (err.response) throw err.response;
    throw new Error("Failed to fetch project status");
  }
};

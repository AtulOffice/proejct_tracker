import axios from "axios";
import toast from "react-hot-toast";

export const fetchProjectsDev = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/projectDev/paginationdev?page=${page}&limit=6&search=${search}`,
      { withCredentials: true }
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
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/projectDev/paginationdevprog?page=${page}&limit=6&search=${search}&statusprog=${statusFilter}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const statusSave = async ({ data }) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/projectDev/save`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    if (err.response) {
      throw err.response;
    }
    console.error("Failed to save project status:", err);
    throw err;
  }
};

export const getStatus = async (Jobnumber) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/projectDev/fetchbyjobnumber/${Jobnumber}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch project status by job number:", err);
    if (err.response) {
      throw err.response;
    }
    throw new Error("Failed to fetch project status");
  }
};

import axios from "axios";
import toast from "react-hot-toast";

export const fetchProjectOveriew = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/getProjectOverview`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
};

export const fetchProjects = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/pagination?page=${page}&limit=15&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
};

export const fetchProjectsCatogary = async ({ status, page, search }) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/catogray/pagination?page=${page}&limit=15&status=${status}&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
};

export const fetchProjectsSotype = async ({ soType, page, search }) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/sotype/pagination?page=${page}&limit=15&soType=${soType}&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
};

export const fetchProjectsUrgent = async ({
  status,
  page,
  startDate,
  search,
}) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/urgentProject/pagination?page=${page}&limit=15&status=${status}&startDate=${startDate}&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
};

export const login = async ({ username, password, navigate }) => {
  if (!username || !password) {
    toast.error("Please enter both username and password");
    return;
  }
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/loginuser`,
      { username, password }
    );
    const token = response?.data?.token;
    if (token) {
      sessionStorage.setItem("token", token);
      toast.success("Login successful!");
      navigate("/page");
    } else {
      toast.error("Login failed: Token not received");
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("somthing went wrong when login");
    }
    console.error("Login error:", error);
  }
};

export const logout = () => {
  sessionStorage.removeItem("token");
};

export const fetchWorkStatusOld = async ({ jobNumber }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/fetchbyjob?jobNumber=${jobNumber}`,
      { username, password }
    );
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

export const fetchWorkStatus = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_URL
      }/worksts/pagination?page=${page}&limit=15&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
  }
};

export const fetchSearchData = async ({ jobNumber }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/fetchbyjob?jobNumber=${jobNumber}`,
      { username, password }
    );
    return response.data.data;
  } catch (e) {
    console.log(e);
  }
};

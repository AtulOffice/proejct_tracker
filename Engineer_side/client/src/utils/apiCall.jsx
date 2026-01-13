import toast from "react-hot-toast";
import apiClient from "../api/axiosClient";


export const fetchEngineerOveriew = async (id) => {
  try {
    const res = await apiClient.get(`/getEngineerOverview/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch engineer overview:", err);
    throw err;
  }
};

export const fetchProjects = async ({ page, search, id }) => {
  try {
    const res = await apiClient.get(`/Engineerpagination/${id}?page=${page}&limit=15&search=${search}`);
    return {
      data: res.data?.assignments,
      hashMore: page < res.data?.pagination?.totalPages,
    };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectslist = async ({ search, id }) => {
  try {
    const res = await apiClient.get(
      `/EngineerProjectlist/${id}?search=${search}`
    );
    return res.data?.assignments;
  } catch (err) {
    console.error("Failed to fetch projects list:", err);
    throw err;
  }
};

export const fetchProjectDOCS = async ({ search }) => {
  try {
    const res = await apiClient.get(
      `/engineerside/getAlldocs?search=${search}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch docs:", err);
    throw err;
  }
};

export const fetchProjectLOGIC = async ({ search }) => {
  try {
    const res = await apiClient.get(
      `/engineerside/getAllLogic?search=${search}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch logic:", err);
    throw err;
  }
};

export const fetchProjectSCADA = async ({ search }) => {
  try {
    const res = await apiClient.get(
      `/engineerside/getAllScada?search=${search}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch scada:", err);
    throw err;
  }
};

export const fetchProjectTESTING = async ({ search }) => {
  try {
    const res = await apiClient.get(
      `/engineerside/getAlltesting?search=${search}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch testing projects:", err);
    throw err;
  }
};

// phase details fetching

export const fetchPhaseLogic = async ({ id }) => {
  try {
    const res = await apiClient.get(`/engineerside/getlogicphase/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchPhaseScada = async ({ id }) => {
  try {
    const res = await apiClient.get(`/engineerside/getscadaphase/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchPhaseTesting = async ({ id }) => {
  try {
    const res = await apiClient.get(`/engineerside/gettestingphase/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};



// save the progress report


export const createProgressReport = async (payload) => {
  try {
    const res = await apiClient.post(`/engineerside/progresssSave/`, payload);
    return res.data;
  } catch (err) {
    console.error("Failed to create progress report:", err);
    throw err;
  }
};

export const fetchProgressBySection = async ({ sectionId }) => {
  try {
    const res = await apiClient.get(`/engineerside/section/${sectionId}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch section progress:", err);
    throw err;
  }
};

export const fetchProgressByProject = async ({ projectId }) => {
  try {
    const res = await apiClient.get(
      `/engineerside/projectforSectionReport/${projectId}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch project progress:", err);
    throw err;
  }
};

export const fetchProgressById = async ({ id }) => {
  try {
    const res = await apiClient.get(`/engineerside/progress/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
    throw err;
  }
};

export const updateProgressReport = async ({ id, payload }) => {
  try {
    const res = await apiClient.put(
      `/engineerside/updateProgress/${id}`,
      payload
    );
    return res.data;
  } catch (err) {
    console.error("Failed to update progress report:", err);
    throw err;
  }
};

export const deleteProgressReport = async ({ id }) => {
  try {
    const res = await apiClient.delete(`/engineerside/deleteProgress/${id}`);
    return res.data;
  } catch (err) {
    console.error("Failed to delete progress report:", err);
    throw err;
  }
};
// find the section progressData

export const fetchProgressByforEngineer = async ({ projectId, type }) => {
  try {
    const res = await apiClient.get(
      `/engineerside/getProgreforshowbyproject/${projectId}?sectiontype=${type}`);
    return res.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
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



export const login = async ({ email, password, navigate, setUser }) => {
  if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }

  try {
    const response = await apiClient.post("/engineerauth/loginengineer", {
      email,
      password,
    });
    const user = response?.data?.user;
    localStorage.setItem("accessToken", response?.data?.accessToken);
    if (user) setUser(user);
    toast.success("Login successful");
    navigate("/page");
  } catch (error) {
    toast.error(error?.response?.data?.message || "Something went wrong when login");
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async ({ navigate, setUser }) => {
  try {
    await apiClient.get(`/engineerauth/logout`);
  } catch (e) {
    console.error("Logout error:", e);
  } finally {
    localStorage.removeItem("accessToken");
    if (setUser) setUser(null);
    if (navigate) navigate("/login");
  }
};
export const fetchWorkStatusEngineerEngineer = async ({ page, search, id }) => {
  try {
    const res = await apiClient.get(
      `/worksts/paginationeng/${id}?page=${page}&limit=15&search=${search}`
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
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

export const fetchbyOrderbyId = async (id) => {
  try {
    const response = await apiClient.get(`/order/fetchbyid/${id}`);
    return response.data.data;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

export const UserCall = async () => {
  try {
    const response = await apiClient.get(
      `/engineerauth/fetchengineerDeatails`
    );
    return response.data;
  } catch (e) {
    console.error("Error fetching user:", e);
    if (e.response) {
      console.log(e.response.data);
    }
    throw e;
  }
};




export const getLatestworkSubmission = async () => {
  try {
    const res = await apiClient.get(`/worksts/getLatestworkSubmission`);
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const fetchAllworkStatusforengineer = async ({ search }) => {
  try {
    const res = await apiClient.get(`/worksts/fetchAllworkStatusforengineer?search=${search}`);
    console.log(res)
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const fetchCommisioningProgressByforEngineer = async ({ projectId }) => {
  try {
    const res = await apiClient.get(
      `/worksts/fetchAllworkStatusbyProjectforengineer/${projectId}`
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
    throw err;
  }
};

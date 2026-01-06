import axios from "axios";
import toast from "react-hot-toast";

export const fetchProjectOveriew = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/getProjectOverview`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjects = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/pagination?page=${page}&limit=15&search=${search}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};
export const fetchProjectslatest = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/latestProjectpagination?page=${page}&limit=15&search=${search}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectsCatogary = async ({ status, page, search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/catogray/pagination?page=${page}&limit=15&status=${status}&search=${search}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectsDevelopment = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/devlopment/pagination?page=${page}&limit=15&search=${search}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectsSotype = async ({ soType, page, search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/sotype/pagination?page=${page}&limit=15&soType=${soType}&search=${search}`,
      { withCredentials: true }
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
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/urgentProject/pagination?page=${page}&limit=15&status=${status}&startDate=${startDate}&search=${search}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectsUrgentAction = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/urgentProjectAction?search=${search}`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchProejctAll = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/allProjectsfetch?search=${search}`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchProejctADev = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/allProjectsfetchdev?search=${search}`,
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};
export const saveAllEngineers = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/engineer/addEngineer`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const getavailableEngineers = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineer/getAvailableEngineers`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while fetching all engineer", err);
    throw err;
  }
};

export const getAssignedEngineers = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineer/getAssignedEngineers`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while fetching all engineer", err);
    throw err;
  }
};

export const getAllEngineers = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineer/getAllEngineers`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while fetching all engineer", err);
    throw err;
  }
};
export const EditAllEngineers = async (id, data) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/engineer/editEngineer/${id}`,
      data,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while updating data", err);
    throw err;
  }
};

export const deleteEngineer = async (id) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/engineer/deleteEngineer/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while deleting data", err);
    throw err;
  }
};

export const login = async ({ username, password, navigate, setUser }) => {
  if (!username || !password) {
    toast.error("Please enter both username and password");
    return;
  }
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/loginuser`,
      { username, password },
      { withCredentials: true }
    );
    const user = response?.data?.user;
    setUser(user);
    if (user) {
      setUser(user);
      toast.success("Login successful");
      navigate("/page", {
        replace: true,
      });
    } else {
      toast.error("Login failed: Token not received");
    }
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message);
    } else {
      toast.error("somthing went wrong when login");
      console.log(error.message);
    }
    console.error("Login error:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.get(`${import.meta.env.VITE_API_URL}/logout`, {
      withCredentials: true,
    });
  } catch (e) {
    if (e.response) {
      toast.error(e.response?.data?.message || "Logout failed");
    }
    console.error("Logout error:", e);
    throw e;
  }
};

export const fetchWorkStatus = async ({ page, search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/worksts/pagination?page=${page}&limit=15&search=${search}`,
      { withCredentials: true }
    );
    return { data: res.data.data, hashMore: page < res.data.totalPages };
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchSearchData = async ({ jobNumber }) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/fetchbyjob?jobNumber=${jobNumber}`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

export const fetchbyProjectbyId = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/fetch/${id}`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

export const UserCall = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/fetchUserDeatails`,
      { withCredentials: true }
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

export const addProject = async ({ formData, engineerData, Docs }) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_API_URL}/save`,
      {
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
      },
      { withCredentials: true }
    );
    toast.success("Data saved successfully");
  } catch (e) {
    if (e.response) {
      toast.error(e.response?.data?.message);
    } else {
      toast.error("something went wrong");
    }
    console.log(e);
    throw e;
  }
};

export const deleteProject = async (id, jobNumber) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/delete/${id}`, {
      withCredentials: true,
    });
    toast.success(`JobId ${jobNumber} deleted successfully`);
  } catch (e) {
    if (e.response) {
      toast.error(e.response?.data?.message);
    }
    toast.error("something went wrong");
    console.log(e);
    throw e;
  }
};

export const updateProject = async (project, navigate) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/projectDev/existancecheck/${project.jobNumber
      }`,
      { withCredentials: true }
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

export const saveWeeklyAssment = async ({
  weekStart,
  engineers,
  tasksByDate,
}) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/devrecord/save`,
      { weekStart, engineers, tasksByDate },
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const fetchWeeklyAssment = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/devrecord/fetchall`,
      { withCredentials: true }
    );
    return res?.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const fetchWeeklyAssmentbyId = async (id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/devrecord/fetchbyid/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

// this is order section

export const fetfchOrdersAll = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/order/getAll?search=${search}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchOrdersAllnew = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/order/getAllnew`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};



export const fetchProjectsAllnewDocs = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/getProjectforDocs`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjectsAllnewDocsbyId = async (id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/getProjectforDocsbyid/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};


export const fetchbyOrderbyId = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/order/fetchbyid/${id}`,
      { withCredentials: true }
    );
    return response.data.data;
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};


// working fetch

export const fetchAllworkStatusAdmin = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/worksts/fetchAllworkStatus?search=${search}`,
      { withCredentials: true }
    );
    return res.data?.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const fetchCommisioningProgressByAdmin = async ({ projectId }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/worksts/fetchAllworkStatusbyProjectforAdmin/${projectId}`,
      { withCredentials: true }
    );
    return res.data?.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
    throw err;
  }
};

import axios from "axios";
import toast from "react-hot-toast";

export const fetchEngineerOveriew = async (id) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/getEngineerOverview/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchProjects = async ({ page, search, id }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/Engineerpagination/${id}?page=${page}&limit=15&search=${search}`,
      { withCredentials: true }
    );

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
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/EngineerProjectlist/${id}?search=${search}`,
      { withCredentials: true }
    );
    return res.data?.assignments;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchProejctDOCS = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getAlldocs?search=${search}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchProejctLOGIC = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getAllLogic?search=${search}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchProejctSCADA = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getAllScada?search=${search}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetfchProejctTESTING = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getAlltesting?search=${search}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

// phase details fetching

export const fetchPhaseLogic = async ({ id }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getlogicphase/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchPhaseScada = async ({ id }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getscadaphase/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};

export const fetchPhaseTesting = async ({ id }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/gettestingphase/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch projects:", err);
    throw err;
  }
};


// save the progress report


export const createProgressReport = async (payload) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/engineerside/progresssSave/`,
      payload,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to create progress report:", err);
    throw err;
  }
};
export const fetchProgressBySection = async ({ sectionId }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/section/${sectionId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch section progress:", err);
    throw err;
  }
};
export const fetchProgressByProject = async ({ projectId }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/projectforSectionReport/${projectId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch project progress:", err);
    throw err;
  }
};
export const fetchProgressById = async ({ id }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/progress/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
    throw err;
  }
};
export const updateProgressReport = async ({ id, payload }) => {
  try {
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/engineerside/updateProgress/${id}`,
      payload,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to update progress report:", err);
    throw err;
  }
};
export const deleteProgressReport = async ({ id }) => {
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/engineerside/deleteProgress/${id}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to delete progress report:", err);
    throw err;
  }
};

// find the section progressData

export const fetchProgressByforEngineer = async ({ projectId, type }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerside/getProgreforshowbyproject/${projectId}?sectiontype=${type}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
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


export const login = async ({ email, password, navigate, setUser }) => {
  if (!email || !password) {
    toast.error("Please enter both email and password");
    return;
  }

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/engineerauth/loginengineer`,
      { email, password },
      { withCredentials: true }
    );
    const user = response?.data?.user;
    setUser(user);
    if (user) {
      setUser(user);
      toast.success("Login successful");
      navigate("/page");
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
    await axios.get(`${import.meta.env.VITE_API_URL}/engineerauth/logout`, {
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

export const fetchWorkStatusEngineerEngineer = async ({ page, search, id }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL
      }/worksts/paginationeng/${id}?page=${page}&limit=15&search=${search}`,
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

export const UserCall = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/engineerauth/fetchengineerDeatails`,
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


// work status operatioin

export const getLatestworkSubmission = async () => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/worksts/getLatestworkSubmission`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};
export const fetchAllworkStatusforengineer = async ({ search }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/worksts/fetchAllworkStatusforengineer?search=${search}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("error while saving", err);
    throw err;
  }
};

export const fetchCommisioningProgressByforEngineer = async ({ projectId }) => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/worksts/fetchAllworkStatusbyProjectforengineer/${projectId}`,
      { withCredentials: true }
    );
    return res.data;
  } catch (err) {
    console.error("Failed to fetch progress report:", err);
    throw err;
  }
};


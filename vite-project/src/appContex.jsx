import axios from "axios";
import React, { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const Context = createContext();

export const AppProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fullData, setFullData] = useState([]);
  const [fullWrksts, setFullWrksts] = useState([]);
  const [toggle, setToggle] = useState(false);
  const limit = 30;

  const fetchProjects = async (shouldReset = false) => {
    try {
      if (shouldReset) {
        const allData = [];

        for (let i = 1; i <= page; i++) {
          const res = await fetch(
            `http://localhost:8000/api/v1/pagination?page=${i}&limit=${limit}`
          );
          const result = await res.json();
          allData.push(...result.data);
        }

        setData(allData);
        setHasMore(page < result.totalPages);
      } else {
        const res = await fetch(
          `http://localhost:8000/api/v1/pagination?page=${page}&limit=${limit}`
        );
        const result = await res.json();

        setData((prev) => [...prev, ...result.data]);
        setHasMore(page < result.totalPages);
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    }
  };
  useEffect(() => {
    const fetchFUlldata = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/v1/fetch");
        const result = await response?.data?.data;
        setFullData(result);
      } catch (e) {
        console.log(e);
      }
    };
    const fetchFUllWOrkStatusData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/worksts/all"
        );
        const result = await response?.data?.data;
        setFullWrksts(result);
      } catch (e) {
        console.log(e);
      }
    };
    fetchFUllWOrkStatusData();
    fetchFUlldata();
  }, [toggle]);

  useEffect(() => {
    fetchProjects();
  }, [page]);

  const login = async ({ username, password, navigate }) => {
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
        console.log("Login response:", response.data);
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

  const logout = () => {
    sessionStorage.removeItem("token");
  };

  return (
    <Context.Provider
      value={{
        data,
        fullData,
        fullWrksts,
        page,
        toggle,
        hasMore,
        setFullData,
        login,
        logout,
        setToggle,
        setPage,
        setHasMore,
        setFullWrksts,
        fetchProjects,
        setData,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAppContext = () => useContext(Context);

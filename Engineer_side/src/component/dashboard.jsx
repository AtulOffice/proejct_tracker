import React, { useEffect, useState } from "react";
import { GoProjectRoadmap } from "react-icons/go";
import logimg from "../assets/logo_image.png";
import { RiNotification3Line, RiProgress2Line } from "react-icons/ri";
import {
  RiMenu4Line,
  RiCloseLine,
  RiDashboardLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import OneCard from "./add.work.jsx";
import ZeroCard from "./overview.Project";
import { useAppContext } from "../appContex";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchEngineerOveriew, logout } from "../utils/apiCall";
import { useRef } from "react";
import ProjectList from "./projectList";
import { ProjectCatogary } from "./ProjectCatogary.jsx";
import EngineerMom from "./Mom.form.jsx";
import axios from "axios";
import AssignmentPage from "./assingement.jsx";
import EngineerWorkStatusFull from "./workFUllForm.jsx";

const AdminDashboard = () => {
  const { toggle, toggleDev, user } = useAppContext();
  const [overvew, setOverview] = useState();
  const [Assignments, setAssignments] = useState([])

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeCard, setActiveCard] = useState(() => {
    return sessionStorage.getItem("activeCard") || "zero";
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchEngineerOveriew(user?._id);
      data && setOverview(data?.overview);
    };
    if (user?._id) fetchData();
  }, [toggle, toggleDev, activeCard]);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/engineerside/fetchAllEngineersProjectshow/${user?._id}`, { withCredentials: true })
        setAssignments(response?.data?.totalAssignments || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?._id) fetchData();
  }, []);



  useEffect(() => {
    sessionStorage.setItem("activeCard", activeCard);
  }, [activeCard]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLogOut = () => {
    try {
      toast.success("logout successfully");
      logout();
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error("error while logout");
    }
  };
  const renderCard = () => {
    switch (activeCard) {
      case "zero":
        return <ZeroCard overvew={overvew} setActiveCard={setActiveCard} />;
      case "one":
        return <OneCard />;
      case "two":
        return <ProjectCatogary key={"all"} all={true} title="ALL" />;
      case "three":
        return <EngineerMom setActiveCard={setActiveCard} />;
      case "four":
        return <AssignmentPage assignments={Assignments} />;
      case "five":
        return <EngineerWorkStatusFull />;
      case "nine":
        return (
          <ProjectCatogary
            key={"work status"}
            workStatus={true}
            title="WORK STATUS"
          />
        );
      case "fifteen":
        return (
          <ProjectCatogary
            key={"devFilter"}
            devFilter={true}
            title="PROJECT INCLUDED DEVLOPMENT"
          />
        );
      default:
        return <ZeroCard overvew={overvew} setActiveCard={setActiveCard} />;
    }
  };

  const handleActiveBar = (val) => {
    setActiveCard(val);
  };

  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarRef, setSidebarOpen]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100">
      <header className="bg-white shadow-md fixed w-full z-30">
        <div className="flex items-center justify-between px-6 h-16">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-600 focus:outline-none lg:hidden"
            >
              {sidebarOpen ? (
                <RiCloseLine size={24} />
              ) : (
                <RiMenu4Line size={24} />
              )}
            </button>
            <div className="ml-4 lg:ml-0">
              {" "}
              <h1 className="text-xl sm:text-xl font-bold bg-gradient-to-r from-pink-500 via-indigo-600 to-teal-400 text-transparent bg-clip-text animate-pulse shadow-lg p-2 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 transition-all duration-300 transform hover:scale-110 tracking-wider flex items-center">
                <span className="mr-2">✨</span>
                <span className="inline">ENGINEER</span>
                <span className="ml-2">✨</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              // onClick={() => setOpen(true)}
              className="text-gray-600 relative cursor-pointer"
            >
              <RiNotification3Line size={20} />
            </button>
            <div className="relative">
              <button className="flex items-center focus:outline-none">
                <img
                  src={logimg}
                  alt="User Avatar"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>
            </div>

            <button
              className="group relative flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-500 transition-all duration-300 rounded-lg hover:bg-red-50 active:scale-95 cursor-pointer"
              onClick={handleLogOut}
            >
              <RiLogoutBoxRLine
                size={20}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>
      </header>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 transform z-20 w-64 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-indigo-600">{""}</h2>
          </div>
          <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <ul className="space-y-2">
              <>
                <li>
                  <div
                    onClick={() => {
                      handleActiveBar("zero");
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${activeCard === "zero" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                  >
                    <RiDashboardLine
                      className="mr-3 text-indigo-500"
                      size={20}
                    />
                    DASHBOARD
                  </div>
                </li>
                <li>
                  <div
                    onClick={() => {
                      handleActiveBar("two");
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${activeCard === "two" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                  >
                    <GoProjectRoadmap className="mr-3" size={20} />
                    ALL
                  </div>
                </li>

                <li>
                  <div
                    onClick={() => {
                      handleActiveBar("three");
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${activeCard === "three" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                  >
                    <GoProjectRoadmap className="mr-3" size={20} />
                    MOM
                  </div>
                </li>
              </>
              <li>
                <div
                  onClick={() => {
                    handleActiveBar("five");
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${activeCard === "five" ? "bg-indigo-50 rounded-md" : ""
                    }`}
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  WORK REPORT
                </div>
              </li>
              <li>
                <div
                  onClick={() => {
                    handleActiveBar("four");
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${activeCard === "four" ? "bg-indigo-50 rounded-md" : ""
                    }`}
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  MOM LIST
                </div>
              </li>
              <>
                <li>
                  <a
                    onClick={() => {
                      handleActiveBar("nine");
                      setSidebarOpen(false);
                    }}
                    className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${activeCard === "nine" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                  >
                    <RiProgress2Line className="mr-3" size={20} />
                    WORK LIST
                  </a>
                </li>
              </>
            </ul>
          </nav>
        </div>
      </aside>
      {renderCard()}
    </div>
  );
};

export default AdminDashboard;

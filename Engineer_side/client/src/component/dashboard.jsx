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
import { useAppContext } from "../appContext.jsx";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchEngineerOveriew, fetchProjectslist, fetchProjectLOGIC, fetchProjectSCADA, fetchProjectTESTING, logout, fetchAllworkStatusforengineer } from "../utils/apiCall";
import { useRef } from "react";
import ProjectList from "./projectList.jsx";
import ProjectListOperation from "./ProjectListOperation.jsx";
import { ProjectCatogary } from "./ProjectCatogary.jsx";
import EngineerMom from "./Mom.form.jsx";
import AssignmentPage from "./assingement.jsx";
import EngineerWorkStatusFull from "./workFUllForm.jsx";
import apiClient from "../api/axiosClient.js";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { toggle, toggleDev, user, toggleEng, setUser, setToggleEng } = useAppContext();
  const [overvew, setOverview] = useState();
  const [Assignments, setAssignments] = useState([])
  const [isOpen, setIsOpen] = useState(false);

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
        const response = await apiClient.get(`/engineerside/fetchAllEngineersProjectshow/${user?._id}`)
        setAssignments(response?.data?.totalAssignments || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (user?._id) fetchData();
  }, [toggleEng]);



  useEffect(() => {
    sessionStorage.setItem("activeCard", activeCard);
  }, [activeCard]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const menuItems = [
    { key: "zero", label: "DASHBOARD", icon: RiDashboardLine },
    { key: "two", label: "PROJECTS", icon: GoProjectRoadmap },
    { key: "three", label: "SUBMIT MOM", icon: GoProjectRoadmap },
    { key: "eight", label: "LOGIC", icon: GoProjectRoadmap },
    { key: "nine", label: "SCADA", icon: GoProjectRoadmap },
    { key: "ten", label: "TESTING", icon: GoProjectRoadmap },
    { key: "five", label: "WORK REPO", icon: GoProjectRoadmap },
    { key: "four", label: "MOM LIST", icon: GoProjectRoadmap },
    { key: "six", label: "WORK LIST", icon: RiProgress2Line, isLink: true },
  ];

  const handleLogOut = () => {
    try {
      toast.success("logout successfully");
      logout({ navigate: navigate, setUser: setUser });
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error("error while logout");
    }
  };


  const ProjectActionTaball = [
    {
      head: "Project Name",
      val: "projectName",
    },
    {
      head: "JOB ID",
      val: "jobNumber",
    },
    {
      head: "visitDate",
      val: "visitDate",
    },
  ];

  const ProjectActionTab = [
    {
      head: "Project Name",
      val: "projectName",
    },
    {
      head: "JOB ID",
      val: "jobNumber",
    },
    {
      head: "DEV STATUS",
      val: "service",
    },
    {
      head: "COMPLETION",
      val: "",
    },
  ];

  const worktActionTab = [
    {
      head: "Project",
      val: "projectName",
    },
    {
      head: "JOB ID",
      val: "jobNumber",
    },
    {
      head: "LAST REPORT",
      val: "submittedAt",
    },
    {
      head: "PROGRESS",
      val: "progressPercent",
    },
  ];


  const renderCard = () => {
    switch (activeCard) {
      case "zero":
        return <ZeroCard overvew={overvew} setActiveCard={setActiveCard} />;
      case "one":
        return <OneCard />;
      case "two":
        return (<ProjectList
          key={"ALL"}
          tableVal={ProjectActionTaball}
          fetchFun={fetchProjectslist}
          isEdit={true}
          onEditFun="ALL"
          editType="ALLPROJECT"
          printTitle="ALL PROEJCT"
        />
        );

      case "three":
        return <EngineerMom setActiveCard={setActiveCard} />;

      case "four":
        return <AssignmentPage assignments={Assignments} />;
      case "five":
        return <EngineerWorkStatusFull />;
      case "six":
        return (
          // <ProjectCatogary
          //   key={"work status"}
          //   workStatus={true}
          //   title="WORK STATUS"
          // />
          <ProjectListOperation
            key={"WORKING"}
            tableVal={worktActionTab}
            fetchFun={fetchAllworkStatusforengineer}
            isEdit={true}
            onEditFun="WORKING"
            printTitle="WORKING REPORT"
          />
        );
      case "eight":
        return (
          <ProjectListOperation
            key={"LOGIC"}
            tableVal={ProjectActionTab}
            fetchFun={fetchProjectLOGIC}
            isEdit={true}
            onEditFun="LOGIC"
            printTitle="LOGIC PROEJCT"
          />

        );
      case "nine":
        return (
          <ProjectListOperation
            key={"SCADA"}
            tableVal={ProjectActionTab}
            fetchFun={fetchProjectSCADA}
            isEdit={true}
            onEditFun="SCADA"
            printTitle="SCADA PROEJCT"
          />
        );
      case "ten":
        return (
          <ProjectListOperation
            key={"TESTING"}
            tableVal={ProjectActionTab}
            fetchFun={fetchProjectTESTING}
            isEdit={true}
            onEditFun="TESTING"
            printTitle="TESTING PROEJCT"
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
  const dropdownRef = useRef(null);

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

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
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center focus:outline-none">
                <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  {getInitials(user?.name || user?.username || "User")}
                </div>
              </button>

              {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 group z-10"
                    >
                      <svg
                        className="w-4 h-4 text-white group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>

                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">
                          {user?.name || user?.username || "John Doe"}
                        </h3>
                        <p className="text-indigo-100 text-sm mt-0.5 truncate">
                          {user?.email || "john.doe@example.com"}
                        </p>
                        {user?.activeDesignation && (
                          <p className="text-indigo-200 text-xs mt-2 font-semibold tracking-wide">
                            Active: {user.activeDesignation.toUpperCase()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="py-3 px-4">
                      <p className="text-xs font-bold text-gray-500 mb-2">DESIGNATIONS</p>
                      {/* <div className="flex flex-wrap gap-2">
                        {(user?.designations || []).length === 0 ? (
                          <p className="text-xs text-gray-400">No designation assigned</p>
                        ) : (
                          (user?.designations || []).map((d) => (
                            <button
                              key={d}
                              onClick={() => setSelectedDesignation(d)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150
                  ${selectedDesignation === d
                                  ? "bg-indigo-600 text-white border-indigo-600"
                                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                            >
                              {d.toUpperCase()}
                            </button>
                          ))
                        )}
                      </div> */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150 bg-indigo-600 text-white border-indigo-600`}
                        >
                          ENGINEER
                        </button>
                      </div>
                    </div>
                    <div className="py-2">
                      <button
                        onClick={handleLogOut}
                        className="w-full flex items-center gap-3 px-4 py-3.5 hover:cursor-pointer hover:bg-red-50 border-t border-gray-100 transition-all duration-150 text-left group"
                      >
                        <LogOut className="h-4.5 w-4.5 text-red-500 group-hover:text-red-600 flex-shrink-0" />
                        <span className="font-medium text-red-600">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 transform z-20 w-45 lg:translate-x-0
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-indigo-600">{""}</h2>
          </div>

          <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const baseClass = `flex items-center px-3 py-2 text-gray-700 cursor-pointer font-medium rounded-md
            ${activeCard === item.key ? "bg-indigo-50" : "hover:bg-gray-50"}`;

                const onClick = () => {
                  handleActiveBar(item.key);
                  setSidebarOpen(false);
                };

                return (
                  <li key={item.key}>
                    {item.isLink ? (
                      <a onClick={onClick} className={baseClass}>
                        <Icon className="mr-3 text-indigo-500" size={20} />
                        {item.label}
                      </a>
                    ) : (
                      <div onClick={onClick} className={baseClass}>
                        <Icon className="mr-3 text-indigo-500" size={20} />
                        {item.label}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {renderCard()}
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { GoProjectRoadmap } from "react-icons/go";
import { FaRegSquarePlus } from "react-icons/fa6";
import { MdCancel, MdOutlinePendingActions } from "react-icons/md";
import { TbUrgent } from "react-icons/tb";
import logimg from "../assets/logo_image.png";
import {
  RiCustomerServiceFill,
  RiNotification3Line,
  RiProgress2Line,
} from "react-icons/ri";
import {
  RiMenu4Line,
  RiCloseLine,
  RiDashboardLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import OneCard from "./add.Project";
import ZeroCard from "./overview.Project";
import TwoCard from "./all.Project";
import NineCard from "./workStatus.Project";
import { useAppContext } from "../appContex";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProjectOveriew, logout } from "../utils/apiCall";
import ProjectDev from "./project.Devlopment";
import ProjectsDevlopment from "./development.projects";
import ProejctACtions from "./ProejctACtions.projects";
import EngineerAction from "./EngineerActions.projects";
import AssessMentAction from "./AssessMentAction.projects.jsx";
import NotificationForm from "./notification";
import { useRef } from "react";
import WeeklyAssignmentForm from "./weeklyData";
import ProjectList from "./projectList";
import { ProjectCatogary } from "./ProjectCatogary.jsx";

const AdminDashboard = () => {
  const formRef = useRef(null);
  const { toggle, user, userLoading, toggleDev } = useAppContext();
  const [overvew, setOverview] = useState();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProjectOveriew();
      data && setOverview(data);
    };
    fetchData();
  }, [toggle, toggleDev]);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [activeCard, setActiveCard] = useState(() => {
    return sessionStorage.getItem("activeCard") || "zero";
  });

  useEffect(() => {
    if (!userLoading && user?.role === "design" && activeCard !== "fourteen") {
      setActiveCard("fourteen");
    }
  }, [user, userLoading, activeCard]);

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
        return <TwoCard />;
      case "three":
        return (
          <ProjectCatogary
            key={"upcomming"}
            status="upcoming"
            title="UPCOMING"
          />
        );
      case "four":
        return (
          <ProjectCatogary key={"pending"} status="pending" title="PENDING" />
        );
      case "five":
        return (
          <ProjectCatogary
            key={"completed"}
            status="completed"
            title="COMPLETED"
          />
        );
      case "six":
        return (
          <ProjectCatogary key={"SERVICE"} soType="SERVICE" title="SERVICE" />
        );
      case "seven":
        return (
          <ProjectCatogary key={"urgent"} urgentMode={true} title="URGENT" />
        );
      case "eight":
        return (
          <ProjectCatogary
            key={"cancelled"}
            status="cancelled"
            title="CANCELLED"
          />
        );
      case "nine":
        return <NineCard />;
      case "ten":
        return (
          <ProjectCatogary key={"running"} status="running" title="RUNNING" />
        );
      case "eleven":
        return <ProjectCatogary key={"latest"} title="LATEST" />;
      case "twelve":
        return (
          <ProjectCatogary
            key={"no request"}
            status="no request"
            title="NO REQUEST"
          />
        );
      case "thirteen":
        return (
          <ProjectCatogary key={"closed"} status="closed" title="CLOSED" />
        );
      case "fourteen":
        return <ProjectDev />;
      case "fifteen":
        return <ProjectsDevlopment />;
      case "sixteen":
        return <ProejctACtions />;
      case "seventeen":
        return <EngineerAction />;
      case "eighteen":
        return <WeeklyAssignmentForm />;
      case "ninteen":
        return <ProjectList />;
      case "twenty":
        return <AssessMentAction />;
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
      {open && <NotificationForm formRef={formRef} setOpen={setOpen} />}
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
                <span className="hidden sm:inline">
                  {user.role === "admin"
                    ? "ADMIN DASHBOARD"
                    : user?.role === "reception"
                    ? "RECEPTION DASHBOARD"
                    : "DESIGN DASHBOARD"}
                </span>
                <span className="inline sm:hidden">
                  {user.role === "admin"
                    ? "ADMIN"
                    : user?.role === "reception"
                    ? "RECEPTION"
                    : "DESIGN"}
                </span>

                <span className="ml-2">✨</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setOpen(true)}
              className="text-gray-600 relative cursor-pointer"
            >
              <RiNotification3Line size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                {overvew?.todayNotice ?? 0}
              </span>
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
        className={`fixed inset-y-0 left-0 bg-white shadow-lg transition-all duration-300 transform z-20 w-64 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h2 className="text-xl font-bold text-indigo-600">{""}</h2>
          </div>
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              {(user?.role === "reception" || user?.role == "admin") && (
                <>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("zero");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "zero" ? "bg-indigo-50 rounded-md" : ""
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
                        handleActiveBar("one");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "one" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <FaRegSquarePlus className="mr-3" size={20} />
                      ADD NEW
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("two");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "two" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      ALL
                    </div>
                  </li>
                  {(user?.role == "admin" || user?.role == "reception") && (
                    <>
                      <li>
                        <div
                          onClick={() => {
                            handleActiveBar("sixteen");
                            setSidebarOpen(false);
                          }}
                          className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                            activeCard === "sixteen"
                              ? "bg-indigo-50 rounded-md"
                              : ""
                          }`}
                        >
                          <GoProjectRoadmap className="mr-3" size={20} />
                          PROJECT ACTIONS
                        </div>
                      </li>
                    </>
                  )}

                  {user?.role == "admin" && (
                    <>
                      <li>
                        <div
                          onClick={() => {
                            handleActiveBar("seventeen");
                            setSidebarOpen(false);
                          }}
                          className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                            activeCard === "seventeen"
                              ? "bg-indigo-50 rounded-md"
                              : ""
                          }`}
                        >
                          <GoProjectRoadmap className="mr-3" size={20} />
                          ENGINEERS
                        </div>
                      </li>
                    </>
                  )}
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("ninteen");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "ninteen"
                          ? "bg-indigo-50 rounded-md"
                          : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      ALL PROJECT LIST
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("three");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "three" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      UPCOMING
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("eighteen");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "eighteen"
                          ? "bg-indigo-50 rounded-md"
                          : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      WEEKLY ASSESSMENT
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("twenty");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "twenty" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      ASSESSMENTS
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("ten");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "ten" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      RUNNING
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("twelve");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "twelve" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      NO REQUEST
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("eleven");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "eleven" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      LATEST
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("four");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "four" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <MdOutlinePendingActions className="mr-3" size={20} />
                      PENDING
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("five");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "five" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      COMPLETED
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("thirteen");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "thirteen"
                          ? "bg-indigo-50 rounded-md"
                          : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      CLOSED
                    </div>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        handleActiveBar("seven");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "seven" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <TbUrgent className="mr-3" size={20} />
                      URGENT
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        handleActiveBar("six");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "six" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <RiCustomerServiceFill className="mr-3" size={20} />
                      SERVICES
                    </a>
                  </li>
                  <li>
                    <div
                      onClick={() => {
                        handleActiveBar("fifteen");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "fifteen"
                          ? "bg-indigo-50 rounded-md"
                          : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      PROJECTS UNDER DEVLOPMENT
                    </div>
                  </li>
                </>
              )}
              <li>
                <div
                  onClick={() => {
                    handleActiveBar("fourteen");
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                    activeCard === "fourteen" ? "bg-indigo-50 rounded-md" : ""
                  }`}
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  PROJECT DEV STATUS
                </div>
              </li>
              {(user?.role == "admin" || user?.role == "reception") && (
                <>
                  <li>
                    <a
                      onClick={() => {
                        handleActiveBar("eight");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "eight" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <MdCancel className="mr-3" size={20} />
                      CANCELLED
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        handleActiveBar("nine");
                        setSidebarOpen(false);
                      }}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "nine" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <RiProgress2Line className="mr-3" size={20} />
                      WORK STATUS
                    </a>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </aside>
      {renderCard()}
    </div>
  );
};

export default AdminDashboard;

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
import ThreeCard from "./upcoming.Project";
import FourCard from "./pending.Project";
import SixCard from "./services.Project";
import FiveCard from "./complte.Project";
import SevenCard from "./urgent.Project";
import EightCard from "./cancelled.Project";
import NineCard from "./workStatus.Project";
import TenCard from "./running.Project";
import { useAppContext } from "../appContex";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchProjectOveriew, logout } from "../utils/apiCall";
import ElevenCard from "./latest.project";
import ProjectsNoRequest from "./norequest";
import ProjectsClosed from "./closed.Project";
import ProjectDev from "./project.Devlopment";
import ProjectsDevlopment from "./development.projects";
import ProejctACtions from "./ProejctACtions.projects";
import EngineerAction from "./EngineerActions.projects";
import NotificationForm from "./notification";
import { useRef } from "react";
import WeeklyAssignmentForm from "./weeklyData";

const AdminDashboard = () => {
  const formRef = useRef(null);
  const { toggle, user, userLoading } = useAppContext();
  const [overvew, setOverview] = useState();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchProjectOveriew();
      data && setOverview(data);
    };
    fetchData();
  }, [toggle]);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const [activeCard, setActiveCard] = useState(() => {
  //   return sessionStorage.getItem("activeCard") || "zero";
  // });
  const [activeCard, setActiveCard] = useState("eighteen");

  useEffect(() => {
    if (!userLoading && user?.role === "design" && activeCard !== "fourteen") {
      setActiveCard("fourteen");
    }
  }, [user, userLoading, activeCard]);

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
        return <ThreeCard />;
      case "four":
        return <FourCard />;
      case "five":
        return <FiveCard />;
      case "six":
        return <SixCard />;
      case "seven":
        return <SevenCard />;
      case "eight":
        return <EightCard />;
      case "nine":
        return <NineCard />;
      case "ten":
        return <TenCard />;
      case "eleven":
        return <ElevenCard />;
      case "twelve":
        return <ProjectsNoRequest />;
      case "thirteen":
        return <ProjectsClosed />;
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
      default:
        return <ZeroCard overvew={overvew} setActiveCard={setActiveCard} />;
    }
  };

  // useEffect(() => {
  //   sessionStorage.setItem("activeCard", activeCard);
  // }, [activeCard]);

  const handleActiveBar = (val) => {
    setActiveCard(val);
  };

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
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-indigo-600 to-teal-400 text-transparent bg-clip-text animate-pulse shadow-lg p-2 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 transition-all duration-300 transform hover:scale-110 tracking-wider flex items-center">
                {" "}
                <span className="mr-2">✨</span>{" "}
                {user.role === "admin"
                  ? "ADMIN DASHBOARD"
                  : user?.role === "reception"
                  ? "RECEPTION DASHBOARD"
                  : "DESIGN DASHBOARD"}
                <span className="ml-2">✨</span>{" "}
              </h1>{" "}
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
              {/* <span className="text-sm font-medium">LOG OUT</span> */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>
        </div>
      </header>

      <aside
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
                      onClick={() => handleActiveBar("zero")}
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
                      onClick={() => handleActiveBar("one")}
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
                      onClick={() => handleActiveBar("two")}
                      className={`flex items-center px-4 py-3 text-gray-700 cursor-pointer font-medium ${
                        activeCard === "two" ? "bg-indigo-50 rounded-md" : ""
                      }`}
                    >
                      <GoProjectRoadmap className="mr-3" size={20} />
                      ALL
                    </div>
                  </li>
                  {user?.role == "admin" && (
                    <>
                      {" "}
                      <li>
                        <div
                          onClick={() => handleActiveBar("seventeen")}
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
                      <li>
                        <div
                          onClick={() => handleActiveBar("sixteen")}
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
                  <li>
                    <div
                      onClick={() => handleActiveBar("three")}
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
                      onClick={() => handleActiveBar("ten")}
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
                      onClick={() => handleActiveBar("twelve")}
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
                      onClick={() => handleActiveBar("eleven")}
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
                      onClick={() => handleActiveBar("four")}
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
                      onClick={() => handleActiveBar("five")}
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
                      onClick={() => handleActiveBar("thirteen")}
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
                      onClick={() => handleActiveBar("seven")}
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
                      onClick={() => handleActiveBar("six")}
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
                      onClick={() => handleActiveBar("fifteen")}
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
                  onClick={() => handleActiveBar("fourteen")}
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
                      onClick={() => handleActiveBar("eight")}
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
                      onClick={() => handleActiveBar("nine")}
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

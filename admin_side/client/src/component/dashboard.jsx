import React, { useEffect, useState } from "react";
import logimg from "../assets/logo_image.png";
import { RiNotification3Line } from "react-icons/ri";
import {
  RiMenu4Line,
  RiCloseLine,
  RiLogoutBoxRLine,
} from "react-icons/ri";
import OneCard from "./add.Project";
import ZeroCard from "./overview.Project";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  logout
} from "../apiCall/authApicall";
import EngineerAction from "./EngineerActions.projects";
import AssessMentAction from "./AssessMentAction.projects.jsx";
import NotificationForm from "./notification";
import { useRef } from "react";
import WeeklyAssignmentForm from "./weeklyData";
import ProjectList from "./projectList";
import { ProjectCatogary } from "./ProjectCatogary.jsx";
import OrderForm from "./OrderForm.jsx";
import OrderList from "./orderList.jsx";
import { fetchAllworkStatusAdmin } from "../apiCall/workProgress.Api.js";
import { fetchProjectOveriew, fetchProjectsUrgentAction, fetfchProejctADev, fetfchProejctAll } from "../apiCall/project.api.js";
import { useDispatch, useSelector } from "react-redux";
import { menuItems, ProjectActionTab, ProjectTab, ProjectTabDev, worktActionTab } from "../utils/menuItems.jsx";
import { LogOut, Settings, User } from "lucide-react";

const AdminDashboard = () => {


  const formRef = useRef(null);
  const dispatch = useDispatch()

  const { toggle, toggleDev } = useSelector((state) => state.ui);
  const { user, userLoading } = useSelector((state) => state.auth);

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
      logout({ dispatch, navigate });
      toast.success("logout successfully");
      navigate("/login");
    } catch (e) {
      console.log(e);
      toast.error("error while logout");
    }
  };


  const renderCard = () => {
    switch (activeCard) {
      case "zero":
        return <ZeroCard overvew={overvew} setActiveCard={setActiveCard} user={user} />;
      // case "seven":
      //   return (
      //     <ProjectCatogary key={"urgent"} urgentMode={true} title="URGENT" />
      //   );
      case "nine":
        return (
          <ProjectList
            key={"WORKING"}
            tableVal={worktActionTab}
            fetchFun={fetchAllworkStatusAdmin}
            isEdit={true}
            onEditFun="WORKING"
            printTitle="WORKING REPORT"
          />
        );
      case "sixteen":
        return (
          <ProjectList
            key={"URGENT"}
            tableVal={ProjectActionTab}
            fetchFun={fetchProjectsUrgentAction}
            isEdit={true}
            onEditFun="URGENT"
            printTitle="URGENT PROJECT LIST"
          />
        );
      case "ninteen":
        return (
          <ProjectList
            key={"ALLPROJECT"}
            tableVal={ProjectTab}
            fetchFun={fetfchProejctAll}
            isEdit={true}
            onEditFun="ALLPROJECT"
            printTitle="PROJECT LIST"
          />
        );
      case "seventeen":
        return <EngineerAction />;
      case "eighteen":
        return <WeeklyAssignmentForm />;
      case "twenty":
        return <AssessMentAction />;
      case "twentyone":
        return <OrderForm setActiveCard={setActiveCard} />;
      case "twentytwo":
        return <OrderList />;
      case "twentythree":
        return (
          <ProjectList
            key={"DEVLOPMENT"}
            tableVal={ProjectTabDev}
            fetchFun={fetfchProejctADev}
            isEdit={true}
            onEditFun="DEVLOPMENT"
            printTitle="DEVLOPMENT PROJECT LIST"
          />
        );
      default:
        return <ZeroCard overvew={overvew} setActiveCard={setActiveCard} />;
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0][0].toUpperCase();

    return (parts[0][0] + parts[1][0]).toUpperCase();
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

  const SidebarItem = ({ item, activeCard, handleActiveBar, setSidebarOpen }) => {
    const Icon = item.icon;

    return (
      <li>
        <div
          onClick={() => {
            handleActiveBar(item.key);
            setSidebarOpen(false);
          }}
          className={`flex items-center px-4 py-2.5 text-gray-700 cursor-pointer font-medium rounded-md
          ${activeCard === item.key ? "bg-indigo-50" : "hover:bg-gray-50"}`}
        >
          <Icon className="mr-3 text-indigo-500" size={20} />
          {item.label}
        </div>
      </li>
    );
  };


  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-indigo-100">
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
              <h1 className="text-xl sm:text-xl font-bold bg-linear-to-r from-pink-500 via-indigo-600 to-teal-400 text-transparent bg-clip-text animate-pulse shadow-lg p-2 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 transition-all duration-300 transform hover:scale-110 tracking-wider flex items-center">
                <span className="mr-2">✨</span>
                <span>
                  {user?.role === "admin"
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
              <span className="absolute -top-1 -right-1 bg-red-500 text-white! rounded-full w-4 h-4 flex items-center justify-center text-xs">
                {overvew?.todayNotice ?? 0}
              </span>
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
                <div className="absolute top-full right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2 duration-200 z-50">
                  <div className="p-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white relative">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 group z-10"
                    >
                      <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate">{user?.name || user?.username || "John Doe"}</h3>
                        <p className="text-indigo-100 text-sm mt-0.5 truncate">{user?.email || "john.doe@example.com"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="divide-y divide-gray-100">
                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all duration-150 text-left group">
                        <User className="h-4.5 w-4.5 text-gray-500 group-hover:text-indigo-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Profile</span>
                      </button>
                    </div>

                    <div className="py-2">
                      <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 transition-all duration-150 text-left group">
                        <Settings className="h-4.5 w-4.5 text-gray-500 group-hover:text-indigo-600 flex-shrink-0" />
                        <span className="font-medium text-gray-900">Settings</span>
                      </button>

                      <button onClick={handleLogOut} className="w-full flex items-center gap-3 px-4 py-3.5 hover:cursor-pointer hover:bg-red-50 border-t border-gray-100 transition-all duration-150 text-left group">
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
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 transform z-20 w-38 lg:translate-x-0
    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center border-b border-gray-200">
            <h2 className="text-lg font-bold text-indigo-600">{""}</h2>
          </div>
          <nav className="flex-1 px-2 py-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            <ul className="space-y-1">
              {menuItems
                .filter(
                  (item) =>
                    item.roles.includes(user?.role) &&
                    (user?.allowedMenuIds || []).includes(item.id)
                )
                .map((item) => (
                  <SidebarItem
                    key={item.key}
                    item={item}
                    activeCard={activeCard}
                    handleActiveBar={handleActiveBar}
                    setSidebarOpen={setSidebarOpen}
                  />
                ))}

            </ul>
          </nav>
        </div>
      </aside>

      {renderCard()}
    </div>
  );
};

export default AdminDashboard;

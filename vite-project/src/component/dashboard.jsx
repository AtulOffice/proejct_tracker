import React, { useMemo, useState } from "react";
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
import ThreeCard from "./upcomming.Project";
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

const AdminDashboard = () => {
  const { fullWrksts } = useAppContext();
  const todayWorkStatus = useMemo(() => {
    if (!fullWrksts || !Array.isArray(fullWrksts)) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const valWork = fullWrksts.filter((item) => {
      const createdAt = new Date(item.createdAt);
      return createdAt >= today;
    });
    return valWork.length;
  }, [fullWrksts]);
  const navigate = useNavigate();
  const { logout } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeCard, setActiveCard] = useState("zero");
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const handleLogOut = () => {
    try {
      toast.success("logout successfully");
      logout();
      navigate("/login");
    } catch (e) {
      toast.error("error while logout");
    }
  };
  const renderCard = () => {
    switch (activeCard) {
      case "zero":
        return <ZeroCard />;
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
      default:
        return <ZeroCard />;
    }
  };

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
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 via-indigo-600 to-teal-400 text-transparent bg-clip-text animate-pulse shadow-lg p-2 rounded-lg border-2 border-indigo-300 hover:border-indigo-500 transition-all duration-300 transform hover:scale-110 tracking-wider flex items-center">
                {" "}
                <span className="mr-2">✨</span> ADMIN{" "}
                <span className="ml-2">✨</span>{" "}
              </h1>{" "}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="text-gray-600 relative">
              <RiNotification3Line size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs">
                {todayWorkStatus}
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
            <h2 className="text-xl font-bold text-indigo-600">ADMIN</h2>
          </div>
          <nav className="flex-1 px-4 py-6 overflow-y-auto">
            <ul className="space-y-2">
              <li>
                <div
                  onClick={() => setActiveCard("zero")}
                  className="flex items-center px-4 py-3 text-gray-700 cursor-pointer bg-indigo-50 rounded-md font-medium"
                >
                  <RiDashboardLine className="mr-3 text-indigo-500" size={20} />
                  Dashboard
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveCard("one")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <FaRegSquarePlus className="mr-3" size={20} />
                  Add New Project
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveCard("two")}
                  className="flex items-center px-4 py-3 text-gray-600 cursor-pointer hover:bg-gray-100 rounded-md font-medium"
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  ALL PROJECTS
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveCard("three")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  UPCOMING PROJECTS
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveCard("ten")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  RUNNING PROJECTS
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveCard("four")}
                  className="flex items-center px-4 py-3 text-gray-600
                  hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <MdOutlinePendingActions className="mr-3" size={20} />
                  PENDING PROJECTS
                </div>
              </li>
              <li>
                <div
                  onClick={() => setActiveCard("five")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium "
                >
                  <GoProjectRoadmap className="mr-3" size={20} />
                  COMPLTED PROJECTS
                </div>
              </li>
              <li>
                <a
                  onClick={() => setActiveCard("seven")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <TbUrgent className="mr-3" size={20} />
                  URGENT PROJECTS
                </a>
              </li>
              <li>
                <a
                  onClick={() => setActiveCard("six")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <RiCustomerServiceFill className="mr-3" size={20} />
                  SERVICES
                </a>
              </li>
              <li>
                <a
                  onClick={() => setActiveCard("eight")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <MdCancel className="mr-3" size={20} />
                  CANCELLED PROJECT
                </a>
              </li>
              <li>
                <a
                  onClick={() => setActiveCard("nine")}
                  className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 cursor-pointer rounded-md font-medium"
                >
                  <RiProgress2Line className="mr-3" size={20} />
                  WORK STATUS
                </a>
              </li>
            </ul>

            <div className="border-t border-gray-200 mt-6 pt-6">
              <div
                onClick={handleLogOut}
                className="cursor-pointer flex items-center px-4 py-3 text-gray-600 hover:bg-red-100 rounded-md font-medium"
              >
                <RiLogoutBoxRLine className="mr-3" size={20} />
                Logout
              </div>
            </div>
          </nav>
        </div>
      </aside>
      {renderCard()}
    </div>
  );
};

export default AdminDashboard;

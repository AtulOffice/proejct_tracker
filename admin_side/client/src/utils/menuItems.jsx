
import { GoProjectRoadmap } from "react-icons/go";
import { FaClipboardList, FaRegSquarePlus } from "react-icons/fa6";
import {
    RiProgress2Line,
} from "react-icons/ri";
import {
    RiDashboardLine,
} from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";

export const menuItems = [
    {
        key: "zero",
        label: "DASHBOARD",
        icon: RiDashboardLine,
        roles: ["reception", "admin"],
    },
    {
        key: "twentyone",
        label: "CREATE ORDER",
        icon: FaShoppingCart,
        roles: ["reception", "admin"],
    },
    {
        key: "twentytwo",
        label: "ORDER LIST",
        icon: FaClipboardList,
        roles: ["reception", "admin"],
    },
    {
        key: "one",
        label: "ADD SRVC DETAILS",
        icon: FaRegSquarePlus,
        roles: ["reception", "admin"],
    },
    {
        key: "ninteen",
        label: "ALL PROJECTS",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
    },
    {
        key: "sixteen",
        label: "PROJECT ACTIONS",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
    },
    {
        key: "twentythree",
        label: "PROJ INC DEV",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
    },
    {
        key: "seventeen",
        label: "ENGINEERS",
        icon: GoProjectRoadmap,
        roles: ["admin"],
    },
    {
        key: "eighteen",
        label: "WEEKLY ASSESSMENT",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
    },
    {
        key: "twenty",
        label: "ASSESSMENTS",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
    },
    {
        key: "nine",
        label: "WORK STATUS",
        icon: RiProgress2Line,
        roles: ["reception", "admin"],
    },
];

export const ProjectTab = [

    {
        head: "JOB ID",
        val: "jobNumber",
    },
    {
        head: "Client",
        val: "projectName",
    },
    {
        head: "endUser",
        val: "endUser",
    },
    { head: "Booking", val: "bookingDate" },
    {
        head: "Target Delivery",
        val: "actualDeleveryDate",
    },

];
export const ProjectTabDev = [
    {
        head: "Project",
        val: "projectName",
    },
    {
        head: "JOB ID",
        val: "jobNumber",
    },
    {
        head: "Status",
        val: "status",
    },
    {
        head: "Delivery",
        val: "deleveryDate",
    },
    { head: "Visit", val: "visitDate" },
    { head: "LOGIC/SCADA", val: "Development" },
];
export const worktActionTab = [
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
export const ProjectActionTab = [
    {
        head: "Project",
        val: "projectName",
    },
    {
        head: "JOB ID",
        val: "jobNumber",
    },
    {
        head: "Status",
        val: "status",
    },
    {
        head: "Delivery",
        val: "deleveryDate",
    },
    { head: "Visit", val: "visitDate" },
    { head: "DEV/COMM", val: "service" },
];

import { GoProjectRoadmap } from "react-icons/go";
import { FaClipboardList, FaRegSquarePlus } from "react-icons/fa6";
import {
    RiProgress2Line,
} from "react-icons/ri";
import {
    RiDashboardLine,
} from "react-icons/ri";
import { FaShoppingCart } from "react-icons/fa";
import { MdAssignmentAdd } from "react-icons/md";

export const menuItems = [
    {
        id: 0,
        key: "zero",
        label: "DASHBOARD",
        icon: RiDashboardLine,
        roles: ["reception", "admin"],
        designations: ["marketing", "commercial", "coordinator", "development"],
    },
    {
        id: 21,
        key: "twentyone",
        label: "CREATE ORDER",
        icon: FaShoppingCart,
        roles: ["reception", "admin"],
        designations: ["commercial", "marketing"],
    },
    {
        id: 22,
        key: "twentytwo",
        label: "ORDER LIST",
        icon: FaClipboardList,
        roles: ["reception", "admin"],
        designations: ["commercial", "marketing"],
    },
    {
        id: 1,
        key: "one",
        label: "SRVC DET",
        icon: FaRegSquarePlus,
        roles: ["reception", "admin"],
        designations: [""],
    },
    {
        id: 19,
        key: "ninteen",
        label: "ALL PROJ",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
        designations: ["commissioning", "coordinator"],
    },
    {
        id: 16,
        key: "sixteen",
        label: "PROJ ACT",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
        designations: ["commissioning"],
    },
    {
        id: 23,
        key: "twentythree",
        label: "PROJ DEV",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
        designations: ["development"],
    },
    {
        id: 17,
        key: "seventeen",
        label: "ENGINEERS",
        icon: GoProjectRoadmap,
        roles: ["admin"],
        designations: ["commissioning"],
    },
    {
        id: 18,
        key: "eighteen",
        label: "ASSMT",
        icon: MdAssignmentAdd,
        roles: ["reception", "admin"],
        designations: ["coordinator"],
    },
    {
        id: 20,
        key: "twenty",
        label: "ASSMT LIST",
        icon: GoProjectRoadmap,
        roles: ["reception", "admin"],
        designations: ["coordinator"],
    },
    {
        id: 9,
        key: "nine",
        label: "WORKS",
        icon: RiProgress2Line,
        roles: ["reception", "admin"],
        designations: ["commissioning"],
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
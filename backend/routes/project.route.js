import express from "express";
import {
  LatestProjectPagination,
  Pagination,
  PaginationCatogary,
  PaginationDevStatus,
  Paginationsotype,
  Recordsformave,
  UrgentProjectPegination,
  UrgentProjectAction,
  deleteRecord,
  findrecord,
  findrecordbyId,
  findrecordbyJobnumber,
  getProjectOverview,
  updateRecords,
  allProjectsFetch,
  getEngineerProjectsPaginated,
  getEngineerOverview,
  allProjectsFetchDev,
  RecordsformaveNew,
  getAllProjectsnew,
  updateRecordsDocs,
  ProjectsFetchDevById,
  getEngineerProjects,
  getAdminProjectProgressByPlanning,
  getAllProjectsnewbyId,
} from "../controller/project.controller.js";
import {
  authenticate,
  authenticateEngineer,
} from "../middlware/authaticate.js";
import { authorizeRole } from "../middlware/authRole.js";

export const ProjectRouter = express.Router();

// ProjectRouter.post(
//   "/save",
//   refreshTokenMiddleware,
//   authenticate,
//   authorizeRole("admin", "reception"),
//   Recordsformave
// );

ProjectRouter.post(
  "/save",
  authenticate,
  authorizeRole("admin", "reception"),
  RecordsformaveNew
);

ProjectRouter.get(
  "/getProjectOverview",
  authenticate,
  // authorizeRole("admin", "reception"),
  getProjectOverview
);

ProjectRouter.get(
  "/getProjectforDocs",
  authenticate,
  authorizeRole("admin", "reception"),
  getAllProjectsnew
);
ProjectRouter.get(
  "/getProjectforDocsbyid/:id",
  authenticate,
  authorizeRole("admin", "reception"),
  getAllProjectsnewbyId
);

ProjectRouter.get(
  "/getEngineerOverview/:id",
  authenticateEngineer,
  // authorizeRole("admin", "reception"),
  getEngineerOverview
);

ProjectRouter.get("/fetch", authenticate, findrecord);

ProjectRouter.get(
  "/fetch/:id",
  authenticate,
  // authorizeRole("admin", "reception"),
  findrecordbyId
);
ProjectRouter.get(
  "/fetchbyjob",
  authenticate,
  authorizeRole("admin", "reception"),
  findrecordbyJobnumber
);
ProjectRouter.put(
  "/update/:id",
  authenticate,
  authorizeRole("admin", "reception"),
  updateRecords
);
ProjectRouter.put(
  "/updateDocs/:id",
  authenticate,
  // authorizeRole("admin", "reception"),
  updateRecordsDocs
);
ProjectRouter.delete(
  "/delete/:id",
  authenticate,
  authorizeRole("admin", "reception"),
  deleteRecord
);
ProjectRouter.get(
  "/pagination",
  authenticate,
  Pagination
);
ProjectRouter.get(
  "/Engineerpagination/:id",
  authenticateEngineer,
  getEngineerProjectsPaginated
);

ProjectRouter.get(
  "/EngineerProjectlist/:id",
  authenticateEngineer,
  getEngineerProjects
);

ProjectRouter.get(
  "/latestProjectpagination",
  authenticate,
  authorizeRole("admin", "reception"),
  LatestProjectPagination
);
ProjectRouter.get(
  "/catogray/pagination",
  authenticate,
  authorizeRole("admin", "reception"),
  PaginationCatogary
);
ProjectRouter.get(
  "/devlopment/pagination",
  authenticate,
  authorizeRole("admin", "reception"),
  PaginationDevStatus
);
ProjectRouter.get(
  "/sotype/pagination",
  authenticate,
  authorizeRole("admin", "reception"),
  Paginationsotype
);
ProjectRouter.get(
  "/urgentProject/pagination",
  authenticate,
  authorizeRole("admin", "reception"),
  UrgentProjectPegination
);

ProjectRouter.get(
  "/urgentProjectAction",
  authenticate,
  authorizeRole("admin", "reception"),
  UrgentProjectAction
);

ProjectRouter.get(
  "/allProjectsfetch",
  authenticate,
  authorizeRole("admin", "reception"),
  allProjectsFetch
);

ProjectRouter.get(
  "/allProjectsfetchdev",
  authenticate,
  authorizeRole("admin", "reception"),
  allProjectsFetchDev
);

ProjectRouter.get(
  "/ProjectsfetchdevbyId/:id",
  authenticate,
  authorizeRole("admin", "reception"),
  ProjectsFetchDevById
);

ProjectRouter.get(
  "/getAdminProjectProgressByPlanning/:planningId",
  authenticate,
  authorizeRole("admin", "reception"),
  getAdminProjectProgressByPlanning
);


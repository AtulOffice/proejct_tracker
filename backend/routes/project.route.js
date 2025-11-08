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
} from "../controller/project.controller.js";
import {
  authenticate,
  authenticateEngineer,
} from "../middlware/authaticate.js";
import {
  refreshTokenEngineerMiddleware,
  refreshTokenMiddleware,
} from "../middlware/refreshToken.js";
import { authorizeRole } from "../middlware/authRole.js";

export const ProjectRouter = express.Router();

ProjectRouter.post(
  "/save",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  Recordsformave
);
ProjectRouter.get(
  "/getProjectOverview",
  refreshTokenMiddleware,
  // authenticate,
  // authorizeRole("admin", "reception"),
  getProjectOverview
);

ProjectRouter.get(
  "/getEngineerOverview/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  // authorizeRole("admin", "reception"),
  getEngineerOverview
);

ProjectRouter.get("/fetch", refreshTokenMiddleware, authenticate, findrecord);

ProjectRouter.get(
  "/fetch/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  findrecordbyId
);
ProjectRouter.get(
  "/fetchbyjob",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  findrecordbyJobnumber
);
ProjectRouter.put(
  "/update/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  updateRecords
);
ProjectRouter.delete(
  "/delete/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  deleteRecord
);
ProjectRouter.get(
  "/pagination",
  refreshTokenMiddleware,
  authenticate,
  Pagination
);
ProjectRouter.get(
  "/Engineerpagination/:id",
  refreshTokenMiddleware,
  authenticate,
  getEngineerProjectsPaginated
);
ProjectRouter.get(
  "/latestProjectpagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  LatestProjectPagination
);
ProjectRouter.get(
  "/catogray/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  PaginationCatogary
);
ProjectRouter.get(
  "/devlopment/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  PaginationDevStatus
);
ProjectRouter.get(
  "/sotype/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  Paginationsotype
);
ProjectRouter.get(
  "/urgentProject/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  UrgentProjectPegination
);

ProjectRouter.get(
  "/urgentProjectAction",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  UrgentProjectAction
);

ProjectRouter.get(
  "/allProjectsfetch",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  allProjectsFetch
);

ProjectRouter.get(
  "/allProjectsfetchdev",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  allProjectsFetchDev
);

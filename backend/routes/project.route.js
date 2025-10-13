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
} from "../controller/project.controller.js";
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";
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
  authenticate,
  authorizeRole("admin", "reception"),
  getProjectOverview
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
  "/latestProjectpagination",
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

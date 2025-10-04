import express from "express";
import {
  LatestProjectPagination,
  Pagination,
  PaginationCatogary,
  PaginationDevStatus,
  Paginationsotype,
  Recordsformave,
  UrgentProjectPegination,
  deleteRecord,
  findrecord,
  findrecordbyId,
  findrecordbyJobnumber,
  getProjectOverview,
  updateRecords,
} from "../controller/record.controller.js";
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";
import { authorizeRole } from "../middlware/authRole.js";

export const RecordRouter = express.Router();

RecordRouter.post(
  "/save",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  Recordsformave
);
RecordRouter.get(
  "/getProjectOverview",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  getProjectOverview
);
RecordRouter.get("/fetch", refreshTokenMiddleware, authenticate, findrecord);
RecordRouter.get(
  "/fetch/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  findrecordbyId
);
RecordRouter.get(
  "/fetchbyjob",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  findrecordbyJobnumber
);
RecordRouter.put(
  "/update/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  updateRecords
);
RecordRouter.delete(
  "/delete/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  deleteRecord
);
RecordRouter.get(
  "/pagination",
  refreshTokenMiddleware,
  authenticate,
  Pagination
);
RecordRouter.get(
  "/latestProjectpagination",
  authenticate,
  authorizeRole("admin"),
  LatestProjectPagination
);
RecordRouter.get(
  "/catogray/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  PaginationCatogary
);
RecordRouter.get(
  "/devlopment/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  PaginationDevStatus
);
RecordRouter.get(
  "/sotype/pagination",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  Paginationsotype
);
RecordRouter.get(
  "/urgentProject/pagination",
  authenticate,
  authorizeRole("admin"),
  UrgentProjectPegination
);

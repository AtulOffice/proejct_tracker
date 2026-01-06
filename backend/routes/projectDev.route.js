import express from "express";
import {
  allProjectStatusfetch,
  isProjectstatusExistFun,
  PaginationStatus,
  projectDevStatusDelete,
  projectDevStatusUpdate,
  ProjectStatusSave,
  PaginationStatusprog,
  ProjectStatusfetchbyJobId,
} from "../controller/projectDev.controller.js";
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";

export const ProjectDevRouter = express.Router();

ProjectDevRouter.post("/save", ProjectStatusSave);
ProjectDevRouter.get(
  "/fetchbyjobnumber/:jobNumber",
  refreshTokenMiddleware,
  authenticate,
  ProjectStatusfetchbyJobId
);
ProjectDevRouter.get(
  "/existancecheck/:jobNumber",
  refreshTokenMiddleware,
  authenticate,
  isProjectstatusExistFun
);
ProjectDevRouter.get(
  "/fetch",
  // refreshTokenMiddleware,
  // authenticate,
  allProjectStatusfetch
);
ProjectDevRouter.get(
  "/paginationdev",
  refreshTokenMiddleware,
  authenticate,
  PaginationStatus
);
ProjectDevRouter.get(
  "/paginationdevprog",
  refreshTokenMiddleware,
  authenticate,
  PaginationStatusprog
);
ProjectDevRouter.put(
  "/update/:jobNumber",
  refreshTokenMiddleware,
  authenticate,
  projectDevStatusUpdate
);

ProjectDevRouter.delete(
  "/delete/:id",
  refreshTokenMiddleware,
  authenticate,
  projectDevStatusDelete
);

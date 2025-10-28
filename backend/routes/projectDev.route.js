import express from "express";
import {
  allProjectStatusfetch,
  isProjectExistFun,
  isProjectstatusExistFun,
  PaginationStatus,
  projectDevStatusDelete,
  projectDevStatusUpdate,
  projectDevStatusUpdatebyId,
  ProjectStatusfetchbyId,
  ProjectStatusfetchbyJobnumber,
  ProjectStatusSave,
  PaginationStatusprog,
} from "../controller/projectDev.controler.js";
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";

export const ProjectDevRouter = express.Router();

ProjectDevRouter.post("/save", ProjectStatusSave);
ProjectDevRouter.get(
  "/fetchbyjobnumber/:JobNumber",
  refreshTokenMiddleware,
  authenticate,
  ProjectStatusfetchbyJobnumber
);
ProjectDevRouter.get(
  "/existancecheck/:JobNumber",
  refreshTokenMiddleware,
  authenticate,
  isProjectstatusExistFun
);
ProjectDevRouter.get(
  "/existancedevelop/:JobNumber",
  refreshTokenMiddleware,
  authenticate,
  isProjectExistFun
);
ProjectDevRouter.get(
  "/fetch",
  refreshTokenMiddleware,
  authenticate,
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
  "/update/:JobNumber",
  refreshTokenMiddleware,
  authenticate,
  projectDevStatusUpdate
);
ProjectDevRouter.put(
  "/updatebyid/:id",
  refreshTokenMiddleware,
  authenticate,
  projectDevStatusUpdatebyId
);
ProjectDevRouter.get(
  "/fetchbyid/:JobNumber",
  refreshTokenMiddleware,
  authenticate,
  ProjectStatusfetchbyId
);
ProjectDevRouter.delete(
  "/delete/:id",
  refreshTokenMiddleware,
  authenticate,
  projectDevStatusDelete
);

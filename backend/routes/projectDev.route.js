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

export const ProjectDevRouter = express.Router();

ProjectDevRouter.post("/save", ProjectStatusSave);
ProjectDevRouter.get(
  "/fetchbyjobnumber/:jobNumber",
  ProjectStatusfetchbyJobId
);
ProjectDevRouter.get(
  "/existancecheck/:jobNumber",
  isProjectstatusExistFun
);
ProjectDevRouter.get(
  "/fetch",
  allProjectStatusfetch
);
ProjectDevRouter.get(
  "/paginationdev",
  PaginationStatus
);
ProjectDevRouter.get(
  "/paginationdevprog",
  PaginationStatusprog
);
ProjectDevRouter.put(
  "/update/:jobNumber",
  authenticate,
  projectDevStatusUpdate
);

ProjectDevRouter.delete(
  "/delete/:id",
  authenticate,
  projectDevStatusDelete
);

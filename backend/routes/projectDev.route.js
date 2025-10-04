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

export const ProjectDevRouter = express.Router();

ProjectDevRouter.post("/save", ProjectStatusSave);
ProjectDevRouter.get(
  "/fetchbyjobnumber/:JobNumber",
  authenticate,
  ProjectStatusfetchbyJobnumber
);
ProjectDevRouter.get(
  "/existancecheck/:JobNumber",
  authenticate,
  isProjectstatusExistFun
);
ProjectDevRouter.get(
  "/existancedevelop/:JobNumber",
  authenticate,
  isProjectExistFun
);
ProjectDevRouter.get("/fetch", authenticate, allProjectStatusfetch);
ProjectDevRouter.get("/paginationdev", authenticate, PaginationStatus);
ProjectDevRouter.get("/paginationdevprog", authenticate, PaginationStatusprog);
ProjectDevRouter.put(
  "/update/:JobNumber",
  authenticate,
  projectDevStatusUpdate
);
ProjectDevRouter.put(
  "/updatebyid/:id",
  authenticate,
  projectDevStatusUpdatebyId
);
ProjectDevRouter.get("/fetch/:id", authenticate, ProjectStatusfetchbyId);
ProjectDevRouter.delete("/delete/:id", authenticate, projectDevStatusDelete);

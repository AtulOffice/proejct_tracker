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

export const ProjectDevRouter = express.Router();

ProjectDevRouter.post("/save", ProjectStatusSave);
ProjectDevRouter.get(
  "/fetchbyjobnumber/:JobNumber",
  ProjectStatusfetchbyJobnumber
);
ProjectDevRouter.get("/existancecheck/:JobNumber", isProjectstatusExistFun);
ProjectDevRouter.get("/existancedevelop/:JobNumber", isProjectExistFun);
ProjectDevRouter.get("/fetch", allProjectStatusfetch);
ProjectDevRouter.get("/paginationdev", PaginationStatus);
ProjectDevRouter.get("/paginationdevprog", PaginationStatusprog);
ProjectDevRouter.put("/update/:JobNumber", projectDevStatusUpdate);
ProjectDevRouter.put("/updatebyid/:id", projectDevStatusUpdatebyId);
ProjectDevRouter.get("/fetch/:id", ProjectStatusfetchbyId);
ProjectDevRouter.delete("/delete/:id", projectDevStatusDelete);

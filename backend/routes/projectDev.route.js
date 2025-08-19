import express from "express";
import {
  allProjectStatusfetch,
  PaginationStatus,
  projectDevStatusDelete,
  projectDevStatusUpdate,
  projectDevStatusUpdatebyId,
  ProjectStatusfetchbyId,
  ProjectStatusfetchbyJobnumber,
  ProjectStatusSave,
} from "../controller/projectDev.controler.js";

export const ProjectDevRouter = express.Router();

ProjectDevRouter.post("/save", ProjectStatusSave);
ProjectDevRouter.get("/fetchbyid/:JobNumber", ProjectStatusfetchbyJobnumber);
ProjectDevRouter.get("/fetch", allProjectStatusfetch);
ProjectDevRouter.get("/paginationdev", PaginationStatus);
ProjectDevRouter.put("/update/:JobNumber", projectDevStatusUpdate);
ProjectDevRouter.put("/updatebyid/:id", projectDevStatusUpdatebyId);
ProjectDevRouter.get("/fetch/:id", ProjectStatusfetchbyId);
ProjectDevRouter.delete("/delete/:id", projectDevStatusDelete);

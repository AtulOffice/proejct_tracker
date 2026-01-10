import express from "express";
import {
  saveEndChecklist,
  getAllEndChecklists,
  getEndChecklistByProject,
  getEndChecklistById,
  updateEndChecklist,
  deleteEndChecklist,
} from "../controller/endCheckList.controller.js";
import { authenticateEngineer } from "../middlware/authaticate.js";

export const EndRouter = express.Router();

EndRouter.post("/save", authenticateEngineer, saveEndChecklist);
EndRouter.get("/fetch", getAllEndChecklists);
EndRouter.get("/project/:projectId", getEndChecklistByProject);
EndRouter.get("/:checklistId", getEndChecklistById);
EndRouter.put("/:checklistId", authenticateEngineer, updateEndChecklist);
EndRouter.delete("/:checklistId", authenticateEngineer, deleteEndChecklist);

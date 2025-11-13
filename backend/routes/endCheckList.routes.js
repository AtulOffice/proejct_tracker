import express from "express";
import {
  saveEndChecklist,
  getAllEndChecklists,
  getEndChecklistByProject,
  getEndChecklistById,
  updateEndChecklist,
  deleteEndChecklist,
} from "../controller/endCheckList.controller.js";

export const EndRouter = express.Router();

EndRouter.post("/save", saveEndChecklist);
EndRouter.get("/fetch", getAllEndChecklists);
EndRouter.get("/project/:projectId", getEndChecklistByProject);
EndRouter.get("/:checklistId", getEndChecklistById);
EndRouter.put("/:checklistId", updateEndChecklist);
EndRouter.delete("/:checklistId", deleteEndChecklist);

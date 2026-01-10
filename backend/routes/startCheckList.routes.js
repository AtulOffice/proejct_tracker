import express from "express";
import {
  getAllStartChecklists,
  getChecklistByProject,
  getStartChecklistById,
  updateStartChecklist,
  deleteStartChecklist,
  saveStartChecklist,
} from "../controller/startCheckList.controller.js";
import { authenticateEngineer } from "../middlware/authaticate.js";

export const StartRouter = express.Router();

StartRouter.post("/save", authenticateEngineer, saveStartChecklist);
StartRouter.get("/fetch", getAllStartChecklists);
StartRouter.get("/project/:projectId", getChecklistByProject);
StartRouter.get("/:checklistId", getStartChecklistById);
StartRouter.put("/:checklistId", authenticateEngineer, updateStartChecklist);
StartRouter.delete("/:checklistId", authenticateEngineer, deleteStartChecklist);

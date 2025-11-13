import express from "express";
import {
  getAllStartChecklists,
  getChecklistByProject,
  getStartChecklistById,
  updateStartChecklist,
  deleteStartChecklist,
  saveStartChecklist,
} from "../controller/startCheckList.controller.js";

export const StartRouter = express.Router();

StartRouter.post("/save", saveStartChecklist);
StartRouter.get("/fetch", getAllStartChecklists);
StartRouter.get("/project/:projectId", getChecklistByProject);
StartRouter.get("/:checklistId", getStartChecklistById);
StartRouter.put("/:checklistId", updateStartChecklist);
StartRouter.delete("/:checklistId", deleteStartChecklist);

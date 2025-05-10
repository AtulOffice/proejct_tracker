import express from "express";
import {
  deleteWorkStatus,
  getAllWorkStatus,
  getWorkStatusById,
  updateWorkStatus,
  WrkStatusSave,
} from "../controller/WrkSts.controller.js";

export const WorkstsRouter = express.Router();

WorkstsRouter.post("/save", WrkStatusSave);
WorkstsRouter.get("/all", getAllWorkStatus);
WorkstsRouter.get("/find/:id", getWorkStatusById);
WorkstsRouter.put("/updata/:id", updateWorkStatus);
WorkstsRouter.delete("/delete/:id", deleteWorkStatus);

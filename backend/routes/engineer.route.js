import express from "express";
import {
  deleteEngineerRecord,
  getAvailableEngineers,
  getAllEngineers,
  saveEngineerRecord,
  editEngineerRecord,
} from "../controller/engineer.controller.js";

export const EngineerRouter = express.Router();

EngineerRouter.post("/addEngineer", saveEngineerRecord);
EngineerRouter.put("/editEngineer/:id", editEngineerRecord);
EngineerRouter.get("/getAvailableEngineers", getAvailableEngineers);
EngineerRouter.get("/getAllEngineers", getAllEngineers);
EngineerRouter.delete("/deleteEngineer/:id", deleteEngineerRecord);

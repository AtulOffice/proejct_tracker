import express from "express";
import {
  deleteEngineerRecord,
  getAvailableEngineers,
  getAllEngineers,
  saveEngineerRecord,
  editEngineerRecord,
  getAssignedEngineers,
} from "../controller/engineer.controller.js";
import { authenticate } from "../middlware/authaticate.js";
import { authorizeRole } from "../middlware/authRole.js";

export const EngineerRouter = express.Router();

EngineerRouter.post(
  "/addEngineer",
  authenticate,
  authorizeRole("admin", "reception"),
  saveEngineerRecord
);
EngineerRouter.put(
  "/editEngineer/:id",
  authenticate,
  authorizeRole("admin", "reception"),
  editEngineerRecord
);
EngineerRouter.get(
  "/getAvailableEngineers",
  authenticate,
  authorizeRole("admin", "reception"),
  getAvailableEngineers
);
EngineerRouter.get(
  "/getAssignedEngineers",
  authenticate,
  authorizeRole("admin", "reception"),
  getAssignedEngineers
);
EngineerRouter.get("/getAllEngineers",
  authenticate,
  getAllEngineers);

EngineerRouter.delete(
  "/deleteEngineer/:id",
  authenticate,
  authorizeRole("admin"),
  deleteEngineerRecord
);

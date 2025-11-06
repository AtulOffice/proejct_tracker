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
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";

export const EngineerRouter = express.Router();

EngineerRouter.post(
  "/addEngineer",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  saveEngineerRecord
);
EngineerRouter.put(
  "/editEngineer/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  editEngineerRecord
);
EngineerRouter.get(
  "/getAvailableEngineers",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  getAvailableEngineers
);
EngineerRouter.get(
  "/getAssignedEngineers",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin", "reception"),
  getAssignedEngineers
);
EngineerRouter.get(
  "/getAllEngineers",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  getAllEngineers
);
EngineerRouter.delete(
  "/deleteEngineer/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  deleteEngineerRecord
);

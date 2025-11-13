import express from "express";
import {
  getAllProjectsEngineers,
  getAllProjectsEngineersshow,
  saveMomForEngineer,
} from "../controller/engineerside.controller.js";
import { authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware } from "../middlware/refreshToken.js";

export const EngineerRouterside = express.Router();

EngineerRouterside.get(
  "/fetchAllEngineersProject/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getAllProjectsEngineers
);

EngineerRouterside.get(
  "/fetchAllEngineersProjectshow/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getAllProjectsEngineersshow
);
EngineerRouterside.post(
  "/saveMomoRelatedProject/:engineerId",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  saveMomForEngineer
);

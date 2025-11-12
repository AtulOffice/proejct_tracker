import express from "express";
import {
  getAllProjectsEngineers,
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
EngineerRouterside.post(
  "/saveMomoRelatedProject/:engineerId",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  saveMomForEngineer
);

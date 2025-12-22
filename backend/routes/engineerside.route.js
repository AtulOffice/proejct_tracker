import express from "express";
import {
  getAllDocumentsDevelopmentData,
  getAllProjectsEngineers,
  getAllProjectsEngineersshow,
  getAllProjectsEngineerswork,
  getLogicDevelopmentData,
  getScadaDevelopmentData,
  getTestingDevelopmentData,
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
  "/fetchAllProject/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getAllProjectsEngineerswork
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

EngineerRouterside.get("/getAllDocs",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getAllDocumentsDevelopmentData)


EngineerRouterside.get("/getAllLogic",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getLogicDevelopmentData)



EngineerRouterside.get("/getAllScada",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getScadaDevelopmentData)


EngineerRouterside.get("/getAlltesting",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getTestingDevelopmentData)

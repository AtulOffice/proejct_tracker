import express from "express";
import {
  getAllDocumentsDevelopmentData,
  getAllProjectsEngineers,
  getAllProjectsEngineersshow,
  getAllProjectsEngineerswork,
  getLogicDevelopmentData,
  getLogicPhaseById,
  getScadaDevelopmentData,
  getScadaPhaseById,
  getTestingDevelopmentData,
  getTestingPhaseById,
  saveMomForEngineer,
} from "../controller/engineerside.controller.js";
import { authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware } from "../middlware/refreshToken.js";
import { createProgressReport, deleteProgressReport, getProgressById, getProgressByProject, getProgressBySection, updateProgressReport } from "../controller/engineerSideProgress.controller.js";

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

EngineerRouterside.get("/getlogicphase/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getLogicPhaseById)

EngineerRouterside.get("/getscadaphase/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getScadaPhaseById)


EngineerRouterside.get("/gettestingphase/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getTestingPhaseById)

// progress report routes

EngineerRouterside.post("/progresssSave",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  createProgressReport);

EngineerRouterside.get("/section/:sectionId",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getProgressBySection);

EngineerRouterside.get("/projectforSectionReport/:projectId",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getProgressByProject);

EngineerRouterside.get("/progress/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getProgressById);

EngineerRouterside.put("/updateProgress/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  updateProgressReport);

EngineerRouterside.delete("/deleteProgress/:id",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  deleteProgressReport);

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
import { createProgressReport, deleteProgressReport, getEngineerProgressByType, getEngineerProgressByTypeandProject, getProgressById, getProgressByProject, getProgressBySection, updateProgressReport } from "../controller/engineerSideProgress.controller.js";

export const EngineerRouterside = express.Router();

EngineerRouterside.get(
  "/fetchAllEngineersProject/:id",
  authenticateEngineer,
  getAllProjectsEngineers
);

EngineerRouterside.get(
  "/fetchAllProject/:id",
  authenticateEngineer,
  getAllProjectsEngineerswork
);

EngineerRouterside.get(
  "/fetchAllEngineersProjectshow/:id",
  authenticateEngineer,
  getAllProjectsEngineersshow
);
EngineerRouterside.post(
  "/saveMomoRelatedProject/:engineerId",
  authenticateEngineer,
  saveMomForEngineer
);

EngineerRouterside.get("/getAllDocs",
  authenticateEngineer,
  getAllDocumentsDevelopmentData)


EngineerRouterside.get("/getAllLogic",
  authenticateEngineer,
  getLogicDevelopmentData)


EngineerRouterside.get("/getAllScada",
  authenticateEngineer,
  getScadaDevelopmentData)


EngineerRouterside.get("/getAlltesting",
  authenticateEngineer,
  getTestingDevelopmentData)

EngineerRouterside.get("/getlogicphase/:id",
  authenticateEngineer,
  getLogicPhaseById)

EngineerRouterside.get("/getscadaphase/:id",
  authenticateEngineer,
  getScadaPhaseById)


EngineerRouterside.get("/gettestingphase/:id",
  authenticateEngineer,
  getTestingPhaseById)

// progress report routes

EngineerRouterside.post("/progresssSave",
  authenticateEngineer,
  createProgressReport);

EngineerRouterside.get("/section/:sectionId",
  authenticateEngineer,
  getProgressBySection);

EngineerRouterside.get("/projectforSectionReport/:projectId",
  authenticateEngineer,
  getProgressByProject);

EngineerRouterside.get("/progress/:id",
  authenticateEngineer,
  getProgressById);

EngineerRouterside.put("/updateProgress/:id",
  authenticateEngineer,
  updateProgressReport);

EngineerRouterside.delete("/deleteProgress/:id",
  authenticateEngineer,
  deleteProgressReport);


// showing section wise progress Report

EngineerRouterside.get("/getProgreforshow/:sectiontype",
  authenticateEngineer,
  getEngineerProgressByType);

EngineerRouterside.get("/getProgreforshowbyproject/:projectId",
  authenticateEngineer,
  getEngineerProgressByTypeandProject);
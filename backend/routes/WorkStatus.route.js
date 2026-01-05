import express from "express";
import {
  deleteWorkStatus,
  getAllWorkStatus,
  getDistinctProjectsByEngineerWithLastStatus,
  getDistinctProjectsWithLastSubmission,
  getLatestWorkStatusByProjectId,
  getLatestWorkStatusForAllProjects,
  getWorkStatusById,
  updateWorkStatus,
  workStatusPaginationByEngineer,
  workStatusPegination,
  WrkStatusSave,
} from "../controller/WrkSts.controller.js";
import { authenticate, authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware, refreshTokenMiddleware } from "../middlware/refreshToken.js";

export const WorkstsRouter = express.Router();

WorkstsRouter.post("/save", WrkStatusSave);
WorkstsRouter.get(
  "/all",
  refreshTokenMiddleware,
  authenticate,
  getAllWorkStatus
);
WorkstsRouter.get(
  "/find/:id",
  refreshTokenMiddleware,
  authenticate,
  getWorkStatusById
);
WorkstsRouter.put(
  "/update/:id",
  refreshTokenMiddleware,
  authenticate,
  updateWorkStatus
);
WorkstsRouter.delete(
  "/delete/:id",
  refreshTokenMiddleware,
  authenticate,
  deleteWorkStatus
);
WorkstsRouter.get(
  "/pagination",
  refreshTokenMiddleware,
  authenticate,
  workStatusPegination
);

WorkstsRouter.get(
  "/paginationeng/:engineerId",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  workStatusPaginationByEngineer
);

WorkstsRouter.get(
  "/getLatestworkSubmissionbyProjectId/:projectId",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getLatestWorkStatusByProjectId
);

WorkstsRouter.get(
  "/getLatestworkSubmission",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getLatestWorkStatusForAllProjects
);

WorkstsRouter.get(
  "/fetchAllworkStatusforengineer",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  getDistinctProjectsByEngineerWithLastStatus
);



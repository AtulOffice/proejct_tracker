import express from "express";
import {
  deleteWorkStatus,
  getAllWorkStatus,
  getAllWorkStatusByProjectAndEngineer,
  getAllWorkStatusByProjectGroupedByEngineer,
  getDistinctProjectsByEngineerWithLastStatus,
  getDistinctProjectsWithLastStatus,
  getLatestWorkStatusForAllProjects,
  getWorkStatusById,
  updateWorkStatus,
  workStatusPaginationByEngineer,
  workStatusPegination,
  WrkStatusSave,
} from "../controller/WrkSts.controller.js";
import { authenticate, authenticateEngineer } from "../middlware/authaticate.js";

export const WorkstsRouter = express.Router();

WorkstsRouter.post("/save", authenticateEngineer, WrkStatusSave);
WorkstsRouter.get(
  "/all",
  getAllWorkStatus
);
WorkstsRouter.get(
  "/find/:id",
  getWorkStatusById
);
WorkstsRouter.put(
  "/update/:id",
  authenticate,
  updateWorkStatus
);
WorkstsRouter.delete(
  "/delete/:id",
  authenticate,
  deleteWorkStatus
);
WorkstsRouter.get(
  "/pagination",
  authenticateEngineer,
  workStatusPegination
);

WorkstsRouter.get(
  "/paginationeng/:engineerId",
  authenticateEngineer,
  workStatusPaginationByEngineer
);

// this make for inidividual api call
// WorkstsRouter.get(
//   "/getLatestworkSubmissionbyProjectId/:projectId",
//   authenticateEngineer,
//   getLatestWorkStatusByProjectId
// );

// this make same for reduce api call
WorkstsRouter.get(
  "/getLatestworkSubmission",
  authenticateEngineer,
  getLatestWorkStatusForAllProjects
);

WorkstsRouter.get(
  "/fetchAllworkStatusforengineer",
  authenticateEngineer,
  getDistinctProjectsByEngineerWithLastStatus
);

WorkstsRouter.get(
  "/fetchAllworkStatusbyProjectforengineer/:projectId",
  authenticateEngineer,
  getAllWorkStatusByProjectAndEngineer
);

WorkstsRouter.get(
  "/fetchAllworkStatusbyProjectforAdmin/:projectId",
  authenticateEngineer,
  getAllWorkStatusByProjectGroupedByEngineer
);

WorkstsRouter.get(
  "/fetchAllworkStatus",
  authenticateEngineer,
  getDistinctProjectsWithLastStatus
);



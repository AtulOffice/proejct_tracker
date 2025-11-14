import express from "express";
import {
  deleteWorkStatus,
  getAllWorkStatus,
  getWorkStatusById,
  updateWorkStatus,
  workStatusPaginationByEngineer,
  workStatusPegination,
  WrkStatusSave,
} from "../controller/WrkSts.controller.js";
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";

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
  refreshTokenMiddleware,
  authenticate,
  workStatusPaginationByEngineer
);

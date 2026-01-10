import express from "express";
import {
  getAllAssements,
  getAssementbyId,
  getWeeklyAssignmentByDate,
  saveWeeklyAssignment,
} from "../controller/devRecord.controller.js";
import { authenticate } from "../middlware/authaticate.js";

export const DevRecordRouter = express.Router();

DevRecordRouter.post("/save", authenticate, saveWeeklyAssignment);
DevRecordRouter.get("/fetch", getWeeklyAssignmentByDate);
DevRecordRouter.get("/fetchall", getAllAssements);
DevRecordRouter.get("/fetchbyid/:id", getAssementbyId);

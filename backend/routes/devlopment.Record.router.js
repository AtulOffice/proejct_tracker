import express from "express";
import { getWeeklyAssignmentByDate, saveWeeklyAssignment } from "../controller/devRecord.controller.js";

export const DevRecordRouter = express.Router();

DevRecordRouter.post("/save", saveWeeklyAssignment);
DevRecordRouter.get("/fetch", getWeeklyAssignmentByDate);

import express from "express";
import {
  PlanningSave,
  getPlanningbyId,
} from "../controller/dev.Planning.controller.js";

export const PlannigRouter = express.Router();

PlannigRouter.post("/save", PlanningSave);
PlannigRouter.get("/fetchbyid/:id", getPlanningbyId);

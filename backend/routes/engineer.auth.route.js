import express from "express";
import { authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware } from "../middlware/refreshToken.js";
import {
  loginEngineer,
  findEngineerDetails,
  logoutEngineer,
  forgotEngineer,
  resetEngineer,
} from "../controller/engineerAuth.controller.js";

export const engineerAuthRouter = express.Router();

engineerAuthRouter.post("/loginengineer", loginEngineer);
engineerAuthRouter.get(
  "/fetchengineerDeatails",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  findEngineerDetails
);

engineerAuthRouter.post("/forgetuser", forgotEngineer);
engineerAuthRouter.post("/resetuser", resetEngineer);

engineerAuthRouter.get(
  "/logout",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  logoutEngineer
);

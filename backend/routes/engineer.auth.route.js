import express from "express";
import { authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware } from "../middlware/refreshToken.js";
import {
  loginEngineer,
  findEngineerDetails,
  logoutEngineer,
  forgotEngineer,
  resetEngineer,
  findEngineerDetailstemp,
} from "../controller/engineerAuth.controller.js";

export const engineerAuthRouter = express.Router();

engineerAuthRouter.post("/loginengineer", loginEngineer);
engineerAuthRouter.get(
  "/fetchengineerDeatails",
  authenticateEngineer,
  findEngineerDetails
);
engineerAuthRouter.get(
  "/fetchengineerDeatailstemp",
  findEngineerDetailstemp
);
engineerAuthRouter.post("/refresh-token", refreshTokenEngineerMiddleware);

engineerAuthRouter.post("/forgetuser", forgotEngineer);
engineerAuthRouter.post("/resetuser", resetEngineer);

engineerAuthRouter.get(
  "/logout",
  authenticateEngineer,
  logoutEngineer
);

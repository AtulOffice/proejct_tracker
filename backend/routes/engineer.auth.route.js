import express from "express";
import { authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware } from "../middlware/refreshToken.js";
import {
  loginEngineer,
  findEngineerDetails,
  logoutEngineer,
} from "../controller/engineerAuth.controller.js";

export const engineerAuthRouter = express.Router();

engineerAuthRouter.post("/loginengineer", loginEngineer);
engineerAuthRouter.get(
  "/fetchengineerDeatails",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  findEngineerDetails
);

// userRouter.post("/forgetuser", forgotUser);
// userRouter.post("/resetuser", resetUser);
engineerAuthRouter.get(
  "/logout",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  logoutEngineer
);

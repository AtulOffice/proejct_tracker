import express from "express";
import {
  loginUser,
  CreateUser,
  finduser,
  findUserDetails,
  forgotUser,
  resetUser,
  logoutUser,
} from "../controller/user.controller.js";
import { authenticateEngineer } from "../middlware/authaticate.js";
import { refreshTokenEngineerMiddleware } from "../middlware/refreshToken.js";
import {
  loginEngineer,
  findEngineerDetails,
} from "../controller/engineerAuth.controller.js";

export const engineerAuthRouter = express.Router();

engineerAuthRouter.post("/loginengineer", loginEngineer);
engineerAuthRouter.get(
  "/fetchengineerDeatails",
  refreshTokenEngineerMiddleware,
  authenticateEngineer,
  findEngineerDetails
);

// userRouter.get(
//   "/finduser/:id",
//   refreshTokenMiddleware,
//   authenticate,
//   authorizeRole("admin"),
//   finduser
// );
// userRouter.get(
//   "/fetchUserDeatails",
//   refreshTokenMiddleware,
//   authenticate,
//   findUserDetails
// );
// userRouter.post("/forgetuser", forgotUser);
// userRouter.post("/resetuser", resetUser);
// userRouter.get("/logout", refreshTokenMiddleware, authenticate, logoutUser);

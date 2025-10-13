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
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";
import { authorizeRole } from "../middlware/authRole.js";

export const userRouter = express.Router();

userRouter.post("/createuser", CreateUser);
userRouter.post("/loginuser", loginUser);
userRouter.get(
  "/finduser/:id",
  refreshTokenMiddleware,
  authenticate,
  authorizeRole("admin"),
  finduser
);
userRouter.get(
  "/fetchUserDeatails",
  refreshTokenMiddleware,
  authenticate,
  findUserDetails
);
userRouter.post("/forgetuser", forgotUser);
userRouter.post("/resetuser", resetUser);
userRouter.get("/logout", refreshTokenMiddleware, authenticate, logoutUser);

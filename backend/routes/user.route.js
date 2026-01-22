import express from "express";
import {
  loginUser,
  CreateUser,
  finduser,
  findUserDetails,
  forgotUser,
  resetUser,
  logoutUser,
  verifyEmail,
  switchDesignation,
} from "../controller/user.controller.js";
import { authenticate } from "../middlware/authaticate.js";
import { refreshTokenMiddleware } from "../middlware/refreshToken.js";
import { authorizeRole } from "../middlware/authRole.js";


export const userRouter = express.Router();


userRouter.post("/createuser", CreateUser);
userRouter.post("/loginuser", loginUser);
userRouter.post("/refresh-token", refreshTokenMiddleware);
userRouter.post("/switch-designation", authenticate, switchDesignation);

userRouter.get(
  "/finduser/:id",
  authenticate,
  finduser
);
userRouter.get(
  "/fetchUserDeatails",
  authenticate,
  findUserDetails
);

userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/forgetuser", forgotUser);
userRouter.post("/resetuser", resetUser);
userRouter.get("/logout", logoutUser);

import express from "express";
import {
  loginUser,
  CreateUser,
  finduser,
  findUserDetails,
  forgotUser,
  resetUser,
} from "../controller/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/createuser", CreateUser);
userRouter.post("/loginuser", loginUser);
userRouter.get("/finduser/:id", finduser);
userRouter.get("/fetchUserDeatails", findUserDetails);
userRouter.post("/forgetuser", forgotUser);
userRouter.post("/resetuser", resetUser);

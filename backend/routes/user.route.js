import express from "express";
import {
  loginUser,
  CreateUser,
  finduser,
} from "../controller/user.controller.js";

export const userRouter = express.Router();

userRouter.post("/createuser", CreateUser);
userRouter.post("/loginuser", loginUser);
userRouter.get("/finduser/:id", finduser);

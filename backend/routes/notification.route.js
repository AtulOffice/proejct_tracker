import express from "express";
import {
    authenticate,
} from "../middlware/authaticate.js";
import { authorizeRole } from "../middlware/authRole.js";
import { getGlobalNotifications } from "../controller/noteficaiton.controller.js";

export const NoteficationRouter = express.Router();

NoteficationRouter.get(
    "/getAll",
    authenticate,
    authorizeRole("admin"),
    getGlobalNotifications
);

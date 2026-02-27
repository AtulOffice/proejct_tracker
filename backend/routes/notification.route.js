import express from "express";
import {
    authenticate,
} from "../middlware/authaticate.js";
import { authorizeRole } from "../middlware/authRole.js";
import { getGlobalNotifications, markAllAsRead, markAsRead } from "../controller/noteficaiton.controller.js";

export const NoteficationRouter = express.Router();

NoteficationRouter.get(
    "/getAll",
    authenticate,
    authorizeRole("admin"),
    getGlobalNotifications
);
NoteficationRouter.patch("/read/:id", authenticate, markAsRead);
NoteficationRouter.patch("/read-all", authenticate, markAllAsRead);

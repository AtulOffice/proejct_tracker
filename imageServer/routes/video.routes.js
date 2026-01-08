import express from "express";
import {
  uploadVideo,
  serveVideo,
  deleteVideo,
} from "../controller/video.controller.js";

export const videoRoutes = express.Router();

videoRoutes.post("/uploadVideo", uploadVideo);
videoRoutes.get(/^\/videos\/(.+)$/, serveVideo);
videoRoutes.delete("/deleteVideo", deleteVideo);

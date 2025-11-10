import express from "express";
import { uploadVideo } from "../controller/video.controller.js";

const router = express.Router();

router.post("/upload-stream", uploadVideo);

export default router;

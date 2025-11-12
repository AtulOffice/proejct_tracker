import express from "express";
import multer from "multer";
import {
  uploadImage,
  serveImage,
  deleteImage,
} from "../controller/image.controller.js";

export const imageRoutes = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

imageRoutes.post(
  "/uploadimage",
  upload.fields([{ name: "image" }, { name: "file" }]),
  uploadImage
);
imageRoutes.get(/^\/image\/(.+)$/, serveImage);
imageRoutes.delete("/deleteImage", deleteImage);

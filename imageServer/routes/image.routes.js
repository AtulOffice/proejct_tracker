import express from "express";
import multer from "multer";
import { uploadImage, serveImage, deleteImage } from "../controller/image.controller.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.fields([{ name: "image" }, { name: "file" }]), uploadImage);
router.get(/^\/image\/(.+)$/, serveImage);
router.delete("/deleteImage", deleteImage);

export default router;

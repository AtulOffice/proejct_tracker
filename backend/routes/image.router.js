import express from "express"
import {uploadImagecontroller} from "../controller/imageUploader.controller.js"


export const ImageUploadRouter = express.Router();

ImageUploadRouter.post("/upload",uploadImagecontroller)
// ImageUploadRouter.delete("/delete",deleteImageToGlobalServer)
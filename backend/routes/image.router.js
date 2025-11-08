import express from "express"
import {uploadImageToGlobalServer,deleteImageToGlobalServer} from "../controller/imageUploader.js"


export const ImageUploadRouter = express.Router();

ImageUploadRouter.post("/upload",uploadImageToGlobalServer)
ImageUploadRouter.delete("/delete",deleteImageToGlobalServer)
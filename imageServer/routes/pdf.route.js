import express from "express";
import multer from "multer";
import {
  deleteDocument,
  serveDocument,
  uploadDocument,
} from "../controller/documents.controller.js";

export const DocumentRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

DocumentRouter.post(
  "/uploadDocument",
  upload.fields([{ name: "document" }, { name: "file" }]),
  uploadDocument
);
DocumentRouter.get(/^\/document\/(.+)$/, serveDocument);
DocumentRouter.delete("/deleteDocument", deleteDocument);

import fs from "fs";
import path from "path";
import sharp from "sharp";
import mime from "mime-types";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();
const uploadsDir = path.join(process.cwd(), "uploads");

export const uploadDocument = async (req, res) => {
  try {
    const file = req.files["document"]?.[0] || req.files["file"]?.[0];
    const baseSubfolder = req.body.subfolder || "documents";

    if (!file) return res.status(400).send("No document uploaded.");

    const detectedType = await fileTypeFromBuffer(file.buffer);
    const mimeType = detectedType?.mime || file.mimetype;
    const ext = detectedType?.ext || path.extname(file.originalname).slice(1);

    const allowedDocs = ["pdf", "docx", "xlsx", "txt"];
    if (!allowedDocs.includes(ext.toLowerCase())) {
      return res.status(400).json({ message: "Invalid document type." });
    }

    const userDir = path.join(uploadsDir, baseSubfolder);
    fs.mkdirSync(userDir, { recursive: true });

    const uniqueName = uuidv4();
    const fileName = `${uniqueName}.${ext}`;
    const outputPath = path.join(userDir, fileName);

    fs.writeFileSync(outputPath, file.buffer);

    const url = `${process.env.IMG_URL}/document/${baseSubfolder}/${fileName}`;
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Document upload error:", err);
    res.status(500).send("Error uploading document.");
  }
};

export const serveDocument = async (req, res) => {
  try {
    const fullPath = req.params[0];
    const fileName = fullPath.split("/").pop();
    const subfolder = fullPath.split("/").slice(0, -1).join("/") || "documents";
    const filePath = path.join(uploadsDir, subfolder, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Document not found.");
    }

    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    res.set("Content-Type", mimeType);
    res.sendFile(filePath);
  } catch (err) {
    console.error("❌ Error serving document:", err);
    res.status(500).send("Error serving document.");
  }
};

export const deleteDocument = (req, res) => {
  try {
    const { url: docUrl } = req.query;
    const { pathname } = new URL(docUrl);
    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts.length < 3) {
      return res
        .status(400)
        .json({ message: "Invalid document URL structure." });
    }

    const subfolder = pathParts.slice(1, -1).join("/");
    const docName = pathParts[pathParts.length - 1];
    const docPath = path.join(uploadsDir, subfolder, docName);

    if (!fs.existsSync(docPath)) {
      return res
        .status(404)
        .json({ message: "Document not found in uploads." });
    }

    const deleteQueueDir = path.join(uploadsDir, "delete-queue");
    fs.mkdirSync(deleteQueueDir, { recursive: true });

    const taskFile = path.join(
      deleteQueueDir,
      `${Date.now()}__${subfolder.replace(/\//g, "__")}__${docName}.json`
    );
    fs.writeFileSync(taskFile, JSON.stringify({ path: docPath }));

    res.json({
      message: "Document delete scheduled. File will be removed later.",
    });
  } catch (err) {
    console.error("❌ Delete scheduling error:", err);
    res.status(500).json({ message: "Failed to schedule document delete." });
  }
};

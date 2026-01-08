import fs from "fs";
import path from "path";
import sharp from "sharp";
import mime from "mime-types";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const uploadsDir = path.join(process.cwd(), "uploads");

export const uploadImage = async (req, res) => {
  try {
    const file = req.files["image"]?.[0] || req.files["file"]?.[0];
    const baseSubfolder = req.body.subfolder || "images";

    if (!file) return res.status(400).send("No file uploaded.");

    const detectedType = await fileTypeFromBuffer(file.buffer);
    const mimeType = detectedType?.mime || file.mimetype;
    const ext = detectedType?.ext || path.extname(file.originalname).slice(1);

    const userDir = path.join(uploadsDir, baseSubfolder);
    fs.mkdirSync(userDir, { recursive: true });

    const uniqueName = uuidv4();
    let fileName, outputPath, url;

    if (mimeType.startsWith("image/")) {
      fileName = `${uniqueName}.webp`;
      outputPath = path.join(userDir, fileName);
      await sharp(file.buffer).webp({ quality: 75 }).toFile(outputPath);
    } else {
      fileName = `${uniqueName}.${ext}`;
      outputPath = path.join(userDir, fileName);
      fs.writeFileSync(outputPath, file.buffer);
    }

    url = `${process.env.IMG_URL}/image/${baseSubfolder}/${fileName}`;
    res.json({ success: true, url });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res.status(500).send("Error uploading file.");
  }
};

export const serveImage = async (req, res) => {
  try {
    const fullPath = req.params[0];
    const fileName = fullPath.split("/").pop();
    const subfolder = fullPath.split("/").slice(0, -1).join("/") || "images";
    let filePath = path.join(uploadsDir, subfolder, fileName);

    if (!fs.existsSync(filePath)) {
      filePath = path.join(uploadsDir, "banner.webp");
    }

    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    const isImage = mimeType.startsWith("image/");
    let buffer;

    if (isImage && req.query.w) {
      const width = parseInt(req.query.w);
      const quality = parseInt(req.query.q) || 75;
      buffer = await sharp(filePath)
        .resize({ width })
        .webp({ quality })
        .toBuffer();
      res.set("Content-Type", "image/webp");
    } else {
      buffer = fs.readFileSync(filePath);
      res.set("Content-Type", mimeType);
    }

    res.send(buffer);
  } catch (err) {
    console.error("❌ Error serving image:", err);
    res.status(500).send("Error processing file.");
  }
};

export const deleteImage = (req, res) => {
  try {
    const { url: imageUrl } = req.query;
    const { pathname } = new URL(imageUrl);
    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts.length < 3) {
      return res.status(400).json({ message: "Invalid image URL structure." });
    }

    const subfolder = pathParts.slice(1, -1).join("/");
    const imageName = pathParts[pathParts.length - 1];
    const imagePath = path.join(uploadsDir, subfolder, imageName);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found in uploads." });
    }

    const deleteQueueDir = path.join(uploadsDir, "delete-queue");
    fs.mkdirSync(deleteQueueDir, { recursive: true });

    const taskFile = path.join(
      deleteQueueDir,
      `${Date.now()}__${subfolder.replace(/\//g, "__")}__${imageName}.json`
    );
    fs.writeFileSync(taskFile, JSON.stringify({ path: imagePath }));

    res.json({ message: "Delete scheduled. File will be removed later." });
  } catch (err) {
    console.error("❌ Delete scheduling error:", err);
    res.status(500).json({ message: "Failed to schedule delete." });
  }
};

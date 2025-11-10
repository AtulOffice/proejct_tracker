import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import dotenv from "dotenv";
import cron from "node-cron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import os from "os";
import { createClient } from "redis";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { formidable } from "formidable";
import mime from "mime-types";

import { fileTypeFromBuffer } from "file-type";
const ffmpegPath = ffmpegInstaller.path;
ffmpeg.setFfmpegPath(ffmpegPath);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

const allowedOrigins = [process.env.SERVER_URL, process.env.ADMIN_URL];

const apiCors = cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// const PORT = process.env.PORT || 9000;
const PORT =9000;

// const redisClient = createClient();

// redisClient.on('error', (err) => console.error('Redis Client Error', err));

// await redisClient.connect(); // Make sure to call this before using

// Configure directories
const uploadsDir = path.join(__dirname, "uploads");
const videoUploadDir = path.join(uploadsDir, "original-videos");
const videoDir = path.join(uploadsDir, "videos");
const tempDir = path.join(os.tmpdir(), "video_processing");
const deleteQueueDir = path.join(uploadsDir, "delete-queue");

// Ensure directories exist
const ensureDirectories = async () => {
  try {
    await fs.promises.mkdir(uploadsDir, { recursive: true });
    await fs.promises.mkdir(videoUploadDir, { recursive: true });
    await fs.promises.mkdir(videoDir, { recursive: true });
    await fs.promises.mkdir(tempDir, { recursive: true });
    await fs.promises.mkdir(deleteQueueDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create directories:", err);
    process.exit(1);
  }
};

ensureDirectories();

const copyAndDelete = async (src, dest) => {
  await fs.promises.copyFile(src, dest);
  await fs.promises.unlink(src);
};

const isValidVideo = (file) => {
  if (!file) return false;
  const validTypes = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
  ];
  const ext = path.extname(file.originalFilename).toLowerCase();
  return (
    validTypes.includes(file.mimetype) ||
    [".mp4", ".mov", ".avi", ".mkv"].includes(ext)
  );
};

app.post("/api/v1/upload-stream", apiCors, async (req, res) => {

  const form = formidable({
    uploadDir: videoUploadDir, // Save original videos here
    keepExtensions: true,
    maxFileSize: 500 * 1024 * 1024, // 500MB
    multiples: false,
    filter: ({ name, originalFilename, mimetype }) => {
      return name === "file" && isValidVideo({ originalFilename, mimetype });
    },
  });

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

  const file = files.file?.[0];
  if (!file) {
    throw new Error(
      "No valid video file uploaded. Supported formats: MP4, MOV, AVI, MKV"
    );
  }

  const inputPath = file.filepath;
  const originalFilename = file.originalFilename;
  const uniqueName = uuidv4();
  const fileExt = path.extname(originalFilename);

  const outputFilename = `${uniqueName}${fileExt}`;
  const outputPath = path.join(videoDir, outputFilename);
  const tempOutputPath = path.join(tempDir, outputFilename);

  if (!(await exists(inputPath))) {
    throw new Error("Uploaded file not found");
  }

  console.log(`Starting compression for ${originalFilename}`);

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-crf 20",
        "-preset veryfast",
        "-movflags +faststart",
        "-profile:v high",
        "-pix_fmt yuv420p",
        "-vf scale=960:-2",
        "-b:v 1000k",
        "-b:a 128k",
        "-ac 2",
      ])
      .on("start", (commandLine) => {
        // console.log('FFmpeg command:', commandLine);
      })
      .on("progress", (progress) => {
        // console.log(Processing: ${Math.round(progress.percent)}% done);
      })
      .on("end", () => {
        // Move from temp to final location
        copyAndDelete(tempOutputPath, outputPath)
          .then(() => {
            resolve();
          })
          .catch(reject);
      })
      .on("error", reject)
      .save(tempOutputPath);
  });

  // Move original file to delete queue for later cleanup
  const deleteQueuePath = path.join(deleteQueueDir, path.basename(inputPath));
  await fs.promises.rename(inputPath, deleteQueuePath);

  const stats = await fs.promises.stat(outputPath);
  const baseUrl = process.env.IMG_URL || "http://localhost:8000";
  res.json({
    success: true,
    url: `${baseUrl}/videos/${outputFilename}`,
    message: "Upload and compression successful",
    originalFile: originalFilename,
    compressedFile: outputFilename,
    size: stats.size,
    downloadUrl: `/videos/${outputFilename}`,
  });
});

app.use("/videos", express.static(videoDir));

const upload = multer({ storage: multer.memoryStorage() });

app.post(
  "/upload",
  apiCors,
  upload.fields([{ name: "image" }, { name: "file" }]),
  async (req, res) => {
    try {
      const file = req.files["image"]?.[0] || req.files["file"]?.[0];
      const baseSubfolder = req.body.subfolder || "images";

      if (!file) {
        return res.status(400).send("No file uploaded.");
      }

      // ✅ Detect actual file type from buffer
      const detectedType = await fileTypeFromBuffer(file.buffer);
      const mimeType = detectedType?.mime || file.mimetype;
      const ext = detectedType?.ext || path.extname(file.originalname).slice(1);

      // Ensure subfolder exists
      const userDir = path.join(uploadsDir, baseSubfolder);
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }

      // Generate unique name
      const uniqueName = uuidv4();
      let fileName, outputPath, url;

      if (mimeType.startsWith("image/")) {
        // ✅ Process only real images
        fileName = `${uniqueName}.webp`;
        outputPath = path.join(userDir, fileName);

        await sharp(file.buffer).webp({ quality: 75 }).toFile(outputPath);

        url = `${process.env.IMG_URL}/image/${baseSubfolder}/${fileName}`;
      } else {
        // ✅ For PDFs/docs/zips save with proper extension
        fileName = `${uniqueName}.${ext}`;
        outputPath = path.join(userDir, fileName);

        fs.writeFileSync(outputPath, file.buffer);

        url = `${process.env.IMG_URL}/image/${baseSubfolder}/${fileName}`;
      }

      return res.json(url);
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).send("Error uploading file.");
    }
  }
);

// Updated serve endpoint (same as provided in previous response)
app.get(/^\/image\/(.+)$/, async (req, res) => {
  try {
    const fullPath = req.params[0];
    const fileName = fullPath.split("/").pop();
    const subfolder = fullPath.split("/").slice(0, -1).join("/") || "images";

    let filePath = path.join(__dirname, "uploads", subfolder, fileName);

    if (!fs.existsSync(filePath)) {
      // Try fallback in uploads root
      filePath = path.join(__dirname, "uploads", fileName);

      if (!fs.existsSync(filePath)) {
        // Final fallback to banner
        filePath = path.join(__dirname, "uploads", "banner.webp");
      }
    }

    // Get file extension and determine MIME type
    const fileExtension = path.extname(fileName).toLowerCase();
    const mimeType = mime.lookup(filePath) || "application/octet-stream";
    const isImage = mimeType.startsWith("image/");

    // Parse query params (only apply to images)
    const width = parseInt(req.query.w);
    const quality = parseInt(req.query.q) || 75;
    const cacheKey = isImage
      ? `img:${subfolder}/${fileName}:w${width || "auto"}:q${quality}`
      : `file:${subfolder}/${fileName}`;

    // Check cache (commented out)
    // const cachedFile = await redisClient.get(cacheKey);
    // if (cachedFile) {
    //     res.set('Content-Type', mimeType);
    //     return res.send(Buffer.from(cachedFile, 'base64'));
    // }

    let buffer;

    // Process images with Sharp, serve other files as-is
    if (isImage && (width || quality !== 75)) {
      // Image processing with Sharp
      let image = sharp(filePath);

      // Apply image-specific transformations
      if (fileExtension === ".webp" || req.query.webp !== "false") {
        image = image.webp({ quality });
      } else if (fileExtension === ".jpg" || fileExtension === ".jpeg") {
        image = image.jpeg({ quality });
      } else if (fileExtension === ".png") {
        image = image.png({ quality: Math.round(quality * 0.1) }); // PNG quality is 0-10
      }

      if (width && !isNaN(width)) {
        image = image.resize({ width });
      }

      buffer = await image.toBuffer();

      // Set correct content type for processed images
      if (fileExtension === ".webp" || req.query.webp !== "false") {
        res.set("Content-Type", "image/webp");
      } else {
        res.set("Content-Type", mimeType);
      }
    } else {
      // Serve file as-is (non-images or images without processing)
      buffer = fs.readFileSync(filePath);
      res.set("Content-Type", mimeType);
    }

    // Cache the file (commented out)
    // await redisClient.set(cacheKey, buffer.toString('base64'), {
    //     EX: 3600 // 1 hour in seconds
    // });

    // Set additional headers for better browser support
    res.set({
      "Cache-Control": "public, max-age=3600",
      "Accept-Ranges": "bytes",
    });

    res.send(buffer);
  } catch (err) {
    console.error("Error processing file:", err);
    res.status(500).send("Error processing file.");
  }
});

app.delete("/deleteImage", apiCors, (req, res) => {
  const { url: imageUrl } = req.query;

  try {
    const { pathname } = new URL(imageUrl);
    const pathParts = pathname.split("/").filter(Boolean);

    // Expected pathParts: ['image', 'news', '2025-06-05', 'filename.webp']
    if (pathParts.length < 3) {
      return res.status(400).json({ message: "Invalid image URL structure." });
    }

    // Reconstruct the full subfolder path from index 1 to n-2
    subfolder = pathParts.slice(1, -1).join("/"); // 'news/2025-06-05'
    const imageName = pathParts[pathParts.length - 1]; // 'filename.webp'

    const imagePath = path.join(__dirname, "uploads", subfolder, imageName);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found in uploads." });
    }

    const deleteQueueDir = path.join(__dirname, "uploads", "delete-queue");
    if (!fs.existsSync(deleteQueueDir)) {
      fs.mkdirSync(deleteQueueDir, { recursive: true });
    }

    const taskFilePath = path.join(
      deleteQueueDir,
      `${Date.now()}__${subfolder.replace(/\//g, "__")}__${imageName}.json`
    );
    fs.writeFileSync(taskFilePath, JSON.stringify({ path: imagePath }));

    return res.json({
      message: "Delete scheduled. File will be removed later.",
    });
  } catch (error) {
    console.error("Error scheduling deletion:", error.message);
    return res
      .status(500)
      .json({ message: "Failed to schedule delete.", error: error.message });
  }
});

// const deleteQueueDir = path.
// join(__dirname, 'uploads', 'delete-queue');
// Unified deletion cron job (runs every minute)

cron.schedule("0 * * * *", async () => {
  try {
    const files = await fs.promises.readdir(deleteQueueDir);
    for (const file of files) {
      const fullPath = path.join(deleteQueueDir, file);

      if (file.endsWith(".json")) {
        // 🔄 Process .json deletion task
        try {
          const content = await fs.promises.readFile(fullPath, "utf-8");
          const { path: fileToDelete } = JSON.parse(content);

          try {
            await fs.promises.unlink(fileToDelete);
            // console.log(✅ Deleted: ${fileToDelete});
          } catch (deleteErr) {
            if (deleteErr.code === "EBUSY") {
              console.warn(`⏳ File busy, will retry: ${fileToDelete}`);
              continue;
            } else if (deleteErr.code === "ENOENT") {
              console.warn(`⚠ File not found, removing task: ${fileToDelete}`);
            } else {
              throw deleteErr;
            }
          }

          // 🧹 Remove the JSON task file itself
          await fs.promises.unlink(fullPath);
        } catch (parseErr) {
          console.error(`❌ Error processing task ${file}:, parseErr.message`);
          const corruptedPath = path.join(deleteQueueDir, "corrupted", file);
          await fs.promises.mkdir(path.dirname(corruptedPath), {
            recursive: true,
          });
          await fs.promises.rename(fullPath, corruptedPath);
        }
      } else {
        // 🔥 Directly delete any other file (video, image, temp, etc.)
        try {
          await fs.promises.unlink(fullPath);
          // console.log(🧹 Deleted file directly: ${file});
        } catch (err) {
          if (err.code === "ENOENT") {
            console.warn(`⚠ File not found: ${file}`);
          } else {
            console.error(`❌ Failed to delete ${file}:, err.message`);
          }
        }
      }
    }
  } catch (err) {
    console.error("🚨 Error in deletion cron job:", err);
  }
});

app.listen(PORT, () => {
  console.log(`Image Server is running on port ${PORT}`);
});

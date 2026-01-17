import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import cron from "node-cron";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { ensureDirectories, processDeleteQueue } from "./utils/fileUtils.js";
import { apiCors } from "./utils/corsConfig.js";
import { imageRoutes } from "./routes/image.routes.js";
import { videoRoutes } from "./routes/video.routes.js";
import { DocumentRouter } from "./routes/pdf.route.js";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 9000;
ensureDirectories(__dirname);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apiCors);

app.get("/hello", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "hello i am image server" });
});
app.use("/", imageRoutes);
app.use("/", videoRoutes);
app.use("/", DocumentRouter);

app.use("/videos", express.static(path.join(__dirname, "uploads/videos")));
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

cron.schedule("0 * * * *", async () => {
  await processDeleteQueue(__dirname);
});

app.listen(PORT, () => console.log(`✅ Image Server running on port ${PORT}`));

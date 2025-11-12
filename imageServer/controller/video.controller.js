import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { formidable } from "formidable";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const uploadsDir = path.join(process.cwd(), "uploads");
const videoDir = path.join(uploadsDir, "videos");
const videoUploadDir = path.join(uploadsDir, "original-videos");
const tempDir = path.join(uploadsDir, "temp");
const deleteQueueDir = path.join(uploadsDir, "delete-queue");

for (const dir of [
  uploadsDir,
  videoDir,
  videoUploadDir,
  tempDir,
  deleteQueueDir,
]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export const uploadVideo = async (req, res) => {
  try {
    const form = formidable({
      uploadDir: videoUploadDir,
      keepExtensions: true,
      maxFileSize: 500 * 1024 * 1024, // 500MB
      multiples: false,
      filter: ({ name, mimetype }) =>
        name === "video" && mimetype.startsWith("video/"),
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) =>
        err ? reject(err) : resolve([fields, files])
      );
    });

    const file = Array.isArray(files.video) ? files.video[0] : files.video;
    if (!file) throw new Error("No valid video uploaded.");

    const inputPath = file.filepath;
    const outputName = `${uuidv4()}${path.extname(file.originalFilename)}`;
    const outputPath = path.join(videoDir, outputName);
    const tempOutputPath = path.join(tempDir, outputName);

    if (!fs.existsSync(inputPath)) throw new Error("Uploaded file not found");

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
        .on("end", async () => {
          try {
            await fs.promises.copyFile(tempOutputPath, outputPath);
            await fs.promises.unlink(tempOutputPath);
            await fs.promises.rename(
              inputPath,
              path.join(deleteQueueDir, path.basename(inputPath))
            );
            resolve();
          } catch (e) {
            reject(e);
          }
        })
        .on("error", reject)
        .save(tempOutputPath);
    });

    res.json({
      success: true,
      url: `${process.env.IMG_URL}/videos/${outputName}`,
      message: "Upload & compression successful",
    });
  } catch (err) {
    console.error("❌ Video upload failed:", err);
    res.status(500).json({
      success: false,
      message: "Error uploading video",
      error: err.message,
    });
  }
};

export const serveVideo = async (req, res) => {
  try {
    const fullPath = req.params[0];
    const fileName = fullPath.split("/").pop();
    const filePath = path.join(videoDir, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("Video not found.");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        "Content-Length": fileSize,
        "Content-Type": "video/mp4",
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    console.error("❌ Error serving video:", err);
    res.status(500).send("Error serving video.");
  }
};

export const deleteVideo = (req, res) => {
  try {
    const { url: videoUrl } = req.query;
    const { pathname } = new URL(videoUrl);
    const pathParts = pathname.split("/").filter(Boolean);

    if (pathParts.length < 2) {
      return res.status(400).json({ message: "Invalid video URL structure." });
    }

    const videoName = pathParts[pathParts.length - 1];
    const videoPath = path.join(videoDir, videoName);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: "Video not found in uploads." });
    }

    const deleteTaskPath = path.join(
      deleteQueueDir,
      `${Date.now()}__${videoName}.json`
    );
    fs.writeFileSync(deleteTaskPath, JSON.stringify({ path: videoPath }));

    res.json({
      message: "Video delete scheduled. File will be removed later.",
    });
  } catch (err) {
    console.error("❌ Delete scheduling error:", err);
    res.status(500).json({ message: "Failed to schedule video delete." });
  }
};

import path from "path";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { formidable } from "formidable";
import { v4 as uuidv4 } from "uuid";
import { copyAndDelete, isValidVideo, exists } from "../utils/videoUtils.js";

const uploadsDir = path.join(process.cwd(), "uploads");
const videoDir = path.join(uploadsDir, "videos");
const videoUploadDir = path.join(uploadsDir, "original-videos");
const tempDir = path.join(uploadsDir, "temp");
const deleteQueueDir = path.join(uploadsDir, "delete-queue");

export const uploadVideo = async (req, res) => {
  try {
    const form = formidable({
      uploadDir: videoUploadDir,
      keepExtensions: true,
      maxFileSize: 500 * 1024 * 1024,
      multiples: false,
      filter: ({ name, originalFilename, mimetype }) =>
        name === "file" && isValidVideo({ originalFilename, mimetype }),
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => (err ? reject(err) : resolve([fields, files])));
    });

    const file = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!file) throw new Error("No valid video uploaded.");

    const inputPath = file.filepath;
    const outputName = `${uuidv4()}${path.extname(file.originalFilename)}`;
    const outputPath = path.join(videoDir, outputName);
    const tempOutputPath = path.join(tempDir, outputName);

    if (!(await exists(inputPath))) throw new Error("Uploaded file not found");

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
        .on("end", () => copyAndDelete(tempOutputPath, outputPath).then(resolve).catch(reject))
        .on("error", reject)
        .save(tempOutputPath);
    });

    const deleteQueuePath = path.join(deleteQueueDir, path.basename(inputPath));
    await fs.promises.rename(inputPath, deleteQueuePath);

    res.json({
      success: true,
      url: `${process.env.IMG_URL}/videos/${outputName}`,
      message: "Upload & compression successful",
    });
  } catch (err) {
    console.error("❌ Video upload failed:", err);
    res.status(500).json({ success: false, message: "Error uploading video", error: err.message });
  }
};

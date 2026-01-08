import fs from "fs";
import path from "path";
import os from "os";

export const ensureDirectories = async (baseDir) => {
  const uploadsDir = path.join(baseDir, "uploads");
  const dirs = [
    uploadsDir,
    path.join(uploadsDir, "videos"),
    path.join(uploadsDir, "original-videos"),
    path.join(uploadsDir, "delete-queue"),
    path.join(os.tmpdir(), "video_processing"),
  ];
  for (const dir of dirs) {
    await fs.promises.mkdir(dir, { recursive: true });
  }
};

export const processDeleteQueue = async (baseDir) => {
  const deleteQueueDir = path.join(baseDir, "uploads", "delete-queue");
  try {
    const files = await fs.promises.readdir(deleteQueueDir);
    for (const file of files) {
      if (file.endsWith(".json")) {
        const content = JSON.parse(await fs.promises.readFile(path.join(deleteQueueDir, file), "utf-8"));
        await fs.promises.unlink(content.path).catch(() => {});
        await fs.promises.unlink(path.join(deleteQueueDir, file)).catch(() => {});
      }
    }
  } catch (err) {
    console.error("🚨 Error cleaning delete queue:", err);
  }
};

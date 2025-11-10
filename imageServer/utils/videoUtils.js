import fs from "fs";
import path from "path";

export const copyAndDelete = async (src, dest) => {
  await fs.promises.copyFile(src, dest);
  await fs.promises.unlink(src);
};

export const exists = async (filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

export const isValidVideo = (file) => {
  if (!file) return false;
  const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska"];
  const ext = path.extname(file.originalFilename).toLowerCase();
  return validTypes.includes(file.mimetype) || [".mp4", ".mov", ".avi", ".mkv"].includes(ext);
};

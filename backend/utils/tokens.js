import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const validateTokenInput = (token, tokenName = "token") => {
  if (token === undefined || token === null) {
    throw new Error(`${tokenName} is required`);
  }

  if (typeof token !== "string") {
    throw new Error(`${tokenName} must be a string`);
  }

  const trimmed = token.trim();

  if (!trimmed) {
    throw new Error(`${tokenName} cannot be empty`);
  }

  if (trimmed === "undefined" || trimmed === "null") {
    throw new Error(`${tokenName} is invalid`);
  }

  return trimmed;
};

export const createToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
};

export const createAccessToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  token = validateTokenInput(token, "JWT token");
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyAccessToken = (token) => {
  token = validateTokenInput(token, "Access token");
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  token = validateTokenInput(token, "Refresh token");
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

export const hashToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error(`hashToken() expected string but got: ${token}`);
  }
  return crypto.createHash("sha256").update(token).digest("hex");
};



const algorithm = "aes-256-gcm";

const ENCRYPT_SECRET = process.env.ENCRYPT_SECRET;

if (!ENCRYPT_SECRET || typeof ENCRYPT_SECRET !== "string") {
  throw new Error("❌ ENCRYPT_SECRET missing or invalid in .env");
}
const secretKey = crypto.createHash("sha256").update(ENCRYPT_SECRET).digest();

function ensureValidString(value, fieldName = "value") {
  if (typeof value !== "string") {
    throw new TypeError(`❌ ${fieldName} must be a string, got: ${typeof value}`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new TypeError(`❌ ${fieldName} cannot be empty`);
  }

  return trimmed;
}

export const encrypt = (text) => {
  text = ensureValidString(text, "text");

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export const decrypt = (data) => {
  data = ensureValidString(data, "data");

  const parts = data.split(":");
  if (parts.length !== 3) {
    throw new Error("❌ Invalid encrypted data format (expected iv:tag:encrypted)");
  }
  const [ivHex, tagHex, encryptedHex] = parts;

  if (!/^[0-9a-f]+$/i.test(ivHex) || !/^[0-9a-f]+$/i.test(tagHex) || !/^[0-9a-f]+$/i.test(encryptedHex)) {
    throw new Error("❌ Invalid encrypted data (hex format error)");
  }

  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");

  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(encryptedText),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

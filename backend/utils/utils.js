import jwt from "jsonwebtoken";
import crypto from "crypto";

export const createToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1m" });
};

export const createAccessToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });
};

export const createRefreshToken = (user) => {
  return jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};



export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

import jwt from "jsonwebtoken";

export const createToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "10m" });
};

export const createAccessToken = (user) => {
  return jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "10m",
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
  if (!token || typeof token !== "string") {
    throw new Error("Access token missing");
  }
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (token.split(".").length !== 3) {
    throw new Error("Access token malformed");
  }

  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  if (!token || typeof token !== "string") {
    throw new Error("Refresh token missing");
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  if (token.split(".").length !== 3) {
    throw new Error("Refresh token malformed");
  }

  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

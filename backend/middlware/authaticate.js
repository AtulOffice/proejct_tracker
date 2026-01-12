import { verifyAccessToken } from "../utils/utils.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const decoded = verifyAccessToken(token);
    req.user = decoded?.user;
    next();
  } catch (err) {
    console.log(err?.message)
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid",
    });
  }
};


export const authenticateEngineer = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const decoded = verifyAccessToken(token);
    req.user = decoded?.user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid",
    });
  }
};

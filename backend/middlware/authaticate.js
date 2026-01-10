import EngineerReocord from "../models/engineers..model.js";
import { UserModels } from "../models/user.model.js";
import { verifyAccessToken, verifyToken } from "../utils/utils.js";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
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
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Access token expired or invalid",
    });
  }
};

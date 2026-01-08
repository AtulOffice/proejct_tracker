import EngineerReocord from "../models/engineers..model.js";
import { UserModels } from "../models/user.model.js";
import { verifyAccessToken } from "../utils/utils.js";

export const authenticate = async (req, res, next) => {
  try {
    const { accessToken } = req?.cookies;
    if (!accessToken) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(accessToken);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please login again." });
      }
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (!decoded || !decoded.user || !decoded.user?._id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const user = await UserModels.findById(decoded.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    } 

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const authenticateEngineer = async (req, res, next) => {
  try {
    const { accessTokenEngineer } = req?.cookies;
    if (!accessTokenEngineer) {
      return res.status(401).json({ message: "No token provided" });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(accessTokenEngineer);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Session expired. Please login again." });
      }
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (!decoded || !decoded.user || !decoded.user?._id) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    const user = await EngineerReocord.findById(decoded.user._id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

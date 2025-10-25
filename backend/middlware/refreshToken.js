import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../utils/utils.js";

export const refreshTokenMiddleware = (req, res, next) => {
  try {
    const { refreshToken } = req?.cookies;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Please login first" });
    }
    const decodedRefresh = verifyRefreshToken(refreshToken);

    if (!decodedRefresh || !decodedRefresh?.user) {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decodedRefresh.exp - currentTime;

    if (timeLeft < 12 * 60 * 60) {
      const newRefreshToken = createRefreshToken(decodedRefresh?.user);

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    const newAccessToken = createAccessToken(decodedRefresh.user);
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 10 * 60 * 1000,
    });
    req.cookies.accessToken = newAccessToken;
    next();
  } catch (err) {
    console.error("Token error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please login again.",
      });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please login again.",
      });
    }
    return res
      .status(401)
      .json({ success: false, message: "Please login first" });
  }
};

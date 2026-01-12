import { UserModels } from "../models/user.model.js";
import {
  createAccessToken,
  createRefreshToken,
  hashToken,
  verifyRefreshToken,
  verifyToken,
} from "../utils/tokens.js";
import crypto from "crypto"

// export const refreshTokenMiddleware = async (req, res) => {
//   try {
//     const token =
//       req.cookies?.refreshToken ||
//       req.headers["refresh-token"] ||
//       req.body?.refreshToken;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No refresh token",
//       });
//     }

//     const tokenHash = hashToken(token);

//     const user = await UserModels.findOne({
//       "refreshTokens.tokenHash": tokenHash,
//     });

//     if (!user) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid refresh token",
//       });
//     }

//     user.refreshTokens = user.refreshTokens.filter(
//       (t) => t.expires > Date.now()
//     );

//     user.refreshTokens = user.refreshTokens.filter(
//       (t) => t.tokenHash !== tokenHash
//     );

//     const MAX_SESSIONS = 5;
//     if (user.refreshTokens.length >= MAX_SESSIONS) {
//       user.refreshTokens.shift();
//     }

//     const newRefreshToken = crypto.randomBytes(40).toString("hex");

//     user.refreshTokens.push({
//       tokenHash: hashToken(newRefreshToken),
//       expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//       createdAt: new Date(),
//     });

//     await user.save();

//     const safeUser = user.toObject();
//     delete safeUser.password;
//     delete safeUser.refreshTokens;

//     const newAccessToken = createAccessToken(safeUser);

//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     const clientType = req.headers["x-client-type"] || "web";

//     const payload = {
//       success: true,
//       accessToken: newAccessToken,
//     };

//     if (clientType === "mobile") {
//       payload.refreshToken = newRefreshToken;
//     }

//     return res.json(payload);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };

// export const refreshTokenMiddleware = async (req, res) => {
//   try {
//     const token =
//       req.cookies?.refreshToken ||
//       req.headers["refresh-token"] ||
//       req.body?.refreshToken;

//     if (!token) {
//       return res.status(401).json({
//         success: false,
//         message: "No refresh token",
//       });
//     }

//     const tokenHash = hashToken(token);

//     const MAX_SESSIONS = 5;
//     const newRefreshToken = crypto.randomBytes(40).toString("hex");
//     const newRefreshHash = hashToken(newRefreshToken);

//     const user = await UserModels.findOneAndUpdate(
//       {
//         "refreshTokens.tokenHash": tokenHash,
//         "refreshTokens.expires": { $gt: Date.now() },
//       },
//       {
//         $pull: {
//           refreshTokens: {
//             $or: [
//               { expires: { $lte: Date.now() } },
//               { tokenHash: tokenHash },
//             ],
//           },
//         },
//         $push: {
//           refreshTokens: {
//             $each: [
//               {
//                 tokenHash: newRefreshHash,
//                 expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
//                 createdAt: new Date(),
//               },
//             ],
//             $slice: -MAX_SESSIONS,
//           },
//         },
//       },
//       { new: true }
//     ).lean();

//     if (!user) {
//       return res.status(403).json({
//         success: false,
//         message: "Invalid refresh token",
//       });
//     }

//     const safeUser = { ...user };
//     delete safeUser.password;
//     delete safeUser.refreshTokens;

//     const newAccessToken = createAccessToken(safeUser);

//     res.cookie("refreshToken", newRefreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV !== "development",
//       sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     const clientType = req.headers["x-client-type"] || "web";

//     const payload = {
//       success: true,
//       accessToken: newAccessToken,
//     };

//     if (clientType === "mobile") {
//       payload.refreshToken = newRefreshToken;
//     }

//     return res.json(payload);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//     });
//   }
// };
export const refreshTokenMiddleware = async (req, res) => {
  // console.log("this is called")
  try {
    const token =
      req.cookies?.refreshToken ||
      req.headers["refresh-token"] ||
      req.body?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const tokenHash = hashToken(token);

    const MAX_SESSIONS = 5;
    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    const newRefreshHash = hashToken(newRefreshToken);

    const newTokenObj = {
      tokenHash: newRefreshHash,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: new Date(),
    };

    const user = await UserModels.findOneAndUpdate(
      {
        "refreshTokens.tokenHash": tokenHash,
        "refreshTokens.expires": { $gt: Date.now() },
      },
      [
        {
          $set: {
            refreshTokens: {
              $slice: [
                {
                  $concatArrays: [
                    {
                      $filter: {
                        input: "$refreshTokens",
                        as: "t",
                        cond: {
                          $and: [
                            { $gt: ["$$t.expires", Date.now()] },
                            { $ne: ["$$t.tokenHash", tokenHash] },
                          ],
                        },
                      },
                    },
                    [newTokenObj],
                  ],
                },
                -MAX_SESSIONS,
              ],
            },
          },
        },
      ],
      { new: true }
    ).lean();

    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const safeUser = { ...user };
    delete safeUser.password;
    delete safeUser.refreshTokens;

    const newAccessToken = createAccessToken(safeUser);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const clientType = req.headers["x-client-type"] || "web";

    const payload = {
      success: true,
      accessToken: newAccessToken,
    };

    if (clientType === "mobile") {
      payload.refreshToken = newRefreshToken;
    }

    return res.json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const refreshTokenEngineerMiddleware = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshTokenEngineer ||
      req.headers["refresh-token-engineer"] ||
      req.body?.refreshTokenEngineer;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token (engineer)",
      });
    }
    const tokenHash = hashToken(token);
    const engineer = await EngineerReocord.findOne({
      "refreshTokens.tokenHash": tokenHash,
    });

    if (!engineer) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token (engineer)",
      });
    }
    engineer.refreshTokens = engineer.refreshTokens.filter(
      (t) => t.expires > Date.now()
    );
    engineer.refreshTokens = engineer.refreshTokens.filter(
      (t) => t.tokenHash !== tokenHash
    );
    const MAX_SESSIONS = 5;
    if (engineer.refreshTokens.length >= MAX_SESSIONS) {
      engineer.refreshTokens.shift();
    }

    const newRefreshToken = crypto.randomBytes(40).toString("hex");

    engineer.refreshTokens.push({
      tokenHash: hashToken(newRefreshToken),
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: new Date(),
    });

    await engineer.save();

    const safeEngineer = engineer.toObject();
    delete safeEngineer.password;
    delete safeEngineer.refreshTokens;

    const newAccessToken = createAccessToken(safeEngineer);
    res.cookie("refreshTokenEngineer", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const clientType = req.headers["x-client-type"] || "web";

    const payload = {
      success: true,
      accessToken: newAccessToken,
    };

    if (clientType === "mobile") {
      payload.refreshToken = newRefreshToken;
    }
    return res.json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

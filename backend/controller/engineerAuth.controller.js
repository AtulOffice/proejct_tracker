import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import EngineerReocord from "../models/engineers.model.js";
import { sendMail } from "../utils/mailer.js";
import { createAccessToken, createRefreshToken, hashToken } from "../utils/tokens.js";
import { otpHtml } from "../utils/html.js";

export const loginEngineer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const engineer = await EngineerReocord.findOne({ email }).select(
      "+password +refreshTokens"
    );

    if (!engineer) {
      return res.status(404).json({
        success: false,
        message: "Engineer not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, engineer.password);
    if (!isPasswordValid) {
      return res.status(405).json({
        success: false,
        message: "Invalid password",
      });
    }

    engineer.lastLogin = new Date();
    const safeEngineer = engineer.toObject();
    delete safeEngineer.password;
    delete safeEngineer.refreshTokens;
    delete safeEngineer.developmentProjectList;
    delete safeEngineer.assignments;
    delete safeEngineer.workStatusRecords;
    delete safeEngineer.createdAt;
    delete safeEngineer.updatedAt;
    delete safeEngineer.manualOverride;
    delete safeEngineer.phone;
    delete safeEngineer.isAssigned;
    delete safeEngineer.lastLogin;
    delete safeEngineer.empId;

    const accessToken = createAccessToken(safeEngineer);
    const refreshToken = crypto.randomBytes(40).toString("hex");
    engineer.refreshTokens = (engineer.refreshTokens || []).filter(
      (t) => t.expires > Date.now()
    );

    const MAX_SESSIONS = 5;
    if (engineer.refreshTokens.length >= MAX_SESSIONS) {
      engineer.refreshTokens.shift();
    }
    engineer.refreshTokens.push({
      tokenHash: hashToken(refreshToken),
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: new Date(),
    });
    await engineer.save();

    res.cookie("refreshTokenEngineer", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const clientType = req.headers["x-client-type"] || "web";

    const payload = {
      success: true,
      message: "Engineer login successful",
      accessToken,
      user: safeEngineer,
    };

    if (clientType === "mobile") {
      payload.refreshToken = refreshToken;
    }
    return res.status(200).json(payload);
  } catch (e) {
    console.error("Engineer Login Error:", e);
    return res.status(500).json({
      success: false,
      message: "Error while processing login",
    });
  }
};

export const logoutEngineer = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshTokenEngineer ||
      req.headers["refresh-token-engineer"] ||
      req.body?.refreshTokenEngineer;
    if (!token) {
      res.clearCookie("refreshTokenEngineer");
      return res.status(200).json({
        success: true,
        message: "Engineer logged out",
      });
    }

    const tokenHash = hashToken(token);

    await EngineerReocord.updateOne(
      { "refreshTokens.tokenHash": tokenHash },
      { $pull: { refreshTokens: { tokenHash } } }
    );

    res.clearCookie("refreshTokenEngineer", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });

    return res.status(200).json({
      success: true,
      message: "Engineer logged out successfully",
    });
  } catch (error) {
    console.error("Logout Engineer Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
    });
  }
};

export const findEngineerDetailstemp = async (req, res) => {
  try {
    const _id = "690d9c410bf219e9ffa27c34";
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please Login first",
      });
    }
    const EngineerData = await EngineerReocord.findById(_id);
    if (!EngineerData) {
      return res.status(404).json({
        success: false,
        user: null,
        message: "Engineer  not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: EngineerData,
    });
  } catch (e) {
    console.error("Some error occurred:", e);
    return res.status(405).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

export const findEngineerDetails = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please Login first",
      });
    }
    const EngineerData = await EngineerReocord.findById(_id).select(
      "-createdAt -updatedAt -developmentProjectList -assignments"
    );
    if (!EngineerData) {
      return res.status(404).json({
        success: false,
        user: null,
        message: "Engineer  not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: EngineerData,
    });
  } catch (e) {
    console.error("Some error occurred:", e);
    return res.status(405).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

export const forgotEngineer = async (req, res) => {
  try {
    const { email } = req.body;
    const engineer = await EngineerReocord.findOne({ email }).select(
      "+resetOtp"
    );

    if (!engineer) {
      return res
        .status(400)
        .json({ success: false, message: "Engineer does not exist" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    engineer.resetOtp = {
      hash: crypto.createHash("sha256").update(otp).digest("hex"),
      expires: Date.now() + 10 * 60 * 1000,
      used: false,
    };

    await engineer.save();
    await sendMail({
      to: email,
      subject: "Engineer Password Reset OTP",
      text: otp,
      html: otpHtml(otp),
    });
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Forgot Engineer Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const resetEngineer = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const engineer = await EngineerReocord.findOne({ email }).select(
      "+resetOtp"
    );

    if (!engineer || !engineer.resetOtp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid request" });
    }

    const hash = crypto.createHash("sha256").update(otp).digest("hex");

    if (
      engineer.resetOtp.hash !== hash ||
      engineer.resetOtp.expires < Date.now() ||
      engineer.resetOtp.used
    ) {
      return res
        .status(400)
        .json({ success: false, message: "OTP invalid or expired" });
    }

    engineer.resetOtp.used = true;
    engineer.password = await bcrypt.hash(newPassword, 12);
    await engineer.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    console.error("Reset Engineer Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};




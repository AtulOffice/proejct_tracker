import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import EngineerReocord from "../models/engineers..model.js";
import { sendMail } from "../utils/mailer.js";
import { createAccessToken, createRefreshToken } from "../utils/utils.js";

// export const addPasswordsToEngineers = async (req, res) => {
//   try {
//     const engineersWithoutPassword = await EngineerReocord.find({
//       $or: [{ password: { $exists: false } }, { password: null }],
//     });

//     if (engineersWithoutPassword.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "All engineers already have passwords",
//       });
//     }

//     for (const engineer of engineersWithoutPassword) {
//       const plainPassword = "Default@123";
//       const hashedPassword = await bcrypt.hash(plainPassword, 12);
//       if (!engineer.email || engineer.email.trim() === "") {
//         const cleanName = engineer.name
//           ? engineer.name.replace(/\s+/g, "").toLowerCase().slice(0, 4)
//           : "user";
//         const uniqueSuffix = Math.floor(Math.random() * 10000);
//         engineer.email = `${cleanName}${uniqueSuffix}@energyventures.co.in`;
//       }
//       engineer.password = hashedPassword;
//       await engineer.save();

//       console.log(`✅ Updated: ${engineer.name} | ${engineer.email}`);
//     }

//     return res.status(200).json({
//       success: true,
//       message: "✅ Passwords (and missing emails) added successfully.",
//     });
//   } catch (err) {
//     console.error("❌ Error updating passwords:", err);
//     return res
//       .status(500)
//       .json({ success: false, message: "Server error", error: err.message });
//   }
// };

export const loginEngineer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const engineer = await EngineerReocord.findOne({ email }).select(
      "+password"
    );
    if (!engineer) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, engineer.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    engineer.lastLogin = new Date();
    await engineer.save();

    const engineerData = engineer.toObject();
    const {
      password: _,
      empId,
      isAssigned,
      phone,
      manualOverride,
      lastLogin,
      assignments,
      ...safeEngineer
    } = engineerData;

    const accessToken = createAccessToken(safeEngineer);
    const refreshToken = createRefreshToken(safeEngineer);

    res.cookie("accessTokenEngineer", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("refreshTokenEngineer", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Engineer login successful",
      user: safeEngineer,
    });
  } catch (e) {
    console.error("Engineer Login Error:", e);
    res.status(400).json({
      success: false,
      message: "Error while processing login",
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
      "-createdAt -updatedAt"
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
    return res.status(401).json({
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

// 🔹 Logout
export const logoutEngineer = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });

    res.status(200).json({
      success: true,
      message: "Engineer logged out successfully",
    });
  } catch (error) {
    console.error("Logout Engineer Error:", error);
    res.status(500).json({
      success: false,
      message: "Error while logging out",
    });
  }
};

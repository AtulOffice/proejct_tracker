import { UserModels } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";
import { otpHtml, verificationHtml } from "../utils/html.js";
import { createAccessToken, createRefreshToken, encrypt, hashToken } from "../utils/tokens.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await UserModels.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .sendFile(path.join(__dirname, "../views/verify-failed.html"));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    return res.sendFile(
      path.join(__dirname, "../views/verify-success.html")
    );
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .sendFile(path.join(__dirname, "../views/verify-error.html"));
  }
};

export const CreateUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await UserModels.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(409).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    if (existingUser && !existingUser.isEmailVerified) {
      const newToken = crypto.randomBytes(32).toString("hex");
      const hashedPassword = await bcrypt.hash(password, 10);

      existingUser.password = hashedPassword;
      existingUser.emailVerificationToken = newToken;
      existingUser.emailVerificationExpiry =
        new Date(Date.now() + 24 * 60 * 60 * 1000);
      await existingUser.save();
      const verifyLink = `${process.env.CLIENT_URL}/verify-email/${newToken}`;

      await sendMail({
        to: existingUser.email,
        subject: "Verify your email",
        html: verificationHtml(verifyLink),
      });

      return res.status(200).json({
        success: true,
        message: "Verification email resent",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await UserModels.create({
      username,
      email,
      password: hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: verificationHtml(verifyLink),
    });

    return res.status(201).json({
      success: true,
      message: "User created. Please verify your email.",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
};

export const forgotUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModels.findOne({ email }).select("+resetOtp +isEmailVerified");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }
    if (!user.isEmailVerified) {
      return res.status(405).json({
        success: false,
        message: "Please verify your email before resetting password",
      });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = {
      hash: crypto.createHash("sha256").update(otp).digest("hex"),
      expires: Date.now() + 10 * 60 * 1000,
      used: false,
    };
    await user.save();
    await sendMail({
      to: email,
      subject: "Password Reset OTP",
      text: otp,
      html: otpHtml(otp),
    });
    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err || "Server error" });
  }
};

export const resetUser = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserModels.findOne({ email }).select("+resetOtp +isEmailVerified +password");
    if (!user || !user.resetOtp) {
      return res.status(400).json({ success: false, error: "Invalid request" });
    }

    if (!user.isEmailVerified) {
      return res.status(405).json({
        success: false,
        message: "Email not verified",
      });
    }

    const hash = crypto.createHash("sha256").update(otp).digest("hex");
    if (
      user.resetOtp.hash !== hash ||
      user.resetOtp.expires < Date.now() ||
      user.resetOtp.used
    ) {
      return res.status(400).json({ success: false, message: "OTP invalid/expired" });
    }

    user.resetOtp.used = true;
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModels.findOne({ username }).select(
      "+password +isEmailVerified +refreshTokens"
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (!user.isEmailVerified)
      return res
        .status(405)
        .json({ success: false, message: "Email not verified" });

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid)
      return res
        .status(405)
        .json({ success: false, message: "Invalid credentials" });

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.refreshTokens;
    delete safeUser.isEmailVerified;
    delete safeUser.createdAt;
    delete safeUser.updatedAt;

    const accessToken = createAccessToken(safeUser);
    const refreshToken = crypto.randomBytes(40).toString("hex");

    user.refreshTokens = user.refreshTokens.filter((t) => t.expires > Date.now());
    const MAX_SESSIONS = 5;
    if (user.refreshTokens.length >= MAX_SESSIONS) {
      user.refreshTokens.shift();
    }
    user.refreshTokens.push({
      tokenHash: hashToken(refreshToken),
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
      createdAt: new Date(),
    });
    await user.save();
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const clientType = req.headers["x-client-type"] || "web";

    const payload = {
      success: true,
      accessToken,
      user: safeUser,
    };

    if (clientType === "mobile") {
      payload.refreshToken = refreshToken;
    }
    return res.json(payload);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.headers["refresh-token"] ||
      req.body?.refreshToken;
    if (!token) {
      return res.status(200).json({
        success: true,
        message: "Logged out",
      });
    }
    const tokenHash = hashToken(token);
    await UserModels.updateOne(
      { "refreshTokens.tokenHash": tokenHash },
      {
        $pull: {
          refreshTokens: { tokenHash },
        },
      }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
    });

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const finduser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await UserModels.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User information fetched successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while fetching user details",
    });
  }
};

export const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await UserModels.findById(id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(405)
        .json({ success: false, message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const findAlluser = async (req, res) => {
  try {
    const data = await UserModels.find({});
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while fetching users",
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await UserModels.findByIdAndDelete(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while deleting user",
    });
  }
};

export const findUserDetails = async (req, res) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      return res.status(400).json({
        success: false,
        message: "Please Login first",
      });
    }
    const UserData = await UserModels.findById(_id).select(
      "-createdAt -updatedAt -email -refreshTokens"
    );
    if (!UserData) {
      return res.status(404).json({
        success: false,
        user: null,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: UserData,
    });
  } catch (e) {
    console.error("Some error occurred:", e);
    return res.status(405).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

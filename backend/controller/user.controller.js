import { UserModels } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";
import { otpHtml } from "../utils/html.js";
import { createAccessToken, createRefreshToken } from "../utils/utils.js";

export const forgotUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModels.findOne({ email }).select("+resetOtp");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
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
    const user = await UserModels.findOne({ email }).select("+resetOtp");
    if (!user || !user.resetOtp) {
      return res.status(400).json({ success: false, error: "Invalid" });
    }

    const hash = crypto.createHash("sha256").update(otp).digest("hex");
    if (
      user.resetOtp.hash !== hash ||
      user.resetOtp.expires < Date.now() ||
      user.resetOtp.used
    ) {
      return res.status(400).json({ error: "OTP invalid/expired" });
    }

    user.resetOtp.used = true;
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const CreateUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const isExist = await UserModels.findOne({ username });
    if (isExist) {
      return res.status(409).json({
        success: false,
        message: "this user already exist",
      });
    }
    const newpassword = await bcrypt.hash(password, 10);
    const data = await UserModels.create({
      username,
      password: newpassword,
      role,
    });
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "error while creating the user",
    });
  }
};
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const data = await UserModels.findOne({ username }).select("+password");
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, data.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const plainUser = data.toObject();
    const { password: _, ...safeUserData } = plainUser;

    const accessToken = createAccessToken(safeUserData);
    const refreshToken = createRefreshToken(safeUserData);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 10 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: process.env.NODE_ENV === "development" ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: safeUserData,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while processing login",
    });
  }
};

export const logoutUser = (req, res) => {
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

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
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
        .status(401)
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
      "-createdAt -updatedAt -email"
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
    return res.status(401).json({
      success: false,
      message: "Token invalid or expired",
    });
  }
};

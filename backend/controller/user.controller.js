import { UserModels } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import "../config/env.js";
import dotenv from "dotenv";
dotenv.config();

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

    const token = jwt.sign(
      { id: data._id, email: data.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while processing login",
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
export const updateUserpassword = async (params) => {
  try {
    const { id } = params;
    const { password } = params.body;
    const newpassword = await bcrypt.hash(password, 10);
    const data = await UserModels.findByIdAndUpdate(
      id,
      { password: newpassword },
      { new: true }
    );
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while updating password",
    });
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

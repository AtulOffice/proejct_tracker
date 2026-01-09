import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const resetOtpSchema = new mongoose.Schema(
  {
    hash: { type: String },
    expires: { type: Date },
    used: { type: Boolean, default: false },
  },
  { _id: false }
);

const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      requred: true,
    },
    password: {
      type: String,
      requred: true,
      select: false,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "design", "reception"],
      default: "user",
    },
    resetOtp: {
      type: resetOtpSchema,
      select: false,
    },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpiry: Date,
  },
  { timestamps: true }
);

dateToJSONTransformer(Userschema)

export const UserModels = mongoose.model("Users", Userschema);

import mongoose from "mongoose";

const Userschema = new mongoose.Schema(
  {
    username: {
      type: String,
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
    },
    role: {
      type: String,
      enum: ["user", "admin", "design"],
      default: "user",
    },
    resetOtp: {
      hash: { type: String },
      expires: { type: Date },
      used: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

export const UserModels = mongoose.model("Users", Userschema);

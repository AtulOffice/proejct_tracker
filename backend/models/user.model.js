import mongoose from "mongoose";

const Userschema = new mongoose.Schema({
  username: {
    type: String,
    requred: true,
  },
  password: {
    type: String,
    requred: true,
    select:false
  },
  role: {
    type: String,
    default: "user",
  },
},{ timestamps: true });

export const UserModels = mongoose.model("Users", Userschema);

import ProjectModel from "../models/Project.model.js";

import mongoose from "mongoose";

const ConnDB = async ({ str }) => {
  try {
    await mongoose.connect(str);
    console.log("MongoDB Connected...");
  } catch (e) {
    console.log(e);
  }
};

const addDevelopmentDefault = async () => {
  const str =
    "mongodb+srv://energyventuresco:Apply12345678@cluster0.3znig.mongodb.net/ProjectReport?retryWrites=true&w=majority&appName=Cluster0";
  try {
    const data = await ConnDB({ str });
    console.log("Connected to MongoDB:", data);
    const result = await ProjectModel.updateMany(
      { Development: { $exists: false } },
      { $set: { Development: false } }
    );

    console.log(
      `✅ ${result.modifiedCount} documents updated with Development: false`
    );
  } catch (err) {
    console.error("❌ Error updating documents:", err);
  }
};

addDevelopmentDefault();

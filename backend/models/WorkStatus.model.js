import mongoose from "mongoose";

const WrkStatusSchema = new mongoose.Schema(
  {
    jobNumber: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    soType: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    EngineerName: {
      type: String,
    },
    fromDate: {
      type: String,
      required: true,
    },
    toDate: {
      type: String,
      required: true,
    },
    WorkStatus: {
      type: String,
      required: true,
    },
    StartChecklist: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
    EndChecklist: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
    BackupSubmission: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
    ExpensSubmission: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
  },
  {
    timestamps: true,
  }
);

const workStatusModel = mongoose.model("WorkStatus", WrkStatusSchema);

export default workStatusModel;

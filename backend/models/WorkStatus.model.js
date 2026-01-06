import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

// for future
const ProjectProgressSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      unique: true,
    },

    overallCompletionPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    status: {
      type: String,
      enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"],
      default: "NOT_STARTED",
    },

    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);


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
    location: {
      type: String,
    },
    EngineerName: {
      type: String,
      trim: true,
    },
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    WorkStatus: {
      type: String,
      required: true,
    },
    progressPercent: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    StartChecklisttId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StartChecklists",
    },
    EndChecklisttId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndChecklists",
    },
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "engineerrecords",
    },
  },
  {
    timestamps: true,
  }
);

dateToJSONTransformer(WrkStatusSchema);

const workStatusModel = mongoose.model("WorkStatus", WrkStatusSchema);

export default workStatusModel;

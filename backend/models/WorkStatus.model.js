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
  },
  {
    timestamps: true,
  }
);

const workStatusModel = mongoose.model("WorkStatus", WrkStatusSchema);

export default workStatusModel;

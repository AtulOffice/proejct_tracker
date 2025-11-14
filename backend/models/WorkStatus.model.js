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
    // StartChecklist: {
    //   type: String,
    //   enum: ["YES", "NO", "N/A"],
    //   default: "N/A",
    // },
    // EndChecklist: {
    //   type: String,
    //   enum: ["YES", "NO", "N/A"],
    //   default: "N/A",
    // },
    // BackupSubmission: {
    //   type: String,
    //   enum: ["YES", "NO", "N/A"],
    //   default: "N/A",
    // },
    // ExpensSubmission: {
    //   type: String,
    //   enum: ["YES", "NO", "N/A"],
    //   default: "N/A",
    // },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const workStatusModel = mongoose.model("WorkStatus", WrkStatusSchema);

export default workStatusModel;

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    engineerName: {
      type: [String],
      default: [],
    },
    finalMomnumber: {
      type: String,
      default: null,
    },
    actualStartDate: {
      type: String,
      default: null,
    },
    actualEndDate: {
      type: String,
      default: null,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    jobNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bill: {
      type: Number,
      required: true,
      min: 0,
    },
    dueBill: {
      type: Number,
      min: 0,
      default: 0,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      enum: ["SI DELHI", "SI PUNE", "SI NOIDA", "MS DELHI"],
    },
    soType: {
      type: String,
      required: true,
      trim: true,
      enum: ["PROJECT", "AMC", "SERVICE", "WARRANTY"],
    },
    billStatus: {
      type: String,
      enum: [
        "TBB",
        "ALL BILLED",
        "PART BILLED",
        "N/A",
        "CLOSED",
        "ALL BILLED",
        "CANCELED",
      ],
      default: "N/A",
    },
    status: {
      type: String,
      required: true,
      enum: ["upcoming", "pending", "completed", "cancelled", "running"],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
    },
    service: {
      type: String,
      required: true,
      enum: ["Service Included", "Service not included"],
    },
    supplyStatus: {
      type: String,
      enum: ["DISPATCHED", "PARTIAL DISPATCH", "NA", "ACTIVE", "CANCELED"],
    },
    checklistStatus: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
    visitDate: {
      type: String,
      default: null,
    },
    visitendDate: {
      type: String,
      default: null,
    },
    momDate: {
      type: [String],
      default: [],
    },
    momsrNo: {
      type: [String],
      default: [],
    },
    endUser: {
      type: String,
      default: null,
    },
    orderNumber: {
      type: String,
      default: null,
    },
    orderDate: {
      type: String,
    },
    daysspendsite: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      maxlength: 400,
    },
    location: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },

    workScope: {
      type: String,
      default: "not provided",
    },
    expenseScope: {
      type: String,
      required: true,
    },
    deleveryDate: {
      type: String,
      default: null,
    },
    requestDate: {
      type: String,
      default: null,
    },
    actualVisitDuration: { type: String, default: "not provided" },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ status: 1 });

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;

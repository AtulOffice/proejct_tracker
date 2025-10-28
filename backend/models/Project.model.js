import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    EngineerDetails: [
      {
        engineerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EngineerRecord",
        },
        name: { type: String, required: true },
        empId: { type: String, trim: true },
        assignedAt: { type: Date },
        durationDays: { type: Number, default: 0 },
        endTime: { type: Date },
      },
    ],
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
      enum: ["PROJECT", "AMC", "SERVICE", "WARRANTY", "SUPPLY"],
    },
    billStatus: {
      type: String,
      enum: ["TBB", "ALL BILLED", "PART BILLED", "N/A", "CLOSED", "CANCELED"],
      default: "N/A",
    },
    status: {
      type: String,
      required: true,
      enum: [
        "upcoming",
        "pending",
        "completed",
        "cancelled",
        "running",
        "closed",
        "no request",
      ],
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
      enum: [
        "DISPATCHED",
        "PARTIAL DISPATCH",
        "N/A",
        "ACTIVE",
        "CANCELED",
        "DELIVERED",
        "PENDING",
      ],
      default: "N/A",
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
    Development: {
      type: String,
      enum: ["OFFICE", "SITE", "N/A"],
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
    },
    deleveryDate: {
      type: String,
      default: null,
    },
    ContactPersonName: {
      type: String,
      default: null,
    },
    ContactPersonNumber: {
      type: String,
      default: null,
    },
    DevelopmentDetials: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectDev",
    },
    PlanDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectDevPlans",
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

// const checklistEnum = ["YES", "NO", "N/A"];
// const statusEnum = [
//   "upcoming",
//   "pending",
//   "completed",
//   "cancelled",
//   "running",
//   "closed",
//   "no request",
// ];
// const billStatusEnum = ["TBB", "ALL BILLED", "PART BILLED", "N/A", "CLOSED", "CANCELED"];
// const supplyEnum = [
//   "DISPATCHED",
//   "PARTIAL DISPATCH",
//   "N/A",
//   "ACTIVE",
//   "CANCELED",
//   "DELIVERED",
//   "PENDING",
// ];

// const engineerSchema = new mongoose.Schema(
//   {
//     engineerId: { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
//     name: { type: String, required: true },
//     empId: { type: String, trim: true },
//     assignedAt: Date,
//     durationDays: { type: Number, default: 0 },
//     endTime: Date,
//   },
//   { _id: false }
// );

// const projectSchema = new mongoose.Schema(
//   {
//     projectName: { type: String, required: true, trim: true },
//     client: { type: String, required: true, trim: true },
//     jobNumber: { type: String, required: true, trim: true },
//     location: { type: String, required: true },
//     duration: { type: String, required: true },

//     EngineerDetails: [engineerSchema],
//     engineerName: { type: [String], default: [] },

//     entityType: {
//       type: String,
//       required: true,
//       enum: ["SI DELHI", "SI PUNE", "SI NOIDA", "MS DELHI"],
//     },
//     soType: {
//       type: String,
//       required: true,
//       enum: ["PROJECT", "AMC", "SERVICE", "WARRANTY", "SUPPLY"],
//     },

//     bill: { type: Number, required: true, min: 0 },
//     dueBill: { type: Number, default: 0, min: 0 },
//     billStatus: { type: String, enum: billStatusEnum, default: "N/A" },

//     status: { type: String, required: true, enum: statusEnum },
//     priority: { type: String, required: true, enum: ["low", "medium", "high", "critical"] },
//     service: {
//       type: String,
//       required: true,
//       enum: ["Service Included", "Service not included"],
//     },
//     supplyStatus: { type: String, enum: supplyEnum, default: "N/A" },
//     StartChecklist: { type: String, enum: checklistEnum, default: "N/A" },
//     EndChecklist: { type: String, enum: checklistEnum, default: "N/A" },
//     BackupSubmission: { type: String, enum: checklistEnum, default: "N/A" },
//     ExpensSubmission: { type: String, enum: checklistEnum, default: "N/A" },
//     actualStartDate: Date,
//     actualEndDate: Date,
//     startDate: Date,
//     endDate: Date,
//     visitDate: Date,
//     visitendDate: Date,
//     orderDate: Date,
//     deleveryDate: Date,
//     requestDate: Date,
//     finalMomnumber: String,
//     momDate: { type: [String], default: [] },
//     momsrNo: { type: [String], default: [] },
//     endUser: String,
//     orderNumber: String,
//     daysspendsite: { type: Number, default: 0 },
//     workScope: { type: String, default: "not provided" },
//     expenseScope: String,
//     ContactPersonName: String,
//     ContactPersonNumber: String,
//     actualVisitDuration: { type: String, default: "not provided" },
//     description: { type: String, maxlength: 400 },
//     Development: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// projectSchema.index({ status: 1 });

// export default mongoose.model("Project", projectSchema);

import mongoose from "mongoose";

const resetOtpSchema = new mongoose.Schema(
  {
    hash: { type: String },
    expires: { type: Date },
    used: { type: Boolean, default: false },
  },
  { _id: false }
);

const engineerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, trim: true, default: "" },
    empId: { type: String, trim: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["ENGINEER"], default: "ENGINEER" },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date },
    isAssigned: { type: Boolean, default: false },
    manualOverride: { type: Boolean, default: false },
    resetOtp: {
      type: resetOtpSchema,
      select: false,
    },
    assignments: [
      {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        projectName: { type: String, default: "" },
        jobNumber: {
          type: String,
          trim: true,
        },
        assignedAt: { type: Date, default: Date.now },
        endTime: { type: Date },
        durationDays: { type: Number, default: 0 },
      },
    ],
    developmentProjectList: {
      documents: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          startDate: Date,
          endDate: Date,
        },
      ],
      logic: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          startDate: Date,
          endDate: Date,
        },
      ],
      scada: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          startDate: Date,
          endDate: Date,
        },
      ],
      testing: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          startDate: Date,
          endDate: Date,
        },
      ],
    },
  },
  { timestamps: true }
);

const EngineerReocord = mongoose.model("EngineerRecord", engineerSchema);

export default EngineerReocord;

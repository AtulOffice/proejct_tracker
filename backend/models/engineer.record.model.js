import mongoose from "mongoose";

const engineerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    manualOverride: { type: Boolean, default: false },
    isAssigned: { type: Boolean, default: false },
    empId: { type: String, trim: true },
    assignments: [
      {
        projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
        projectName: { type: String, default: "" },
        jobNumber: {
          type: String,
          trim: true,
        },
        assignedAt: { type: Date, default: Date.now() },
        endTime: { type: Date },
        durationDays: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

const EngineerReocord = mongoose.model("EngineerRecord", engineerSchema);

export default EngineerReocord;

import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

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
    workStatusRecords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "WorkStatus" },
    ],
    role: {
      type: String,
      enum: ["ENGINEER"],
      default: "ENGINEER",
      select: false,
    },
    active: { type: Boolean, default: true },
    lastLogin: { type: Date, select: false },
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
        engToprojObjectId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        assignedAt: { type: Date, default: Date.now },
        endTime: { type: Date },
        durationDays: { type: Number, default: 0 },
        isMom: {
          type: Boolean,
          default: false,
        },
        isFinalMom: {
          type: Boolean,
          default: false,
        },
        momDocuments: [String],
      },
    ],
    developmentProjectList: {
      documents: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          phases: [
            {
              phaseIndex: Number,
              totalPhases: Number,
              sectionName: {
                type: String, default: ""
              },
              sectionStartDate: Date,
              sectionEndDate: Date,
              startDate: Date,
              endDate: Date,
              engineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
              peerEngineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
            },
          ],
        },
      ],
      logic: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          phases: [
            {
              phaseIndex: Number,
              totalPhases: Number,
              sectionName: {
                type: String, default: ""
              },
              sectionStartDate: Date,
              sectionEndDate: Date,
              startDate: Date,
              endDate: Date,
              engineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
              peerEngineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
            },
          ],
        },
      ],
      scada: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          phases: [
            {
              phaseIndex: Number,
              totalPhases: Number,
              sectionName: {
                type: String, default: ""
              },
              sectionStartDate: Date,
              sectionEndDate: Date,
              startDate: Date,
              endDate: Date,
              engineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
              peerEngineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
            },
          ],
        },
      ],
      testing: [
        {
          project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
          phases: [
            {
              phaseIndex: Number,
              totalPhases: Number,
              sectionName: {
                type: String, default: ""
              },
              sectionStartDate: Date,
              sectionEndDate: Date,
              startDate: Date,
              endDate: Date,
              engineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
              peerEngineers: [
                { type: mongoose.Schema.Types.ObjectId, ref: "EngineerRecord" },
              ],
            },
          ],
        },
      ],
    },
  },
  { timestamps: true }
);

dateToJSONTransformer(engineerSchema);
const EngineerReocord = mongoose.model("EngineerRecord", engineerSchema);

export default EngineerReocord;

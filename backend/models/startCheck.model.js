import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const yesNoEnum = ["YES", "NO", ""];
const ENUMVAL = ["YES", "NO", "N/A", ""];

const startchecklistsSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true },
    jobNumber: { type: String, required: true, trim: true },
    engineerName: { type: String, trim: true },
    customerName: { type: String, trim: true },
    endUser: { type: String, trim: true },
    site: { type: String, trim: true },

    poNumber: { type: String, trim: true },
    poDate: { type: Date },
    contactPerson: { type: String, trim: true },
    contactPersonNumber: { type: String, trim: true },
    visitStartDate: { type: Date },

    // Understanding & Scope Section
    poCollected: { type: String, enum: yesNoEnum },
    scopeClarityTaken: { type: String, enum: yesNoEnum },
    scopeUnderstanding: { type: String, trim: true },
    freeDaysInPO: { type: String, trim: true },
    estimatedDuration: { type: String, trim: true },

    // Internal Design Documents
    internalDocuments: {
      panelGA: { type: String, enum: ENUMVAL },
      wiringDiagram: { type: String, enum: ENUMVAL },
      ioList: { type: String, enum: ENUMVAL },
      systemConfiguration: { type: String, enum: ENUMVAL },
      cableSchedule: { type: String, enum: ENUMVAL },
      logicSchedule: { type: String, enum: ENUMVAL },
      logicBackup: { type: String, enum: ENUMVAL },
      scada: { type: String, enum: ENUMVAL },
    },

    // Customer Documents
    customerDocuments: {
      pAndIDs: { type: String, enum: ENUMVAL },
      controlPhilosophy: { type: String, enum: ENUMVAL },
      anyOther: { type: String, enum: ENUMVAL },
    },

    // Dispatch Documents
    dispatchDocuments: {
      packingList: { type: String, enum: ENUMVAL },
      deliveryChallan: { type: String, enum: ENUMVAL },
      anyOther: { type: String, enum: ENUMVAL },
    },

    // Tools Required
    toolsRequired: {
      basicTools: { type: String, enum: ENUMVAL },
      multimeter: { type: String, enum: ENUMVAL },
      signalSource: { type: String, enum: ENUMVAL },
      hartCalibrator: { type: String, enum: ENUMVAL },
      ferruleMachine: { type: String, enum: ENUMVAL },
      anyOther: { type: String, enum: ENUMVAL },
    },

    readinessConfirmation: { type: String, enum: ENUMVAL },

    travelArrangementBy: {
      type: String,
      enum: ["SIEVPL", "CUSTOMER", "N/A", ""],
    },
    travelCostBy: { type: String, enum: ["SIEVPL", "CUSTOMER", "N/A", ""] },
    boardingArrangementBy: {
      type: String,
      enum: ["SIEVPL", "CUSTOMER", "N/A", ""],
    },
    boardingCostBy: { type: String, enum: ["SIEVPL", "CUSTOMER", "N/A", ""] },
    gatePassDocsSent: { type: String, enum: ENUMVAL },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

dateToJSONTransformer(startchecklistsSchema)

const StartChecklistsModel = mongoose.model(
  "StartChecklists",
  startchecklistsSchema
);

export default StartChecklistsModel;

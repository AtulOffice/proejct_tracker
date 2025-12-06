import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const sectionSchema = new mongoose.Schema({
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  planDetails: { type: String, default: "" },
  engineers: { type: [String], default: [] },
});

const planningBlockSchema = new mongoose.Schema({
  scada: sectionSchema,
  logic: sectionSchema,
  testing: sectionSchema,
  documents: sectionSchema,
});

const DevPlanningSchema = new mongoose.Schema(
  {
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    projectName: {
      type: String,
      trim: true,
    },

    DevelopmentDetials: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectDev",
    },

    jobNumber: {
      type: String,
      required: true,
      trim: true,
    },

    plans: {
      type: [planningBlockSchema],
      default: [],
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },

    devScope: {
      type: String,
      enum: ["LOGIC", "SCADA", "BOTH", "N/A", ""],
      default: "",
    },
  },
  { timestamps: true }
);

dateToJSONTransformer(DevPlanningSchema);

const PlanningModelNew = mongoose.model("ProjectDevPlans", DevPlanningSchema);
export default PlanningModelNew;

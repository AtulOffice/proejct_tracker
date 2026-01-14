import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String, default: ""
    },
    sectionStartDate: { type: Date, default: null },
    sectionEndDate: { type: Date, default: null },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    planDetails: { type: String, default: "" },
    engineers: { type: [String], default: [] },
  },
  // { _id: false }
);

const planningBlockSchema = new mongoose.Schema(
  {
    scada: { type: [sectionSchema], default: [] },
    logic: { type: [sectionSchema], default: [] },
    testing: { type: [sectionSchema], default: [] },
    documents: { type: [sectionSchema], default: [] },
  },
  // { _id: false }
);

const DevPlanningSchema = new mongoose.Schema(
  {
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    allEngineers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "EngineerRecord",
      default: [],
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

const PlanningModel = mongoose.model("ProjectDevPlans", DevPlanningSchema);
export default PlanningModel;

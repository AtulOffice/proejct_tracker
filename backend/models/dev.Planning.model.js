import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  planDetails: { type: String },
  engineers: [],
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
    scada: sectionSchema,
    logic: sectionSchema,
    testing: sectionSchema,
    documents: sectionSchema,
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
  {
    timestamps: true,
  }
);

const PlanningModel = new mongoose.model("ProjectDevPlans", DevPlanningSchema);
export default PlanningModel;

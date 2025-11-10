import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  planDetails: { type: String },
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
    upatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

const PlanningModel = new mongoose.model("ProjectDevPlans", DevPlanningSchema);
export default PlanningModel;

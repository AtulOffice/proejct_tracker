import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  startDate: { type: Date },
  endDate: { type: Date },
  planDetails: { type: String },
});

const projectDevelopmentSchema = new mongoose.Schema(
  {
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    scada: sectionSchema,
    logic: sectionSchema,
    testing: sectionSchema,
    documents: sectionSchema,
    upatedBy: {
      type: String,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ProjectDevPlans", projectDevelopmentSchema);

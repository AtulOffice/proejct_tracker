import mongoose from "mongoose";

const dailyTaskSchema = new mongoose.Schema({
  engineerId: { type: String, required: true },
  engineerName: { type: String, required: true, trim: true },
  projectName: { type: String, trim: true },
  scadaOrlogic: { type: Boolean },
  jobNumber: { type: String, trim: true },
  tasks: { type: String },
});

const weeklyAssignmentSchema = new mongoose.Schema({
  weekStart: { type: Date, required: true },
  weekEnd: { type: Date, required: true },
  engineerName: [String],
  assignments: {
    type: Map,
    of: [dailyTaskSchema],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const WeeklyAssignment = mongoose.model(
  "WeeklyAssignment",
  weeklyAssignmentSchema
);

export default WeeklyAssignment;

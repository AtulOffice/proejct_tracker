import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    consumedDays: { type: String, default: "0" },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const StatusTaskSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
    },
    title: { type: String, default: "" },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    consumedDays: { type: String, default: "0" },
  },
  { _id: false }
);

const DocsTaskSchema = new mongoose.Schema(
  {
    requireMent: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "NO",
    },
    title: { type: String, default: "" },
    status: { type: Boolean, default: false },
    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    consumedDays: { type: String, default: "0" },
  },
  { _id: false }
);

const ProjectDevSchema = new mongoose.Schema(
  {
    devScope: {
      type: String,
      default: "N/A",
    },
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    PlanDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectDevPlans",
    },
    status: {
      type: Boolean,
      default: false,
    },
    jobNumber: { type: String, required: true },
    projectName: {
      type: String,
      trim: true,
    },
    startDate: { type: Date },
    endDate: { type: Date, default: null },
    DaysConsumed: { type: String, default: "0" },

    fileReading: DocsTaskSchema,
    pId: DocsTaskSchema,
    systemConfig: DocsTaskSchema,
    generalArrangement: DocsTaskSchema,
    powerWiring: DocsTaskSchema,
    moduleWiring: DocsTaskSchema,
    ioList: DocsTaskSchema,

    alarm: TaskSchema,
    scadaScreen: [
      {
        title: { type: String, default: "Screen" },
        scadastartDate: { type: Date, default: null },
        scadaendDate: { type: Date, default: null },
        scadaconsumedDays: { type: String, default: "0" },
        status: { type: Boolean, default: false },
      },
    ],
    Trend: TaskSchema,
    dataLog: TaskSchema,
    systemConfigScada: TaskSchema,

    aiMapping: TaskSchema,
    aoMapping: TaskSchema,
    diMapping: TaskSchema,
    doMapping: TaskSchema,
    oprationalLogic: TaskSchema,
    moduleStatus: TaskSchema,
    redundencyStatus: TaskSchema,

    rangeSet: StatusTaskSchema,
    ioTesting: StatusTaskSchema,
    alarmTest: StatusTaskSchema,
    trendsTest: StatusTaskSchema,
    operationLogic: StatusTaskSchema,
    moduleStatusTest: StatusTaskSchema,
    dlrStatusTest: StatusTaskSchema,
    redundencyStatusTest: StatusTaskSchema,

    statusprogress: {
      type: String,
      enum: ["RUNNING", "PENDING", "COMPLETED"],
      default: "PENDING",
    },

    summary: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

function calculateSummaryAndStatus(doc) {
  const groups = {
    document: [
      "fileReading",
      "pId",
      "systemConfig",
      "generalArrangement",
      "powerWiring",
      "moduleWiring",
      "ioList",
    ],
    scada: ["alarm", "scadaScreen", "Trend", "dataLog", "systemConfigScada"],
    logic: [
      "aiMapping",
      "aoMapping",
      "diMapping",
      "doMapping",
      "oprationalLogic",
      "moduleStatus",
      "redundencyStatus",
    ],
    test: [
      "rangeSet",
      "ioTesting",
      "alarmTest",
      "trendsTest",
      "operationLogic",
      "moduleStatusTest",
      "dlrStatusTest",
      "redundencyStatusTest",
    ],
  };

  const result = {};

  for (let group in groups) {
    let total = 0;
    let completed = 0;

    groups[group].forEach((field) => {
      const value = doc[field];
      if (Array.isArray(value)) {
        total++;
        if (value.every((item) => item.status === true)) completed++;
      } else if (value && value.status !== undefined) {
        total++;
        if (typeof value.status === "string") {
          if (value.status === "Yes" || value.status === "N/A") completed++;
        } else if (typeof value.status === "boolean") {
          if (value.status) completed++;
        }
      }
    });

    result[group] = total > 0 ? ((completed / total) * 100).toFixed(2) : "0.00";
  }

  const percentages = Object.values(result).map((v) => parseFloat(v));
  let statusprogress = "PENDING";

  if (percentages.every((v) => v === 100)) {
    statusprogress = "COMPLETED";
  } else if (percentages.every((v) => v === 0)) {
    statusprogress = "PENDING";
  } else {
    statusprogress = "RUNNING";
  }

  return { summary: result, statusprogress };
}
ProjectDevSchema.pre("save", function (next) {
  const { summary, statusprogress } = calculateSummaryAndStatus(this);
  this.summary = summary;
  this.statusprogress = statusprogress;
  next();
});

ProjectDevSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    const { summary, statusprogress } = calculateSummaryAndStatus(doc);
    await this.model.updateOne(
      { _id: doc._id },
      { $set: { summary, statusprogress } }
    );
  }
});

dateToJSONTransformer(ProjectDevSchema);
const ProjectDevModel = mongoose.model("ProjectDev", ProjectDevSchema);

export default ProjectDevModel;

import mongoose from "mongoose";

const ENUMVAL = ["YES", "NO", "N/A", ""];

const documentFormetFirst = {
  value: { type: String, enum: ENUMVAL, default: "N/A" },
  date: { type: Date, default: null },
};

const documentFormetSecond = {
  value: { type: String, enum: ENUMVAL, default: "N/A" },
  date: { type: Date, default: null },
  version: { type: String, default: "1.0" },
};

const documentFormetThird = {
  value: { type: String, enum: ENUMVAL, default: "N/A" },
  date: { type: Date, default: null },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
};

const documentFormetFourth = {
  value: { type: String, enum: ENUMVAL, default: "N/A" },
  date: { type: Date, default: null },
  inputVal: { type: String, default: "" },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  remarks: { type: String, default: "" },
};

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    EngineerDetails: [
      {
        engineerId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "EngineerRecord",
        },
        projToengObjectId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        name: { type: String, required: true },
        empId: { type: String, trim: true },
        assignedAt: { type: Date },
        durationDays: { type: Number, default: 0 },
        endTime: { type: Date },
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
    engineerName: {
      type: [String],
      default: [],
    },
    finalMomnumber: {
      type: String,
      default: null,
    },
    actualStartDate: {
      type: Date,
      default: null,
    },
    actualEndDate: {
      type: Date,
      default: null,
    },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    jobNumber: {
      type: String,
      required: true,
      trim: true,
    },
    bill: {
      type: Number,
      required: true,
      min: 0,
    },
    dueBill: {
      type: Number,
      min: 0,
      default: 0,
    },
    entityType: {
      type: String,
      required: true,
      enum: ["SI DELHI", "SI PUNE", "SI NOIDA", "MS DELHI"],
    },
    soType: {
      type: String,
      required: true,
      enum: ["PROJECT", "AMC", "SERVICE", "WARRANTY", "SUPPLY"],
    },
    billStatus: {
      type: String,
      enum: [
        "TBB",
        "ALL BILLED",
        "PART BILLED",
        "N/A",
        "CLOSED",
        "CANCELED",
        "",
      ],
      default: "",
    },
    status: {
      type: String,
      required: true,
      enum: [
        "upcoming",
        "pending",
        "completed",
        "cancelled",
        "running",
        "closed",
        "no request",
      ],
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high", "critical"],
    },
    isDevlopmentApproved: {
      type: String,
      enum: ["YES", "NO", ""],
      default: "",
    },
    isDataSavedProject: {
      type: Boolean,
      default: false,
    },
    CustomerDevDocumentsRemarks: {
      type: String,
    },
    SIEVPLDevDocumentsRemarks: {
      type: String,
    },
    CustomerDevDocuments: {
      pAndIDs: { type: documentFormetFirst },
      controlPhilosophy: { type: documentFormetFirst },
      ioList: { type: documentFormetFirst },
      samaDiagram: { type: documentFormetFirst },
      instrumentList: { type: documentFormetFirst },
      cableSchedule: { type: documentFormetFirst },
      existingDrawing: { type: documentFormetFirst },
      existingBackup: { type: documentFormetFirst },
      otherDocument: {
        name: { type: String, default: "" },
        value: { type: String, enum: ENUMVAL, default: "N/A" },
        date: { type: Date, default: null },
      },
    },
    SIEVPLDevDocuments: {
      indent: { type: documentFormetSecond },
      systemConfiguration: { type: documentFormetSecond },
      instrumentdataSheet: { type: documentFormetSecond },
      ApprovedDrowing: { type: documentFormetSecond },
      ioList: { type: documentFormetSecond },
      cableSchedule: { type: documentFormetSecond },
      otherDocument: {
        name: { type: String, default: "" },
        value: { type: String, enum: ENUMVAL, default: "N/A" },
        date: { type: Date, default: null },
        version: { type: String, default: "1.0" },
      },
    },
    swDevDocumentsforFat: {
      logicBackup: { type: documentFormetSecond },
      scadaBackup: { type: documentFormetSecond },
      otherDocument: {
        name: { type: String, default: "" },
        value: { type: String, enum: ENUMVAL, default: "N/A" },
        date: { type: Date, default: null },
        version: { type: String, default: "1.0" },
      },
    },
    inspectionDocuments: {
      itr: { type: documentFormetThird },
      fat: { type: documentFormetThird },
      otherDocument: {
        name: { type: String, default: "" },
        value: { type: String, enum: ENUMVAL, default: "N/A" },
        date: { type: Date, default: null },
        submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    },
    dispatchDocuments: [
      {
        phaseIndex: { type: Number, required: true },
        packingList: { type: documentFormetFirst },
        invoice: { type: documentFormetFirst },
        DeleveryChallan: { type: documentFormetFirst },
        otherDocument: {
          name: { type: String, default: "" },
          value: { type: String, enum: ENUMVAL, default: "N/A" },
          date: { type: Date, default: null },
          version: { type: String, default: "1.0" },
        },
      },
    ],
    PostCommisionDocuments: {
      itr: { type: documentFormetFourth },
      asBuiltDrawings: { type: documentFormetFourth },
      logicBackup: { type: documentFormetFourth },
      scadaBackup: { type: documentFormetFourth },
      expenseReport: { type: documentFormetFourth },
      otherDocument: {
        name: { type: String, default: "" },
        value: { type: String, enum: ENUMVAL, default: "N/A" },
        date: { type: Date, default: null },
        inputVal: { type: String, default: "" },
        submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        remarks: { type: String, default: "" },
      },
    },
    developmentEngineer: {
      type: [String],
    },
    service: {
      type: String,
      enum: [
        "DEV",
        "DEVCOM",
        "COMMISSIONING",
        "N/A",
        "AMC",
        "SERVICE",
        "SEPERATE",
        "",
      ],
      default: "N/A",
    },
    LinkedOrderNumber: {
      type: String,
      trime: true,
    },
    isMailSent: {
      type: String,
      enum: ["YES", "NO", ""],
      default: "NO",
    },
    supplyStatus: {
      type: String,
      enum: [
        "DISPATCHED",
        "PARTIAL DISPATCH",
        "N/A",
        "ACTIVE",
        "CANCELED",
        "DELIVERED",
        "PENDING",
        "",
      ],
      default: "",
    },
    StartChecklist: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
      default: "",
    },
    EndChecklist: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
      default: "",
    },
    Development: {
      type: String,
      enum: ["LOGIC", "SCADA", "BOTH", "N/A", ""],
      default: "",
    },
    LogicPlace: {
      type: String,
      enum: ["OFFICE", "SITE", ""],
      default: "",
    },
    ScadaPlace: {
      type: String,
      enum: ["OFFICE", "SITE", ""],
      default: "",
    },
    BackupSubmission: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
      default: "",
    },
    ExpensSubmission: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
      default: "",
    },
    visitDate: {
      type: Date,
      default: null,
    },
    visitendDate: {
      type: Date,
      default: null,
    },
    momDate: {
      type: [Date],
      default: [],
    },
    momsrNo: {
      type: [String],
      default: [],
    },
    endUser: {
      type: String,
      default: null,
    },
    orderNumber: {
      type: String,
      default: null,
    },
    orderDate: {
      type: Date,
    },
    daysspendsite: {
      type: Number,
      default: 0,
    },
    //
    SrvsdaysInPo: {
      type: Number,
      default: 0,
    },
    SrvsdaysInLots: {
      value: { type: Number, default: 0 },
      lots: { type: Number, default: 0 },
      unit: {
        type: String,
        enum: ["DAYS", "MAN-DAYS", ""],
        default: "DAYS",
      },
    },
    serviceDaysMention: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
      default: "N/A",
    },
    manDaysRate: {
      value: { type: Number, default: 0 },
      unit: {
        type: String,
        enum: ["DAYS", "MAN-DAYS", ""],
        default: "DAYS",
      },
    },
    servicedayrate: { type: Number, default: 0 },
    serviceVal: {
      type: Number,
      default: 0,
    },
    //
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    commScope: {
      type: String,
      maxlength: 400,
    },
    location: {
      type: String,
    },
    duration: {
      type: String,
      default: "0",
    },

    devScope: {
      type: String,
      default: "not provided",
    },
    expenseScope: {
      type: String,
    },
    deleveryDate: {
      type: Date,
      default: null,
    },
    ContactPersonName: {
      type: String,
      default: null,
    },
    ContactPersonNumber: {
      type: String,
      default: null,
    },
    DevelopmentDetials: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectDev",
    },
    OrderMongoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    StartChecklisttId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StartChecklists",
    },
    workStatusRecords: [
      { type: mongoose.Schema.Types.ObjectId, ref: "WorkStatus" },
    ],
    EndChecklisttId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EndChecklists",
    },
    PlanDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProjectDevPlans",
    },
    OrderSheet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    isPlanRecord: {
      type: Boolean,
      default: false,
    },
    requestDate: {
      type: Date,
      default: null,
    },
    actualVisitDuration: {
      type: String,
      default: "not provided",
    },
    swname: {
      type: String,
      trim: true,
    },
    swtechnicalEmail: {
      type: String,
      trim: true,
    },
    swphone: {
      type: String,
      trim: true,
    },
    CommisinionPO: {
      type: String,
      enum: ["", "YES", "NO", "SEPERATE"],
      default: "",
    },
    Workcommission: {
      commissioning: { type: Boolean, default: false },
      erection: { type: Boolean, default: false },
      instrumentation: { type: Boolean, default: false },
    },
    expenseScopeside: {
      type: String,
      enum: ["", "YES", "NO"],
      default: "",
    },

    companyExpense: {
      type: [String],
      default: [],
    },

    clientExpense: {
      type: [String],
      default: [],
    },
    isProjectDocssave: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ status: 1 });

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;

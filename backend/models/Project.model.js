import mongoose from "mongoose";

const ENUMVAL = ["YES", "NO", "N/A"];

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
      enum: ["TBB", "ALL BILLED", "PART BILLED", "N/A", "CLOSED", "CANCELED"],
      default: "N/A",
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
      enum: ["YES", "NO"],
      default: "NO",
    },
    isDataSavedProject: {
      type: Boolean,
      default: false,
    },
    internalDocuments: {
      panelGA: { type: String, enum: ENUMVAL, default: "N/A" },
      wiringDiagram: { type: String, enum: ENUMVAL, default: "N/A" },
      ioList: { type: String, enum: ENUMVAL, default: "N/A" },
      systemConfiguration: { type: String, enum: ENUMVAL, default: "N/A" },
      cableSchedule: { type: String, enum: ENUMVAL, default: "N/A" },
      logicSchedule: { type: String, enum: ENUMVAL, default: "N/A" },
      logicBackup: { type: String, enum: ENUMVAL, default: "N/A" },
      scada: { type: String, enum: ENUMVAL, default: "N/A" },
    },
    customerDocuments: {
      pAndIDs: { type: String, enum: ENUMVAL, default: "N/A" },
      controlPhilosophy: { type: String, enum: ENUMVAL, default: "N/A" },
      anyOther: { type: String, enum: ENUMVAL, default: "N/A" },
    },
    dispatchDocuments: {
      packingList: { type: String, enum: ENUMVAL, default: "N/A" },
      deliveryChallan: { type: String, enum: ENUMVAL, default: "N/A" },
      anyOther: { type: String, enum: ENUMVAL, default: "N/A" },
    },
    completionDocuments: {
      asBuiltDrawings: { type: String, enum: ENUMVAL, default: "N/A" },
      finalLogicBackup: { type: String, enum: ENUMVAL, default: "N/A" },
      finalScadaBackup: { type: String, enum: ENUMVAL, default: "N/A" },
      expenseSettlement: { type: String, enum: ENUMVAL, default: "N/A" },
    },
    developmentEngineer: {
      type: [String],
    },
    service: {
      type: String,
      enum: ["E&C", "COMMISSIONING", "N/A", "AMC", "SERVICE"],
      default: "N/A",
    },
    technicalEmail: {
      type: String,
      trim: true,
    },
    isMailSent: {
      type: String,
      enum: ["YES", "NO"],
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
      ],
      default: "N/A",
    },
    StartChecklist: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
    EndChecklist: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
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
    // ////////////
    // this is not in used
    DevelopmentSetcion: {
      type: String,
      enum: ["LOGIC", "SCADA", "BOTH", ""],
      default: "",
    },
    //  ///////////
    BackupSubmission: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
    },
    ExpensSubmission: {
      type: String,
      enum: ["YES", "NO", "N/A"],
      default: "N/A",
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
    description: {
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

    workScope: {
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
    bookingDate: { type: Date },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    orderValueSupply: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderValueService: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderValueTotal: {
      type: Number,
      default: 0,
      min: 0,
    },
    netOrderValue: {
      type: Number,
      default: 0,
    },
    poReceived: {
      type: String,
      enum: ["YES", "NO", ""],
      default: "",
    },
    orderNumber: {
      type: String,
      trim: true,
    },
    orderDate: {
      type: Date,
    },
    deleveryDate: {
      type: Date,
    },
    actualDeleveryDate: {
      type: Date,
    },
    amndReqrd: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
      default: "",
    },
    CommisinionPO: {
      type: String,
      enum: ["", "YES", "NO"],
      default: "",
    },
    Docscommission: {
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
  },
  {
    timestamps: true,
  }
);

projectSchema.index({ status: 1 });

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;

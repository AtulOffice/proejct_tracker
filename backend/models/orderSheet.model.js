import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
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
    jobNumber: { type: String, required: true, trim: true, unique: true },
    bookingDate: { type: Date },
    actualDeleveryDate: { type: Date },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    site: { type: String, trim: true },
    endUser: { type: String, trim: true },
    orderNumber: { type: String, trim: true },
    orderDate: { type: Date },
    deleveryDate: { type: Date },

    //
    name: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    //

    formalOrderStatus: {
      type: String,
      enum: ["RECEIVED", "PENDING", "N/A", ""],
    },
    amndReqrd: {
      type: String,
      enum: ["YES", "NO", "N/A", ""],
    },
    orderValueSupply: { type: Number, default: 0, min: 0 },
    orderValueService: { type: Number, default: 0, min: 0 },
    orderValueTotal: { type: Number, default: 0, min: 0 },

    cancellation: {
      type: String,
      enum: ["NONE", "PARTIAL", "COMPLETE", ""],
    },
    netOrderValue: { type: Number, default: 0 },

    paymentAgainst: {
      type: String,
    },

    paymentPercent1: { type: Number, default: 0 },
    paymentType1: {
      type: String,
      enum: ["A/W ABG", "A/W PI", "A/W PO/OA/DWG", "OTHER", ""],
    },
    paymentAmount1: { type: Number, default: 0 },
    paymentPercent2: { type: Number, default: 0 },
    paymentType2: {
      type: String,
      enum: ["A/W ABG", "A/W PI", "A/W PO/OA/DWG", "OTHER", ""],
    },
    paymentAmount2: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED", ""],
      default: "OPEN",
    },
    creditDays: { type: Number, default: 0 },
    dispatchStatus: {
      type: String,
      enum: ["DISPATCHED", "LD APPLIED", "URGENT", ""],
    },

    salesBasic: { type: Number, default: 0 },
    salesTotal: { type: Number, default: 0 },
    billPending: { type: Number, default: 0 },
    billingStatus: {
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
    },

    jobDescription: { type: String, trim: true },
    remarks: { type: String, trim: true },
    concerningSalesManager: { type: String, trim: true },
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    isSaveInProject: { type: Boolean, default: false },
    technicalEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    paymentAdvance: { type: String, enum: ["YES", "NO", ""], default: "" },
    retentionYesNo: { type: String, enum: ["YES", "NO", ""], default: "" },
    payemntCGBG1: { type: String, enum: ["YES", "NO", ""], default: "" },
    paymentrecieved1: {
      type: String,
      enum: ["RECIEVED", "NOT RECIEVED", ""],
      default: "",
    },
    payemntCGBG2: { type: String, num: ["YES", "NO", ""], default: "" },
    paymentrecieved2: {
      type: String,
      enum: ["RECIEVED", "NOT RECIEVED", ""],
      default: "",
    },
    retentionPercent: { type: Number, default: 0 },
    retentionAmount: { type: Number, default: 0 },
    retentionDocs: {
      type: String,
      enum: ["CG", "BG", "N/A", ""],
      default: "",
    },
    retentionType: {
      type: String,
      enum: ["A/W CPG", "A/W PBG", "A/W COMMISSIONING", ""],
      default: "",
    },
    retentionPeriod: { type: Number, default: 0 },
    poReceived: { type: String, enum: ["YES", "NO", ""], default: "" },
    invoiceTerm: { type: String, enum: ["PI", "SI", "N/A", ""], default: "" },
    invoicePercent: { type: Number, default: 0 },
    mileStone: { type: String, trim: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;

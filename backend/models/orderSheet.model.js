import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const OrderSchema = new mongoose.Schema(
  {
    jobNumber: { type: String, required: true, trim: true, unique: true },
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
    bookingDate: { type: Date },
    client: {
      type: String,
      required: true,
      trim: true,
    },
    endUser: { type: String, trim: true },
    site: { type: String, trim: true },
    actualDeleveryDate: { type: Date },

    orderNumber: { type: String, trim: true },
    orderDate: { type: Date },
    deleveryDate: { type: Date },

    name: { type: String, trim: true },
    technicalEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    phone: { type: String, trim: true },

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

    // payment Advance

    paymentAdvance: {
      type: String,
      enum: ["YES", "1", "2", "3", "NO", "N/A", ""],
      default: "",
    },
    paymentPercent1: { type: Number, default: 0 },
    paymentType1: {
      type: String,
      enum: ["PO", "OA", "DWG APPR.", "OTHER", ""],
    },
    paymentType1other: { type: String, trim: true },
    paymentAmount1: { type: Number, default: 0 },
    payemntCGBG1: {
      type: String,
      enum: ["YES", "NO", "CG", "BG", "N/A", "OTHER", ""],
      default: "",
    },
    paymentrecieved1: {
      type: String,
      enum: ["RECIEVED", "NOT RECIEVED", ""],
      default: "",
    },

    paymentPercent2: { type: Number, default: 0 },
    paymentType2: {
      type: String,
      enum: ["PO", "OA", "DWG APPR.", "OTHER", ""],
    },
    paymentType2other: { type: String, trim: true },
    paymentAmount2: { type: Number, default: 0 },

    payemntCGBG2: {
      type: String,
      enum: ["YES", "NO", "CG", "BG", "N/A", "OTHER", ""],
      default: "",
    },
    paymentrecieved2: {
      type: String,
      enum: ["RECIEVED", "NOT RECIEVED", ""],
      default: "",
    },
    paymentPercent3: { type: Number, default: 0 },
    paymentType3: {
      type: String,
      enum: ["PO", "OA", "DWG APPR.", "OTHER", ""],
    },
    paymentType3other: { type: String, trim: true },
    paymentAmount3: { type: Number, default: 0 },
    payemntCGBG3: {
      type: String,
      enum: ["YES", "NO", "CG", "BG", "N/A", "OTHER", ""],
      default: "",
    },
    paymentrecieved3: {
      type: String,
      enum: ["RECIEVED", "NOT RECIEVED", ""],
      default: "",
    },

    poReceived: { type: String, enum: ["YES", "NO", ""], default: "" },
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
    billPending: { type: Number },
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
    // concerningSalesManager: { type: String, trim: true },
    concerningSalesManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MarketingMemberRecord",
      default: null
    },
    ProjectDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    isSaveInProject: { type: Boolean, default: false },

    retentionYesNo: { type: String, enum: ["YES", "NO", ""], default: "" },

    retentionPercent: { type: Number, default: 0 },
    retentionAmount: { type: Number, default: 0 },
    retentionDocs: {
      type: String,
      enum: ["CG", "BG", "N/A", ""],
      default: "",
    },
    retentinoDocsOther: { type: String, trim: true },
    retentionType: {
      type: String,
      enum: ["A/W CPG", "A/W PBG", "A/W COMMISSIONING", ""],
      default: "",
    },
    retentionPeriod: { type: Number, default: 0 },
    invoiceTerm: { type: String, enum: ["PI", "SI", "N/A", ""], default: "" },
    invoicePercent: { type: Number, default: 0 },
    invoiceAmount: { type: Number, default: 0 },
    mileStone: { type: String, trim: true },
    invoicemileStoneOther: { type: String, trim: true },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

dateToJSONTransformer(OrderSchema)


const Order = mongoose.model("Order", OrderSchema);

export default Order;


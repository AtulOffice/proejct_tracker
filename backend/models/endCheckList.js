import mongoose from "mongoose";

const ENUMVAL = ["YES", "NO", "N/A"];

const EndChecklistsSchema = new mongoose.Schema(
  {
    email: { type: String, trim: true },
    jobNumber: { type: String, required: true, trim: true },
    engineerName: { type: String, trim: true },
    customerName: { type: String, trim: true },
    endUser: { type: String, trim: true },
    site: { type: String, trim: true },

    poNumber: { type: String, trim: true },
    poDate: { type: Date },
    contactPerson: { type: String, trim: true },
    contactPersonNumber: { type: String, trim: true },

    visitStartDate: { type: Date },
    visitEndDate: { type: Date },
    momNumber: { type: String, trim: true }, 
    projectStatus: { type: String, enum: ["OPEN", "CLOSED"] },
    momSignedByCustomer: { type: String, enum: ENUMVAL },


    pendingPoints: { type: String, trim: true }, 
    customerRemarks: { type: String, trim: true },

    completedWithinEstimatedTime: { type: Boolean },
    facedChallenges: { type: Boolean },
    challengeDetails: { type: String, trim: true }, 
    completionDocuments: {
      asBuiltDrawings: { type: String, enum: ENUMVAL },
      finalLogicBackup: { type: String, enum: ENUMVAL },
      finalScadaBackup: { type: String, enum: ENUMVAL },
      expenseSettlement: { type: String, enum: ENUMVAL },
    },

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  { timestamps: true }
);

const EndChecklistsModel = mongoose.model("EndChecklists", EndChecklistsSchema);

export default EndChecklistsModel;

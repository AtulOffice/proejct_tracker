import mongoose from "mongoose";

const EngineerProgressReportSchema = new mongoose.Schema(
    {
        projectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        phaseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            index: true,
        },
        SectionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },

        submittedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Engineer",
            required: true,
            index: true,
        },
        targetStartDate: {
            type: Date,
            required: true,
        },

        targetEndDate: {
            type: Date,
            required: true,
        },
        actualStartDate: {
            type: Date,
            default: null,
        },

        actualEndDate: {
            type: Date,
            default: null,
        },

        reportDate: {
            type: Date,
            required: true,
            default: Date.now,
            index: true,
        },
        actualProgressDay: {
            type: Number,
            min: 0,
            required: true,
        },

        actualCompletionPercent: {
            type: Number,
            min: 0,
            max: 100,
            required: true,
        },
        remarks: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model(
    "EngineerProgressReport",
    EngineerProgressReportSchema
);

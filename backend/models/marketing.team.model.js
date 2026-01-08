import mongoose from "mongoose";
import { dateToJSONTransformer } from "../utils/dateconvert.js";

const resetOtpSchema = new mongoose.Schema(
    {
        hash: { type: String },
        expires: { type: Date },
        used: { type: Boolean, default: false },
    },
    { _id: false }
);

const marketingMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        empId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },

        password: {
            type: String,
            select: false,
        },
        role: {
            type: String,
            enum: ["MARKETING"],
            default: "MARKETING",
            select: false,
        },

        designation: {
            type: String,
            // enum: [
            //     "SEO",
            //     "CONTENT",
            //     "SOCIAL_MEDIA",
            //     "ADS",
            //     "EMAIL_MARKETING",
            //     "ANALYST",
            //     "MANAGER",
            // ],
            // default: "SEO",
        },
        active: {
            type: Boolean,
            default: true,
        },

        lastLogin: {
            type: Date,
            select: false,
        },

        isAssigned: {
            type: Boolean,
            default: false,
        },
        resetOtp: {
            type: resetOtpSchema,
            select: false,
        },
        campaigns: [
            {
                campaignId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "MarketingCampaign",
                },
                campaignName: {
                    type: String,
                    default: "",
                },
                platform: {
                    type: String,
                    default: "",
                },
                startDate: Date,
                endDate: Date,
                leadsGenerated: {
                    type: Number,
                    default: 0,
                },
                conversions: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        performance: {
            totalLeads: { type: Number, default: 0 },
            totalConversions: { type: Number, default: 0 },
            revenueGenerated: { type: Number, default: 0 },
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

dateToJSONTransformer(marketingMemberSchema);

const MarketingMemberRecord = mongoose.model(
    "MarketingMemberRecord",
    marketingMemberSchema
);

export default MarketingMemberRecord;

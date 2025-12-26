import mongoose from "mongoose";

import EngineerProgressReport from "../models/devProgressReport.models.js";
import EngineerReocord from "../models/engineers..model.js";

export const validateProgressBody = (body) => {
    const errors = [];

    const isObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

    if (!isObjectId(body.projectId)) {
        errors.push("Invalid or missing projectId");
    }

    if (!isObjectId(body.phaseId)) {
        errors.push("Invalid or missing phaseId");
    }

    if (!body.targetStartDate || isNaN(new Date(body.targetStartDate))) {
        errors.push("Invalid or missing targetStartDate");
    }

    if (!body.targetEndDate || isNaN(new Date(body.targetEndDate))) {
        errors.push("Invalid or missing targetEndDate");
    }

    if (
        body.actualCompletionPercent === undefined ||
        body.actualCompletionPercent < 0 ||
        body.actualCompletionPercent > 100
    ) {
        errors.push("actualCompletionPercent must be between 0 and 100");
    }

    if (
        body.actualProgressDay === undefined ||
        body.actualProgressDay < 0
    ) {
        errors.push("actualProgressDay must be a positive number");
    }

    if (
        body.actualStartDate &&
        isNaN(new Date(body.actualStartDate))
    ) {
        errors.push("Invalid actualStartDate");
    }

    if (
        body.actualEndDate &&
        isNaN(new Date(body.actualEndDate))
    ) {
        errors.push("Invalid actualEndDate");
    }

    return errors;
};



export const createProgressReport = async (req, res) => {
    try {
        const errors = validateProgressBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                errors,
            });
        }
        const report = await EngineerProgressReport.create({
            ...req.body,
            submittedBy: req.user._id,
        });
        const phaseId = req.body.phaseId;
        const completion = req.body.actualCompletionPercent;
        if (phaseId && completion !== undefined) {
            const phaseObjectId = new mongoose.Types.ObjectId(phaseId);
            await EngineerReocord.updateOne(
                { _id: req.user._id },
                {
                    $set: {
                        "developmentProjectList.documents.$[].phases.$[phase].CompletionPercentage":
                            completion,
                        "developmentProjectList.logic.$[].phases.$[phase].CompletionPercentage":
                            completion,
                        "developmentProjectList.scada.$[].phases.$[phase].CompletionPercentage":
                            completion,
                        "developmentProjectList.testing.$[].phases.$[phase].CompletionPercentage":
                            completion,
                    },
                },
                {
                    arrayFilters: [{ "phase._id": phaseObjectId }],
                }
            );
        }
        return res.status(201).json({
            success: true,
            message: "Progress report created and phase updated successfully",
            data: report,
        });
    } catch (err) {
        console.error("Create Progress Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create progress report",
        });
    }
};

export const getProgressBySection = async (req, res) => {
    try {
        const { phaseId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(phaseId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid phaseId",
            });
        }

        const reports = await EngineerProgressReport
            .find({ phaseId })
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: reports.length,
            data: reports,
        });
    } catch (err) {
        console.error("Fetch Section Progress Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch progress reports",
        });
    }
};

export const getProgressByProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid projectId",
            });
        }

        const reports = await EngineerProgressReport
            .find({ projectId })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: reports,
        });
    } catch (err) {
        console.error("Fetch Project Progress Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project progress",
        });
    }
};

export const getProgressById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid progress report id",
            });
        }

        const report = await EngineerProgressReport.findById(id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Progress report not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: report,
        });
    } catch (err) {
        console.error("Fetch Progress Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch progress report",
        });
    }
};

export const updateProgressReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid progress report id",
            });
        }

        const errors = validateProgressBody(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const updated = await EngineerProgressReport.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: "Progress report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Progress report updated successfully",
            data: updated,
        });
    } catch (err) {
        console.error("Update Progress Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to update progress report",
        });
    }
};

export const deleteProgressReport = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid progress report id",
            });
        }

        const deleted = await EngineerProgressReport.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Progress report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Progress report deleted successfully",
        });
    } catch (err) {
        console.error("Delete Progress Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to delete progress report",
        });
    }
};

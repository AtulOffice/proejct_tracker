import mongoose from "mongoose";
import EndChecklistsModel from "../models/endCheckList.js";
import ProjectModel from "../models/Project.model.js";

export const saveEndChecklist = async (req, res) => {
  try {
    const data = req.body;

    if (!data?.projectId || !mongoose.Types.ObjectId.isValid(data.projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing projectId",
      });
    }
    if (
      data?.submittedBy &&
      !mongoose.Types.ObjectId.isValid(data.submittedBy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid submittedBy user ID",
      });
    }

    const existingChecklist = await EndChecklistsModel.findOne({
      projectId: data.projectId,
    });

    if (!existingChecklist) {
      const newChecklist = await EndChecklistsModel.create(data);

      await ProjectModel.findByIdAndUpdate(
        data.projectId,
        { EndChecklisttId: newChecklist._id },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        message: "End Checklist created successfully",
        data: newChecklist,
      });
    }

    const updatedChecklist = await EndChecklistsModel.findByIdAndUpdate(
      existingChecklist._id,
      data,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "End Checklist updated successfully",
      data: updatedChecklist,
    });
  } catch (error) {
    console.error("❌ Error saving end checklist:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save end checklist",
      error: error.message,
    });
  }
};

export const getAllEndChecklists = async (req, res) => {
  try {
    const checklists = await EndChecklistsModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: checklists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch end checklists",
      error: error.message,
    });
  }
};

export const getEndChecklistByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    const checklist = await EndChecklistsModel.findOne({ projectId });

    if (!checklist) {
      return res.status(200).json({
        success: false,
        message: "No end checklist found for this project",
      });
    }

    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch end checklist",
      error: error.message,
    });
  }
};

export const getEndChecklistById = async (req, res) => {
  try {
    const { checklistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Checklist ID",
      });
    }

    const checklist = await EndChecklistsModel.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "End checklist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch end checklist",
      error: error.message,
    });
  }
};

export const updateEndChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Checklist ID",
      });
    }

    const updated = await EndChecklistsModel.findByIdAndUpdate(
      checklistId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "End checklist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "End checklist updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update end checklist",
      error: error.message,
    });
  }
};

export const deleteEndChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Checklist ID",
      });
    }

    const deleted = await EndChecklistsModel.findByIdAndDelete(checklistId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "End checklist not found",
      });
    }
    await ProjectModel.findByIdAndUpdate(
      deleted.projectId,
      { EndChecklistId: null },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "End checklist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete end checklist",
      error: error.message,
    });
  }
};

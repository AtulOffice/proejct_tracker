import mongoose from "mongoose";
import StartChecklistsModel from "../models/startCheck.model.js";
import ProjectModel from "../models/Project.model.js";

export const saveStartChecklist = async (req, res) => {
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
    const existingChecklist = await StartChecklistsModel.findOne({
      projectId: data.projectId,
    });
    if (!existingChecklist) {
      const newChecklist = await StartChecklistsModel.create(data);

      await ProjectModel.findByIdAndUpdate(
        data.projectId,
        { StartChecklisttId: newChecklist._id },
        { new: true }
      );

      return res.status(201).json({
        success: true,
        message: "Start Checklist created successfully",
        data: newChecklist,
      });
    }
    const updatedChecklist = await StartChecklistsModel.findByIdAndUpdate(
      existingChecklist._id,
      data,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Start Checklist updated successfully",
      data: updatedChecklist,
    });
  } catch (error) {
    console.error("❌ Error creating/updating checklist:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to save checklist",
      error: error.message,
    });
  }
};

export const getAllStartChecklists = async (req, res) => {
  try {
    const checklists = await StartChecklistsModel.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      data: checklists,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch checklists",
      error: error.message,
    });
  }
};

export const getChecklistByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }
    const checklist = await StartChecklistsModel.findOne({ projectId });
    if (!checklist) {
      return res.status(200).json({
        success: false,
        message: "Checklist not found for this project",
      });
    }
    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch checklist",
      error: error.message,
    });
  }
};

export const getStartChecklistById = async (req, res) => {
  try {
    const { checklistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Checklist ID",
      });
    }

    const checklist = await StartChecklistsModel.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    res.status(200).json({
      success: true,
      data: checklist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch checklist",
      error: error.message,
    });
  }
};

export const updateStartChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Checklist ID",
      });
    }

    const updated = await StartChecklistsModel.findByIdAndUpdate(
      checklistId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Checklist updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update checklist",
      error: error.message,
    });
  }
};

export const deleteStartChecklist = async (req, res) => {
  try {
    const { checklistId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(checklistId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Checklist ID",
      });
    }
    const checklist = await StartChecklistsModel.findById(checklistId);

    if (!checklist) {
      return res.status(404).json({
        success: false,
        message: "Checklist not found",
      });
    }

    await StartChecklistsModel.findByIdAndDelete(checklistId);
    if (checklist.projectId) {
      await ProjectModel.findByIdAndUpdate(checklist.projectId, {
        StartChecklisttId: null,
      });
    }

    res.status(200).json({
      success: true,
      message: "Checklist deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete checklist",
      error: error.message,
    });
  }
};

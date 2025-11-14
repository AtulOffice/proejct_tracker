import mongoose from "mongoose";
import EngineerReocord from "../models/engineers..model.js";
import ProjectModel from "../models/Project.model.js";
import workStatusModel from "../models/WorkStatus.model.js";
import workStratuModel from "../models/WorkStatus.model.js";

export const WrkStatusSave = async (req, res) => {
  try {
    const {
      jobNumber,
      projectName,
      location,
      statusStartDate,
      statusEndDate,
      currentEngineerName,
      workstatus,
      ProjectId,
      submittedBy,
    } = req.body;

    if (!jobNumber || !projectName || !currentEngineerName) {
      return res.status(400).json({
        success: false,
        message: "Job Number, Project Name, and Engineer Name are required.",
      });
    }

    if (!statusStartDate || !statusEndDate) {
      return res.status(400).json({
        success: false,
        message: "Start and End dates are required.",
      });
    }

    if (new Date(statusStartDate) > new Date(statusEndDate)) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be after End date.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(ProjectId) ||
      !mongoose.Types.ObjectId.isValid(submittedBy)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid ProjectId or submittedBy.",
      });
    }

    const RelatedProject = await ProjectModel.findById(ProjectId);
    const engineer = await EngineerReocord.findById(submittedBy);

    if (!RelatedProject || !engineer) {
      return res.status(400).json({
        success: false,
        message: "Project or Engineer not found.",
      });
    }
    const newWorkStatus = await workStratuModel.create({
      jobNumber,
      projectName,
      location,
      EngineerName: currentEngineerName,
      fromDate: statusStartDate,
      toDate: statusEndDate,
      WorkStatus: workstatus,
      ProjectDetails: ProjectId,
      submittedBy,
    });

    await ProjectModel.findByIdAndUpdate(ProjectId, {
      $addToSet: { workStatusRecords: newWorkStatus._id },
    });

    await EngineerReocord.findByIdAndUpdate(submittedBy, {
      $addToSet: { workStatusRecords: newWorkStatus._id },
    });

    return res.status(201).json({
      success: true,
      message: `Work status added successfully for Job Number ${jobNumber}.`,
      workStatusId: newWorkStatus._id,
      project: {
        id: RelatedProject._id,
        name: RelatedProject.projectName,
      },
      engineer: {
        id: engineer._id,
        name: engineer.name,
      },
      data: newWorkStatus,
    });
  } catch (error) {
    console.log("ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving work status.",
      error: error.message,
    });
  }
};

export const getAllWorkStatus = async (req, res) => {
  try {
    const statuses = await workStratuModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "data fetches successfully",
      data: statuses,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getWorkStatusById = async (req, res) => {
  try {
    const status = await workStratuModel.findById(req.params.id);
    if (!status)
      return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({
      success: true,
      message: "data fetches successfully",
      data: status,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const updateWorkStatus = async (req, res) => {
  try {
    const updated = await workStratuModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({
      success: true,
      message: "data update successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const deleteWorkStatus = async (req, res) => {
  try {
    // ❌ TEMPORARY DELETE LOCK
    if (true) {
      return res.status(400).json({
        success: false,
        message: "Delete operation is temporarily disabled by developer.",
      });
    }

    const workStatusId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(workStatusId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid WorkStatus Id.",
      });
    }

    const foundRecord = await workStratuModel.findById(workStatusId);
    if (!foundRecord) {
      return res.status(404).json({
        success: false,
        message: "Work status not found.",
      });
    }

    const projectId = foundRecord.ProjectDetails;
    const engineerId = foundRecord.submittedBy;

    await workStratuModel.findByIdAndDelete(workStatusId);

    if (projectId) {
      await ProjectModel.findByIdAndUpdate(projectId, {
        $pull: { workStatusRecords: workStatusId },
      });
    }

    if (engineerId) {
      await EngineerReocord.findByIdAndUpdate(engineerId, {
        $pull: { workStatusRecords: workStatusId },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Work status deleted successfully.",
      removedFrom: {
        project: projectId || null,
        engineer: engineerId || null,
      },
    });
  } catch (err) {
    console.log("Delete Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

export const workStatusPegination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;
  try {
    let data = [];
    let total = 0;

    if (!search) {
      data = await workStatusModel
        .find()
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await workStatusModel.countDocuments();
    } else {
      const result = await workStatusModel.findOne({
        jobNumber: { $regex: new RegExp(`^${search}$`, "i") },
      });

      if (result) {
        data = [result];
        total = 1;
      } else {
        data = [];
        total = 0;
      }
    }
    return res.json({
      success: true,
      message: "data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const workStatusPaginationByEngineer = async (req, res) => {
  try {
    const engineerId = req.params.engineerId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    if (!mongoose.Types.ObjectId.isValid(engineerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid engineer ID.",
      });
    }

    const engineer = await EngineerReocord.findById(engineerId).populate(
      "workStatusRecords"
    );

    if (!engineer) {
      return res.status(404).json({
        success: false,
        message: "Engineer not found.",
      });
    }

    let records = engineer.workStatusRecords;

    if (search) {
      const regex = new RegExp(search, "i");
      records = records.filter((ws) => regex.test(ws.jobNumber));
    }

    const totalItems = records.length;
    const totalPages = Math.ceil(totalItems / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedRecords = records
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(startIndex, endIndex);

    return res.json({
      success: true,
      message: "Engineer work status fetched successfully.",
      engineer: {
        id: engineer._id,
        name: engineer.name,
      },
      currentPage: page,
      totalPages,
      totalItems,
      data: paginatedRecords,
    });
  } catch (err) {
    console.log("Pagination Error:", err.message);
    return res.status(500).json({
      success: false,
      error: err.message || "Server error",
    });
  }
};

import ProjectModel from "../models/Project.model.js";
import workStatusModel from "../models/WorkStatus.model.js";
import workStratuModel from "../models/WorkStatus.model.js";

export const WrkStatusSave = async (req, res) => {
  const {
    workstatus,
    projectName,
    jobNumber,
    location,
    statusStartDate,
    statusEndDate,
    currentEngineerName,
    soType,
    ExpensSubmission,
    BackupSubmission,
    EndChecklist,
    StartChecklist,
    ...otheData
  } = req.body;
  try {
    const RelatedProject = await ProjectModel.findOne({
      jobNumber: jobNumber,
    });

    if (!RelatedProject) {
      return res.status(400).json({
        success: false,
        message: "this project is not running or not valid",
      });
    }
    const data = await workStratuModel.create({
      jobNumber,
      projectName,
      soType,
      location,
      EngineerName: currentEngineerName,
      fromDate: statusStartDate,
      toDate: statusEndDate,
      WorkStatus: workstatus,
      ExpensSubmission,
      BackupSubmission,
      EndChecklist,
      StartChecklist,
    });
    return res.status(201).json({
      success: true,
      message: `data created successfully with ${req.body.jobNumber} `,
      data,
    });
  } catch (e) {
    console.log(e?.message);
    return res.status(400).json({ success: false, message: e.message });
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
    const deleted = await workStratuModel.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ success: false, error: "Not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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

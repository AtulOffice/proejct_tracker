import ProjectModel from "../models/Project.model.js";
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
    engineerName,
    entityType,
    client,
    visitDate,
    visitendDate,
    momDate,
    momsrNo,
    endUser,
    orderNumber,
    orderDate,
    daysspendsite,
    startDate,
    endDate,
    duration,
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
    });
    return res.status(201).json({
      success: true,
      message: `data created successfully with ${req.body.jobNumber} `,
      data,
    });
  } catch (e) {
    console.log(e.message);
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
    if (!status) return res.status(404).json({ error: "Not found" });
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

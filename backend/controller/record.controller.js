import ProjectModel from "../models/Project.model.js";

export const Recordsformave = async (req, res) => {
  try {
    const {
      projectName,
      engineerName,
      entityType,
      finalMomnumber,
      actualStartDate,
      actualEndDate,
      soType,
      client,
      jobNumber,
      bill,
      dueBill,
      BillNotice,
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
      description,
      location,
      status,
      priority,
      duration,
      service,
      workScope,
      expenseScope,
      supplyStatus,
      deleveryDate,
      requestDate,
      checklistStatus,
      actualVisitDuration,
    } = req.body;

    const ExistanceData = await ProjectModel.findOne({ jobNumber });
    if (ExistanceData) {
      return res
        .status(400)
        .json({ success: false, message: "Job number is  already stored" });
    }
    const data = await ProjectModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "data saved successfully",
      data,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

export const findrecord = async (req, res) => {
  try {
    const data = await ProjectModel.find();
    return res.status(200).json({
      success: true,
      message: "data fetch successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "error while fetching data",
    });
  }
};

export const updateRecords = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const updatedData = await ProjectModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await ProjectModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedRecord.projectName,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while deleting the record",
    });
  }
};

export const Pagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const skip = (page - 1) * limit;

  try {
    const data = await ProjectModel.find()
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await ProjectModel.countDocuments();

    return res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

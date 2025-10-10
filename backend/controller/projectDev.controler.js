import ProjectDevModel from "../models/Project.Dev.model.js";
import ProjectModel from "../models/Project.model.js";

export const ProjectStatusSave = async (req, res) => {
  try {
    const data = req.body;

    const { JobNumber } = data;
    if (!JobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "JobNumber is required" });
    }
    const isprojectExist = await ProjectModel.findOne({ jobNumber: JobNumber });
    if (!isprojectExist) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    const existingProject = await ProjectDevModel.findOne({ JobNumber });
    if (existingProject) {
      return res
        .status(400)
        .json({ success: false, message: "Project status already exists" });
    }
    const savestatus = await ProjectDevModel.create(data);
    res
      .status(200)
      .json({ success: true, message: "Project status saved successfully" });
  } catch (error) {
    console.error("Error saving project status:", error);
    res.status(500).json({ success: false, message: "Some thing went wrong" });
  }
};

export const ProjectStatusfetchbyJobnumber = async (req, res) => {
  try {
    const { JobNumber } = req.params;
    if (!JobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "JobNumber is required" });
    }
    const projectStatus = await ProjectDevModel.findOne({ JobNumber });
    if (!projectStatus) {
      return res
        .status(404)
        .json({ success: false, message: "Project status not found" });
    }
    res.status(200).json({
      success: true,
      message: "Project status fetched successfully",
      data: projectStatus,
    });
  } catch (error) {
    console.error("Error fetching project status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const isProjectstatusExistFun = async (req, res) => {
  try {
    const { JobNumber } = req.params;

    if (!JobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "JobNumber is required" });
    }

    const projectStatus = await ProjectDevModel.findOne({ JobNumber });

    if (!projectStatus) {
      return res.status(200).json({
        success: false,
        exists: false,
        message: "Project status does not exist",
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      message: "Project status exists",
    });
  } catch (error) {
    console.error("Error checking project existence:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const isProjectExistFun = async (req, res) => {
  try {
    const { JobNumber } = req.params;

    if (!JobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "JobNumber is required" });
    }

    const projectStatus = await ProjectModel.findOne({
      jobNumber: JobNumber,
      Development: true,
    });
    if (!projectStatus) {
      return res.status(200).json({
        success: false,
        exists: false,
        message: "Project not under development",
      });
    }

    return res.status(200).json({
      success: true,
      exists: true,
      message: "project under development",
    });
  } catch (error) {
    console.error("Error checking project existence:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const ProjectStatusfetchbyId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id is required" });
    }
    const projectStatus = await ProjectDevModel.findOne({ _id: id });
    if (!projectStatus) {
      return res
        .status(404)
        .json({ success: false, message: "Project status not found" });
    }
    res.status(200).json({
      success: true,
      message: "Project status fetched successfully",
      data: projectStatus,
    });
  } catch (error) {
    console.error("Error fetching project status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const PaginationStatus = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;
  try {
    let data = [];
    let total = 0;

    if (!search) {
      data = await ProjectDevModel.find()
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectDevModel.countDocuments();
    } else {
      const result = await ProjectDevModel.findOne({
        JobNumber: { $regex: new RegExp(`^${search}$`, "i") },
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
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const PaginationStatusprog = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const statusprogress = req.query.statusprog || "";
  const skip = (page - 1) * limit;

  try {
    let query = {};

    if (statusprogress && statusprogress !== "ALL") {
      query.statusprogress = statusprogress;
    }

    if (search) {
      query.JobNumber = { $regex: new RegExp(`^${search}$`, "i") };
    }

    const data = await ProjectDevModel.find(query)
      .sort({ updatedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProjectDevModel.countDocuments(query);

    return res.json({
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const allProjectStatusfetch = async (req, res) => {
  try {
    const projectStatus = await ProjectDevModel.find();
    if (!projectStatus) {
      return res
        .status(404)
        .json({ success: false, message: "Project status not found" });
    }
    res.status(200).json({
      message: "Project status fetched successfully",
      success: true,
      data: projectStatus,
    });
  } catch (error) {
    console.error("Error fetching project status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const projectDevStatusUpdate = async (req, res) => {
  try {
    const { JobNumber } = req.params;
    const updateData = req.body;
    if (!JobNumber || !updateData) {
      return res.status(400).json({
        success: false,
        message: "JobNumber and update data are required",
      });
    }
    const updatedProject = await ProjectDevModel.findOneAndUpdate(
      { JobNumber },
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project status not found" });
    }

    res.status(200).json({
      status: true,
      message: "Project status updated successfully",
      updatedProject,
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const projectDevStatusUpdatebyId = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (!updateData) {
      return res.status(400).json({
        success: false,
        message: "JobNumber and update data are required",
      });
    }
    const updatedProject = await ProjectDevModel.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project status not found" });
    }

    res.status(200).json({
      success: true,
      message: "Project status updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    console.error("Error updating project status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const projectDevStatusDelete = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "id is required" });
    }
    const deletedProject = await ProjectDevModel.findOneAndDelete({ _id: id });
    if (!deletedProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project status not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Project status deleted successfully" });
  } catch (error) {
    console.error("Error deleting project status:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

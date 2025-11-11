import ProjectDevModel from "../models/Project.Dev.model.js";
import ProjectModel from "../models/Project.model.js";

export const ProjectStatusSave = async (req, res) => {
  try {
    const data = req.body;
    const { jobNumber } = data;
    if (!jobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "jobNumber is required" });
    }
    const existingProject = await ProjectModel.findOne({
      jobNumber: jobNumber,
    });
    if (!existingProject) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    let projectDev = await ProjectDevModel.findOne({ jobNumber });

    if (projectDev) {
      projectDev = await ProjectDevModel.findByIdAndUpdate(
        projectDev._id,
        {
          ...data,
          projectName: existingProject.projectName,
          ProjectDetails: existingProject._id,
          devScope: existingProject.Development,
        },
        { new: true }
      );
    } else {
      projectDev = await ProjectDevModel.create({
        ...data,
        projectName: existingProject.projectName,
        ProjectDetails: existingProject._id,
        devScope: existingProject.Development,
      });
    }

    await ProjectModel.findByIdAndUpdate(existingProject._id, {
      DevelopmentDetails: projectDev._id,
    });
    res.status(200).json({
      success: true,
      message: "Project status saved successfully",
      data: projectDev,
    });
  } catch (error) {
    console.error("Error saving project status:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const isProjectstatusExistFun = async (req, res) => {
  try {
    const { jobNumber } = req.params;
    const check = req.query.check === "true";

    if (!jobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "jobNumber is required" });
    }

    const projectStatus = await ProjectDevModel.findOne({ jobNumber });
    const projectParent = await ProjectModel.findOne({
      jobNumber: jobNumber,
      Development: { $in: ["OFFICE", "SITE"] },
    });

    if (check) {
      if (!projectStatus) {
        return res.status(200).json({
          success: false,
          exists: false,
          message: "Project not under development",
        });
      }
    } else {
      if (!projectStatus || !projectParent) {
        return res.status(200).json({
          success: false,
          exists: false,
          message: "Project not under development or not valid",
        });
      }
    }
    return res.status(200).json({
      success: true,
      exists: true,
      message: "Project status exists",
    });
  } catch (error) {
    console.error("Error checking project existence:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const ProjectStatusfetchbyJobId = async (req, res) => {
  try {
    const { jobNumber } = req.params;
    if (!jobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "jobNumber is required" });
    }
    const projectStatus = await ProjectDevModel.findOne({
      jobNumber,
    }).populate({
      path: "PlanDetails",
      select: "scada logic testing documents",
    });
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
      query.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
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
    const { jobNumber } = req.params;
    const updateData = req.body;
    if (!jobNumber || !updateData) {
      return res.status(400).json({
        success: false,
        message: "jobNumber and update data are required",
      });
    }
    const updatedProject = await ProjectDevModel.findOneAndUpdate(
      { jobNumber },
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

export const projectDevStatusDelete = async (req, res) => {
  try {
    const { id } = req.params;
    if (true) {
      return res.status(400).json({
        success: false,
        message: "delete operation is closed by developer temperory",
      });
    }
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

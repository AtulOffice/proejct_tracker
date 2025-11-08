import PlanningModel from "../models/dev.Planning.model.js";
import ProjectDevModel from "../models/Project.Dev.model.js";
import ProjectModel from "../models/Project.model.js";

export const PlanningSave = async (req, res) => {
  try {
    const data = req.body;
    const { JobNumber, useId, projectId } = data;
    console.log(req.body);
    if (!JobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "JobNumber is required" });
    }
    const existingProject = await ProjectModel.findById(projectId);

    let isExistprojectDev = await ProjectDevModel.findOne({ JobNumber });
    console.log(isExistprojectDev);

    if (!existingProject) {
      console.log("this loop is executed");
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    let Planning = await PlanningModel.findOne({ ProjectDetails: projectId });
    if (Planning) {
      Planning = await PlanningModel.findByIdAndUpdate(
        Planning._id,
        {
          ...data,
          projectName: existingProject.projectName,
          ProjectDetails: existingProject._id,
          DevelopmentDetials: isExistprojectDev._id,
          upatedBy: useId,
          devScope: existingProject.Development,
        },
        { new: true }
      );
    } else {
      Planning = await PlanningModel.create({
        ...data,
        projectName: existingProject.projectName,
        ProjectDetails: existingProject._id,
        DevelopmentDetials: isExistprojectDev._id,
        upatedBy: useId,
        devScope: existingProject.Development,
      });
    }

    await ProjectModel.findByIdAndUpdate(existingProject._id, {
      PlanDetails: Planning._id,
    });
    await ProjectDevModel.findByIdAndUpdate(isExistprojectDev._id, {
      PlanDetails: Planning._id,
    });
    res.status(200).json({
      success: true,
      message: "Project status saved successfully",
      data: Planning,
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

export const getPlanningbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const planning = await PlanningModel.findById(id).populate({
      path: "upatedBy",
      select: "username",
    });
    if (!planning) {
      return res.status(404).json({
        success: false,
        message: "No Plan found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "plan fetched successufully",
      data: planning,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching data",
      error: error.message,
    });
  }
};

import mongoose from "mongoose";
import PlanningModel from "../models/dev.Planning.model.js";
import ProjectDevModel from "../models/Project.Dev.model.js";
import ProjectModel from "../models/Project.model.js";
import EngineerReocord from "../models/engineers..model.js";

export const PlanningSave = async (req, res) => {
  try {
    const { useId, projectId, formDevbackData, ...restData } = req.body;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Project ID" });
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    let projectDev =
      (project.DevelopmentDetials &&
        (await ProjectDevModel.findByIdAndUpdate(
          project.DevelopmentDetials,
          {
            ...formDevbackData,
            jobNumber: project.jobNumber,
            startDate: restData?.documents?.startDate,
          },
          { new: true }
        ))) ||
      (await ProjectDevModel.create({
        ...formDevbackData,
        jobNumber: project.jobNumber,
        startDate: restData?.documents?.startDate,
      }));

    const planData = {
      ...restData,
      DevelopmentDetials: projectDev._id,
      updatedBy: useId,
    };

    let planning =
      project.PlanDetails && (await PlanningModel.findById(project.PlanDetails))
        ? await PlanningModel.findByIdAndUpdate(project.PlanDetails, planData, {
            new: true,
          })
        : await PlanningModel.create({
            ...planData,
            projectName: project.projectName,
            ProjectDetails: project._id,
            DevelopmentDetials: projectDev._id,
            jobNumber: project.jobNumber,
            devScope: project.Development,
            createdBy: useId,
          });
    await ProjectModel.findByIdAndUpdate(project._id, {
      PlanDetails: planning._id,
      DevelopmentDetials: projectDev._id,
      isPlanRecord: true,
    });
    await ProjectDevModel.findByIdAndUpdate(projectDev._id, {
      PlanDetails: planning._id,
    });

    const sectionNames = ["documents", "logic", "scada", "testing"];

    const engineersBySection = {};
    sectionNames.forEach((section) => {
      const sectionData = planning?.[section] || {};
      const engineers = Array.isArray(sectionData.engineers)
        ? sectionData.engineers
        : [];
      engineersBySection[section] = {
        engineers,
        startDate: sectionData.startDate || null,
        endDate: sectionData.endDate || null,
      };
    });

    const allEngineers = [
      ...new Set(
        sectionNames.flatMap((section) => engineersBySection[section].engineers)
      ),
    ];

    await Promise.all(
      allEngineers.map(async (engineerId) => {
        const engineer = await EngineerReocord.findById(engineerId);
        if (!engineer) return;

        for (const section of sectionNames) {
          const { engineers, startDate, endDate } = engineersBySection[section];
          const isInSection = engineers.includes(engineerId);

          if (!isInSection) continue;
          engineer.developmentProjectList[section] =
            engineer.developmentProjectList[section] || [];

          const existingIndex = engineer.developmentProjectList[
            section
          ].findIndex(
            (entry) => entry.project.toString() === project._id.toString()
          );
          if (existingIndex !== -1) {
            const existing = engineer.developmentProjectList[section].splice(
              existingIndex,
              1
            )[0];

            engineer.developmentProjectList[section].push({
              project: existing.project,
              startDate: startDate || existing.startDate,
              endDate: endDate || existing.endDate,
            });
          } else {
            engineer.developmentProjectList[section].push({
              project: project._id,
              startDate,
              endDate,
            });
          }
        }
        await engineer.save();
      })
    );
    return res.status(200).json({
      success: true,
      message: project.PlanDetails
        ? "Project planning saved successfully"
        : "Project planning created successfully",
      data: planning,
    });
  } catch (error) {
    console.error("❌ Error saving project planning:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving planning",
      error: error.message,
    });
  }
};

export const getPlanningbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const planning = await PlanningModel.findById(id).populate({
      path: "updatedBy",
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

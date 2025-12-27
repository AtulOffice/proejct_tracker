import mongoose from "mongoose";
import PlanningModel from "../models/dev.Planning.model.js";
import ProjectDevModel from "../models/Project.Dev.model.js";
import ProjectModel from "../models/Project.model.js";
import EngineerReocord from "../models/engineers..model.js";

export const PlanningSave = async (req, res) => {
  try {
    const { userId, projectId, formDevbackData, ...restData } = req.body;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }


    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }
    const firstPlanBlock = restData?.plans?.[0] || {};
    const firstDocStartDate = firstPlanBlock?.documents?.[0]?.startDate || null;

    let projectDev =
      (project.DevelopmentDetials &&
        (await ProjectDevModel.findByIdAndUpdate(
          project.DevelopmentDetials,
          {
            jobNumber: project.jobNumber,
            startDate: firstDocStartDate,
          },
          { new: true }
        ))) ||
      (await ProjectDevModel.create({
        ...formDevbackData,
        jobNumber: project.jobNumber,
        startDate: firstDocStartDate,
      }));

    const planData = {
      ...restData,
      DevelopmentDetials: projectDev._id,
      updatedBy: userId,
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
          createdBy: userId,
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
    const phasesBySection = {
      documents: [],
      logic: [],
      scada: [],
      testing: [],
    };
    const allPlans = Array.isArray(planning?.plans) ? planning.plans : [];
    const totalPlans = allPlans.length;
    allPlans.forEach((planBlock, planIndex) => {
      sectionNames.forEach((section) => {
        const items = Array.isArray(planBlock[section]) ? planBlock[section] : [];
        items.forEach((phase) => {
          phasesBySection[section].push({
            phaseIndex: planIndex,
            totalPhases: totalPlans,
            sectionName: phase.sectionName || "",
            sectionStartDate: phase.sectionStartDate
              ? new Date(phase.sectionStartDate)
              : null,
            sectionEndDate: phase.sectionEndDate
              ? new Date(phase.sectionEndDate)
              : null,
            startDate: phase.startDate ? new Date(phase.startDate) : null,
            endDate: phase.endDate ? new Date(phase.endDate) : null,
            phaseEngineers: Array.isArray(phase.engineers)
              ? phase.engineers.map((e) => e.toString())
              : [],
            peerEngineers: [],
          });
        });
      });
    });

    sectionNames.forEach((section) => {
      phasesBySection[section].forEach((phase) => {
        const peers = sectionNames.flatMap((otherSection) =>
          phasesBySection[otherSection]
            .filter((p) => p.phaseIndex === phase.phaseIndex)
            .flatMap((p) => p.phaseEngineers)
        );
        phase.peerEngineers = [...new Set(peers)];
      });
    });

    const previouslyAssignedEngineers = await EngineerReocord.find(
      {
        $or: sectionNames.map((sec) => ({
          [`developmentProjectList.${sec}.project`]: project._id,
        })),
      },
      { _id: 1 }
    );

    const allEngineers = [
      ...new Set(
        sectionNames.flatMap((section) =>
          phasesBySection[section].flatMap((p) => p.phaseEngineers)
        )
      ),
    ];
    planning.allEngineers = allEngineers;
    await planning.save();

    const engineerIdsToProcess = [
      ...new Set([
        ...allEngineers.map((id) => id.toString()),
        ...previouslyAssignedEngineers.map((e) => e._id.toString()),
      ]),
    ];

    // await Promise.all(
    //   allEngineers.map(async (engineerId) => {
    //     const engineer = await EngineerReocord.findById(engineerId);
    //     if (!engineer) return;

    //     for (const section of sectionNames) {
    //       const sectionPhases = phasesBySection[section];

    //       const engineerPhases = sectionPhases
    //         .filter((phase) => phase.phaseEngineers.includes(engineerId))
    //         .map((phase) => ({
    //           phaseIndex: phase.phaseIndex,
    //           totalPhases: phase.totalPhases,
    //           sectionName: phase.sectionName,
    //           sectionStartDate: phase.sectionStartDate,
    //           sectionEndDate: phase.sectionEndDate,
    //           startDate: phase.startDate,
    //           endDate: phase.endDate,
    //           engineers: phase.phaseEngineers,
    //           peerEngineers: phase.peerEngineers
    //         }));

    //       if (engineerPhases.length === 0) continue;

    //       engineer.developmentProjectList[section] =
    //         engineer.developmentProjectList[section] || [];

    //       const existingEntry =
    //         engineer.developmentProjectList[section].find(
    //           (entry) => entry.project.toString() === project._id.toString()
    //         );

    //       if (existingEntry) {
    //         existingEntry.phases = engineerPhases;
    //       } else {
    //         engineer.developmentProjectList[section].push({
    //           project: project._id,
    //           phases: engineerPhases,
    //         });
    //       }
    //     }
    //     await engineer.save();
    //   })
    // );

    await Promise.all(
      engineerIdsToProcess.map(async (engineerId) => {
        const engineer = await EngineerReocord.findById(engineerId);
        if (!engineer) return;
        sectionNames.forEach((sec) => {
          if (!engineer.developmentProjectList?.[sec]) return;
          engineer.developmentProjectList[sec] =
            engineer.developmentProjectList[sec].filter(
              (entry) =>
                entry.project.toString() !== project._id.toString()
            );
        });
        for (const section of sectionNames) {
          let sectionPhases = phasesBySection[section];
          if (section === "documents") {
            sectionPhases = phasesBySection.documents.map((docPhase) => {
              const derivedEngineers = ["logic", "scada", "testing"]
                .flatMap((sec) =>
                  phasesBySection[sec]
                    .filter((p) => p.phaseIndex === docPhase.phaseIndex)
                    .flatMap((p) => p.phaseEngineers)
                );
              return {
                ...docPhase,
                phaseEngineers: [...new Set(derivedEngineers)],
              };
            });
          }

          const engineerPhases = sectionPhases
            .filter((phase) => phase.phaseEngineers.includes(engineerId))
            .map((phase) => ({
              phaseIndex: phase.phaseIndex,
              totalPhases: phase.totalPhases,
              sectionName: phase.sectionName,
              sectionStartDate: phase.sectionStartDate,
              sectionEndDate: phase.sectionEndDate,
              startDate: phase.startDate,
              endDate: phase.endDate,
              engineers: phase.phaseEngineers,
              peerEngineers: phase.peerEngineers,
            }));
          if (engineerPhases.length === 0) continue;
          engineer.developmentProjectList[section] =
            engineer.developmentProjectList[section] || [];
          engineer.developmentProjectList[section].push({
            project: project._id,
            phases: engineerPhases,
          });
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

export const PlanningSaveOld = async (req, res) => {
  try {
    const { userId, projectId, formDevbackData, ...restData } = req.body;
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
      updatedBy: userId,
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
          createdBy: userId,
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

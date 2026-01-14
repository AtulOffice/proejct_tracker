import mongoose from "mongoose";
import PlanningModel from "../models/dev.Planning.model.js";
import ProjectDevModel from "../models/Project.Dev.model.js";
import ProjectModel from "../models/Project.model.js";
import EngineerReocord from "../models/engineers.model.js";

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
    // const phaseKey = (p) => `${p.phaseIndex}::${p.sectionName || ""}`;
    const phaseKey = (p) => `${p.phaseIndex}`;
    const sameDate = (a, b) => {
      if (!a && !b) return true;
      if (!a || !b) return false;
      return new Date(a).getTime() === new Date(b).getTime();
    };

    const sameArray = (a = [], b = []) => {
      if (a.length !== b.length) return false;
      const A = a.map(String).sort();
      const B = b.map(String).sort();
      return A.every((v, i) => v === B[i]);
    };

    await Promise.all(
      engineerIdsToProcess.map(async (engineerId) => {
        const engineer = await EngineerReocord.findById(engineerId);
        if (!engineer) return;

        let modified = false;

        for (const section of sectionNames) {
          let sectionPhases = phasesBySection[section];
          if (section === "documents") {
            sectionPhases = phasesBySection.documents.map((docPhase) => {
              const derivedEngineers = ["logic", "scada", "testing"].flatMap((sec) =>
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
            .filter((phase) => phase.phaseEngineers.includes(engineerId.toString()))
            .map((phase) => ({
              phaseIndex: phase.phaseIndex,
              totalPhases: phase.totalPhases,
              sectionName: phase.sectionName || "",
              sectionStartDate: phase.sectionStartDate || null,
              sectionEndDate: phase.sectionEndDate || null,
              startDate: phase.startDate || null,
              endDate: phase.endDate || null,
              engineers: (phase.phaseEngineers || []).map(String),
              peerEngineers: (phase.peerEngineers || []).map(String),
            }));

          engineer.developmentProjectList[section] =
            engineer.developmentProjectList[section] || [];
          let projectEntry = engineer.developmentProjectList[section].find(
            (entry) => entry.project.toString() === project._id.toString()
          );
          if (engineerPhases.length === 0) {
            if (projectEntry) {
              engineer.developmentProjectList[section] =
                engineer.developmentProjectList[section].filter(
                  (entry) => entry.project.toString() !== project._id.toString()
                );
              modified = true;
            }
            continue;
          }
          if (!projectEntry) {
            engineer.developmentProjectList[section].push({
              project: project._id,
              phases: engineerPhases.map((p) => ({
                ...p,
                CompletionPercentage: 0,
              })),
            });
            modified = true;
            continue;
          }
          const existingPhases = Array.isArray(projectEntry.phases)
            ? projectEntry.phases
            : [];
          const existingMap = new Map();
          existingPhases.forEach((p) => existingMap.set(phaseKey(p), p));

          const updatedPhases = [];

          for (const newP of engineerPhases) {
            const key = phaseKey(newP);
            const oldP = existingMap.get(key);

            if (oldP) {
              const changed =
                oldP.totalPhases !== newP.totalPhases ||
                (oldP.sectionName || "") !== (newP.sectionName || "") ||
                !sameDate(oldP.sectionStartDate, newP.sectionStartDate) ||
                !sameDate(oldP.sectionEndDate, newP.sectionEndDate) ||
                !sameDate(oldP.startDate, newP.startDate) ||
                !sameDate(oldP.endDate, newP.endDate) ||
                !sameArray(oldP.engineers, newP.engineers) ||
                !sameArray(oldP.peerEngineers, newP.peerEngineers);

              if (changed) {
                oldP.totalPhases = newP.totalPhases;
                oldP.sectionName = newP.sectionName;
                oldP.sectionStartDate = newP.sectionStartDate;
                oldP.sectionEndDate = newP.sectionEndDate;
                oldP.startDate = newP.startDate;
                oldP.endDate = newP.endDate;
                oldP.engineers = newP.engineers;
                oldP.peerEngineers = newP.peerEngineers;
                modified = true;
              }
              updatedPhases.push(oldP);
            } else {
              updatedPhases.push({
                ...newP,
                CompletionPercentage: 0,
              });
              modified = true;
            }
          }
          if (existingPhases.length !== updatedPhases.length) {
            modified = true;
          }
          projectEntry.phases = updatedPhases;
        }

        if (modified) {
          const data = await engineer.save();
          console.dir(data?.developmentProjectList?.logic, { depth: null });
        }
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

import mongoose from "mongoose";
import EngineerReocord from "../models/engineers..model.js";
import {
  deleteImageToGlobalServer,
  uploadImageToGlobalServer,
} from "../utils/imageUtils.js";
import ProjectModel from "../models/Project.model.js";

export const getAllProjectsEngineers = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Engineer ID" });
    }

    const engineer = await EngineerReocord.findById(id)
      .populate({
        path: "assignments.projectId",
        select: "_id location StartChecklist EndChecklist projectName client",
      })
      .lean();

    if (!engineer) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }
    const filteredAssignments = (engineer.assignments || []).filter(
      (assignment) => !(assignment.isMom || assignment.isFinalMom)
    );
    const lastFiveAssignments = filteredAssignments
      .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      engineerId: engineer._id,
      name: engineer.name,
      empId: engineer.empId,
      totalAssignments: filteredAssignments.length,
      lastFiveAssignments,
    });
  } catch (e) {
    console.error("Error fetching engineer project history:", e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching engineer data" });
  }
};

export const getAllProjectsEngineerswork = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Engineer ID" });
    }

    const engineer = await EngineerReocord.findById(id)
      .populate({
        path: "assignments.projectId",
        select: "_id location StartChecklist EndChecklist projectName client",
      })
      .lean();

    if (!engineer) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }
    const filteredAssignments = (engineer.assignments || []).filter(
      (assignment) => !assignment.isFinalMom
    );
    const lastFiveAssignments = filteredAssignments
      .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      engineerId: engineer._id,
      name: engineer.name,
      totalAssignments: filteredAssignments.length,
      lastFiveAssignments,
    });
  } catch (e) {
    console.error("Error fetching engineer project history:", e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching engineer data" });
  }
};

export const getAllProjectsEngineersshow = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Engineer ID" });
    }
    const engineer = await EngineerReocord.findById(id);
    if (!engineer) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }
    return res.status(200).json({
      success: true,
      name: engineer.name,
      totalAssignments: engineer?.assignments,
    });
  } catch (e) {
    console.error("Error fetching engineer project history:", e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching engineer data" });
  }
};

export const saveMomForEngineer = async (req, res) => {
  const uploadedUrls = [];
  try {
    const { engineerId } = req.params;
    const momData = req.body;

    if (!mongoose.Types.ObjectId.isValid(engineerId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Engineer ID" });
    }

    const engineer = await EngineerReocord.findById(engineerId);
    if (!engineer) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }

    if (!engineer.assignments || engineer.assignments.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No assignments found for this engineer.",
      });
    }

    const lastAssignment =
      engineer.assignments[engineer.assignments.length - 1];

    const isCurrentProj =
      lastAssignment?.engToprojObjectId?.toString() ===
      momData.assignmentDetails.engToprojObjectId;

    engineer.isAssigned = isCurrentProj ? false : engineer.isAssigned;

    if (momData.momDocuments?.length > 0) {
      for (const file of momData.momDocuments) {
        try {
          const base64Data = file.data.replace(/^data:\w+\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const uploadRes = await uploadImageToGlobalServer(
            buffer,
            file.name,
            "mom-documents"
          );

          if (!uploadRes || typeof uploadRes.url !== "string") {
            throw new Error("Invalid upload response — missing file URL");
          }

          uploadedUrls.push(uploadRes.url);
        } catch (uploadErr) {
          console.error(
            `❌ File upload failed: ${file.name} → ${uploadErr.message}`
          );
          for (const url of uploadedUrls) await deleteImageToGlobalServer(url);
          throw uploadErr;
        }
      }
    }

    const assignment = engineer.assignments.find(
      (a) =>
        a.engToprojObjectId?.toString() ===
        momData.assignmentDetails.engToprojObjectId
    );

    const project = await ProjectModel.findById(momData.projectId);

    if (!assignment || !project) {
      for (const url of uploadedUrls) await deleteImageToGlobalServer(url);
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found for this engineer or Project not found for this MOM record",
      });
    }

    const newStart = new Date(`${momData.siteStartDate}T00:00:00Z`);
    const newEnd = new Date(`${momData.siteEndDate}T00:00:00Z`);

    if (isNaN(newStart) || isNaN(newEnd)) {
      return res.status(400).json({
        success: false,
        message: "Invalid start or end date format",
      });
    }

    if (newEnd < newStart) {
      return res.status(400).json({
        success: false,
        message: "End date cannot be before start date",
      });
    }

    if (momData.isFinalMom) assignment.isFinalMom = true;
    assignment.isMom = true;
    assignment.momDocuments = uploadedUrls;

    assignment.assignedAt = newStart;
    assignment.endTime = newEnd;

    const diffMs = newEnd - newStart;
    assignment.durationDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const engineerDetail = project.EngineerDetails.find(
      (e) =>
        e.projToengObjectId?.toString() ===
        momData.assignmentDetails.engToprojObjectId
    );

    if (engineerDetail) {
      if (momData.isFinalMom) engineerDetail.isFinalMom = true;
      engineerDetail.isMom = true;
      engineerDetail.momDocuments = uploadedUrls;
      engineerDetail.assignedAt = newStart;
      engineerDetail.endTime = newEnd;

      const diffMsProj = newEnd - newStart;
      engineerDetail.durationDays = Math.ceil(
        diffMsProj / (1000 * 60 * 60 * 24)
      );
    }

    await Promise.all([engineer.save(), project.save()]);

    return res.status(200).json({
      success: true,
      message:
        "✅ MOM saved successfully (dates, durations, and flags synced in both models)",
      urls: uploadedUrls,
    });
  } catch (err) {
    console.error("❌ Error saving MOM:", err.message);
    for (const url of uploadedUrls) await deleteImageToGlobalServer(url);
    return res.status(500).json({
      success: false,
      message: "Error saving MOM data",
      error: err.message,
    });
  }
};


export const getAllDocumentsDevelopmentData = async (req, res) => {
  try {
    const data = await EngineerReocord.findById(
      req.user?._id,
      {
        "developmentProjectList.documents": 1,
        name: 1,
        email: 1,
      }
    )
      .populate("developmentProjectList.documents.project", "projectName jobNumber service visitDate location OrderMongoId CustomerDevDocuments SIEVPLDevDocuments dispatchDocuments")
      .populate(
        "developmentProjectList.documents.phases.engineers",
        "name email"
      )
      .populate(
        "developmentProjectList.documents.phases.peerEngineers",
        "name email"
      );

    res.status(200).json({ success: true, message: "Documents retrieved successfully", data: data?.developmentProjectList.documents });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getLogicDevelopmentData = async (req, res) => {
  try {
    const engineer = await EngineerReocord.findById(
      req.user?._id,
      { "developmentProjectList.logic": 1 }
    )
      .populate("developmentProjectList.logic.project", "projectName jobNumber service visitDate location OrderMongoId  CustomerDevDocuments SIEVPLDevDocuments dispatchDocuments")
      .populate("developmentProjectList.logic.phases.engineers", "name email")
      .populate("developmentProjectList.logic.phases.peerEngineers", "name email");

    if (!engineer) {
      return res.status(404).json({ success: false, message: "Engineer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Logic retrieved successfully",
      data: engineer.developmentProjectList?.logic || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getScadaDevelopmentData = async (req, res) => {
  try {
    const engineer = await EngineerReocord.findById(
      req.user?._id,
      { "developmentProjectList.scada": 1 }
    )
      .populate("developmentProjectList.scada.project", "projectName jobNumber service visitDate location OrderMongoId CustomerDevDocuments SIEVPLDevDocuments dispatchDocuments")
      .populate("developmentProjectList.scada.phases.engineers", "name email")
      .populate("developmentProjectList.scada.phases.peerEngineers", "name email");

    if (!engineer) {
      return res.status(404).json({ success: false, message: "Engineer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Scada retrieved successfully",
      data: engineer.developmentProjectList?.scada || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getTestingDevelopmentData = async (req, res) => {
  try {
    const engineer = await EngineerReocord.findById(
      req.user?._id,
      { "developmentProjectList.testing": 1 }
    )
      .populate("developmentProjectList.testing.project", "projectName jobNumber service visitDate location OrderMongoId CustomerDevDocuments SIEVPLDevDocuments dispatchDocuments")
      .populate("developmentProjectList.testing.phases.engineers", "name email")
      .populate("developmentProjectList.testing.phases.peerEngineers", "name email");

    if (!engineer) {
      return res.status(404).json({ success: false, message: "Engineer not found" });
    }

    res.status(200).json({
      success: true, message: "Testing retrieved successfully",
      data: engineer.developmentProjectList?.testing || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// for section


export const getLogicPhaseById = async (req, res) => {
  try {
    const phaseId = req.params.id;
    const engineerId = req.user?._id;

    if (!engineerId || !phaseId) {
      return res.status(400).json({
        success: false,
        message: "engineerId and phaseId are required",
      });
    }

    const engineerObjectId = new mongoose.Types.ObjectId(engineerId);
    const phaseObjectId = new mongoose.Types.ObjectId(phaseId);

    const result = await EngineerReocord.aggregate([
      { $match: { _id: engineerObjectId } },
      { $unwind: "$developmentProjectList.logic" },
      { $unwind: "$developmentProjectList.logic.phases" },
      {
        $match: {
          "developmentProjectList.logic.phases._id": phaseObjectId,
        },
      },
      {
        $lookup: {
          from: "projects",
          let: { projectId: "$developmentProjectList.logic.project" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$projectId"] },
              },
            },
            {
              $project: {
                _id: 1,
                projectName: 1,
                jobNumber: 1,
                client: 1,
              },
            },
          ],
          as: "project",
        },
      },
      {
        $lookup: {
          from: "engineerrecords",
          let: {
            engineerIds: "$developmentProjectList.logic.phases.engineers",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$engineerIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                empId: 1,
              },
            },
          ],
          as: "engineers",
        },
      },
      {
        $lookup: {
          from: "engineerrecords",
          let: {
            peerEngineerIds: "$developmentProjectList.logic.phases.peerEngineers",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$peerEngineerIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                empId: 1,
              },
            },
          ],
          as: "peerEngineers",
        },
      },

      {
        $project: {
          _id: 0,
          phase: "$developmentProjectList.logic.phases",
          project: { $arrayElemAt: ["$project", 0] },
          engineers: 1,
          peerEngineers: 1,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Logic phase not found",
      });
    }

    const data = result[0];
    const isEngineerAllowed =
      data.phase.engineers?.some((id) => id.equals(engineerObjectId)) ||
      data.phase.peerEngineers?.some((id) => id.equals(engineerObjectId));

    if (!isEngineerAllowed) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this phase",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Populate logic phase error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getScadaPhaseById = async (req, res) => {
  try {
    const phaseId = req.params.id;
    const engineerId = req.user?._id;

    if (!engineerId || !phaseId) {
      return res.status(400).json({
        success: false,
        message: "engineerId and phaseId are required",
      });
    }
    const engineerObjectId = new mongoose.Types.ObjectId(engineerId);
    const phaseObjectId = new mongoose.Types.ObjectId(phaseId);

    const result = await EngineerReocord.aggregate([
      { $match: { _id: engineerObjectId } },
      { $unwind: "$developmentProjectList.scada" },
      { $unwind: "$developmentProjectList.scada.phases" },
      {
        $match: {
          "developmentProjectList.scada.phases._id": phaseObjectId,
        },
      },
      {
        $lookup: {
          from: "projects",
          let: { projectId: "$developmentProjectList.scada.project" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$projectId"] },
              },
            },
            {
              $project: {
                _id: 1,
                projectName: 1,
                jobNumber: 1,
                client: 1,
              },
            },
          ],
          as: "project",
        },
      },
      {
        $lookup: {
          from: "engineerrecords",
          let: {
            engineerIds: "$developmentProjectList.scada.phases.engineers",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$engineerIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                empId: 1,
              },
            },
          ],
          as: "engineers",
        },
      },
      {
        $lookup: {
          from: "engineerrecords",
          let: {
            peerEngineerIds:
              "$developmentProjectList.scada.phases.peerEngineers",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$peerEngineerIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                empId: 1,
              },
            },
          ],
          as: "peerEngineers",
        },
      },
      {
        $project: {
          _id: 0,
          phase: "$developmentProjectList.scada.phases",
          project: { $arrayElemAt: ["$project", 0] },
          engineers: 1,
          peerEngineers: 1,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "SCADA phase not found",
      });
    }

    const data = result[0];
    const isEngineerAllowed =
      data.phase.engineers?.some((id) => id.equals(engineerObjectId)) ||
      data.phase.peerEngineers?.some((id) => id.equals(engineerObjectId));

    if (!isEngineerAllowed) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this phase",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Populate SCADA phase error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getTestingPhaseById = async (req, res) => {
  try {
    const phaseId = req.params.id;
    const engineerId = req.user?._id;

    if (!engineerId || !phaseId) {
      return res.status(400).json({
        success: false,
        message: "engineerId and phaseId are required",
      });
    }

    const engineerObjectId = new mongoose.Types.ObjectId(engineerId);
    const phaseObjectId = new mongoose.Types.ObjectId(phaseId);

    const result = await EngineerReocord.aggregate([
      { $match: { _id: engineerObjectId } },
      { $unwind: "$developmentProjectList.testing" },
      { $unwind: "$developmentProjectList.testing.phases" },
      {
        $match: {
          "developmentProjectList.testing.phases._id": phaseObjectId,
        },
      },
      {
        $lookup: {
          from: "projects",
          let: { projectId: "$developmentProjectList.testing.project" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$projectId"] },
              },
            },
            {
              $project: {
                _id: 1,
                projectName: 1,
                jobNumber: 1,
                client: 1,
              },
            },
          ],
          as: "project",
        },
      },
      {
        $lookup: {
          from: "engineerrecords",
          let: {
            engineerIds: "$developmentProjectList.testing.phases.engineers",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$engineerIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                empId: 1,
              },
            },
          ],
          as: "engineers",
        },
      },
      {
        $lookup: {
          from: "engineerrecords",
          let: {
            peerEngineerIds:
              "$developmentProjectList.testing.phases.peerEngineers",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$peerEngineerIds"],
                },
              },
            },
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                empId: 1,
              },
            },
          ],
          as: "peerEngineers",
        },
      },
      {
        $project: {
          _id: 0,
          phase: "$developmentProjectList.testing.phases",
          project: { $arrayElemAt: ["$project", 0] },
          engineers: 1,
          peerEngineers: 1,
        },
      },
    ]);

    if (!result.length) {
      return res.status(404).json({
        success: false,
        message: "Testing phase not found",
      });
    }

    const data = result[0];
    const isEngineerAllowed =
      data.phase.engineers?.some((id) => id.equals(engineerObjectId)) ||
      data.phase.peerEngineers?.some((id) => id.equals(engineerObjectId));

    if (!isEngineerAllowed) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this phase",
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Populate testing phase error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

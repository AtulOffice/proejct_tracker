import mongoose from "mongoose";
import EngineerReocord from "../models/engineers..model.js";
import {
  deleteImageToGlobalServer,
  uploadImageToGlobalServer,
} from "../utils/imageUtils.js";

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
      (assignment) => !(assignment.isMom && assignment.isFinalMom)
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

    const uploadedDocs = [];
    if (momData.momDocuments && momData.momDocuments.length > 0) {
      for (const file of momData.momDocuments) {
        try {
          const base64Data = file.data.replace(/^data:\w+\/\w+;base64,/, "");
          const buffer = Buffer.from(base64Data, "base64");
          const uploadRes = await uploadImageToGlobalServer(
            buffer,
            file.name,
            "mom-documents"
          );

          const imageUrl = uploadRes?.url || uploadRes;
          uploadedDocs.push({
            name: file.name,
            type: file.type,
            size: file.size,
            url: imageUrl,
          });

          uploadedUrls.push(imageUrl);
        } catch (uploadErr) {
          console.error("❌ File upload failed:", file.name, uploadErr.message);
        }
      }
    }

    const assignmentIndex = engineer.assignments.findIndex(
      (a) => a.projectId.toString() === momData.projectId
    );
    if (assignmentIndex === -1) {
      for (const url of uploadedUrls) {
        await deleteImageToGlobalServer(url);
      }

      return res.status(404).json({
        success: false,
        message: "Assignment not found for this project",
      });
    }

    engineer.assignments[assignmentIndex].isMom = true;
    if (momData.isFinalMom) {
      engineer.assignments[assignmentIndex].isFinalMom = true;
    }

    await engineer.save();
    const project = await ProjectModel.findById(momData.projectId);
    if (!project) {
      for (const url of uploadedUrls) {
        await deleteImageToGlobalServer(url);
      }

      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.MOMRecords = project.MOMRecords || [];
    project.MOMRecords.push({
      engineerId,
      engineerName: momData.engineerName,
      momSrNo: momData.momSrNo,
      finalMomSrNo: momData.finalMomSrNo,
      isFinalMom: momData.isFinalMom,
      pendingPoint: momData.pendingPoint,
      siteStartDate: momData.siteStartDate,
      siteEndDate: momData.siteEndDate,
      location: momData.location,
      momDocuments: uploadedDocs,
      createdAt: new Date(),
    });

    await project.save();

    return res.status(200).json({
      success: true,
      message: "✅ MOM saved successfully with document uploads",
    });
  } catch (err) {
    console.error("❌ Error saving MOM:", err.message);

    for (const url of uploadedUrls) {
      await deleteImageToGlobalServer(url);
    }

    return res.status(500).json({
      success: false,
      message: "Error saving MOM data",
      error: err.message,
    });
  }
};

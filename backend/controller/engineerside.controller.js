import mongoose from "mongoose";
import EngineerReocord from "../models/engineers..model.js";

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
      })
      .lean();

    if (!engineer) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }

    const lastFiveAssignments = (engineer.assignments || [])
      .sort((a, b) => new Date(b.assignedAt) - new Date(a.assignedAt))
      .slice(0, 5);

    return res.status(200).json({
      success: true,
      engineerId: engineer._id,
      name: engineer.name,
      empId: engineer.empId,
      totalAssignments: engineer.assignments.length,
      lastFiveAssignments,
    });
  } catch (e) {
    console.error("Error fetching engineer project history:", e);
    res
      .status(500)
      .json({ success: false, message: "Error fetching engineer data" });
  }
};

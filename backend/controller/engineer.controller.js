import mongoose from "mongoose";
import EngineerReocord from "../models/engineers.model.js";
import bcrypt from "bcryptjs";

export const updateEngineerAssignmentStatusCrons = async () => {
  try {
    const now = new Date();
    const engineers = await EngineerReocord.find({});

    for (const engineer of engineers) {
      if (engineer?.manualOverride) continue;

      const assignments = Array.isArray(engineer.assignments)
        ? engineer.assignments
        : [];

      const lastAssignment =
        assignments.length > 0 ? assignments[assignments.length - 1] : null;

      if (lastAssignment) {
        const { assignedAt, endTime } = lastAssignment;

        if (assignedAt && endTime) {
          engineer.isAssigned =
            now >= new Date(assignedAt) && now <= new Date(endTime);
        } else {
          engineer.isAssigned = false;
        }
      } else {
        engineer.isAssigned = false;
      }

      await engineer.save();
    }
    console.log(
      "Engineer assignment status updated (based on last assignment)."
    );
  } catch (err) {
    console.error("Error updating engineer status:", err);
  }
};

export const getAvailableEngineers = async (req, res) => {
  try {
    const availableEngineers = await EngineerReocord.find({
      isAssigned: false,
    });

    return res.status(200).json({
      success: true,
      totalEngineer: availableEngineers.length,
      data: availableEngineers,
    });
  } catch (e) {
    console.error("Error fetching available engineers:", e);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
};

export const getAssignedEngineers = async (req, res) => {
  try {
    const AssignedleEngineers = await EngineerReocord.find({
      isAssigned: true,
    });

    return res.status(200).json({
      success: true,
      totalEngineer: AssignedleEngineers.length,
      data: AssignedleEngineers,
    });
  } catch (e) {
    console.error("Error fetching available engineers:", e);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
};
export const getAllEngineers = async (req, res) => {
  try {
    const availableEngineers = await EngineerReocord.find({});

    return res.status(200).json({
      success: true,
      totalEngineer: availableEngineers.length,
      data: availableEngineers,
    });
  } catch (e) {
    console.error("Error fetching available engineers:", e);
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
};

export const saveEngineerRecord = async (req, res) => {
  try {
    const { name, email, phone, assignments, empId } = req.body;
    if (!name || !empId) {
      return res.status(400).json({
        success: false,
        message: "Engineer name and code  is required",
      });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }
    }

    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number (must be 10 digits)",
        });
      }
    }
    const isExist = await EngineerReocord.findOne({
      empId: empId.toUpperCase(),
    });

    if (isExist) {
      return res.status(400).json({
        success: false,
        message: "this employee code already exist",
      });
    }
    const defaultPassword = "Admin@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    await EngineerReocord.create({
      name,
      email,
      phone,
      assignments,
      empId: empId.toUpperCase(),
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Engineer record saved successfully",
    });
  } catch (e) {
    console.error("Error saving engineer record:", e);
    return res.status(500).json({
      success: false,
      message: "Error saving data",
      error: e.message,
    });
  }
};

export const editEngineerRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, phone, empId, manualOverride } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Engineer ID is required" });
    }
    if (!name || !empId) {
      return res.status(400).json({
        success: false,
        message: "Engineer name and code is required",
      });
    }

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email format" });
      }
    }

    if (phone) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number (must be 10 digits)",
        });
      }
    }

    const updatedRecord = await EngineerReocord.findByIdAndUpdate(
      id,
      {
        email,
        name,
        phone,
        ...(manualOverride && { isAssigned: !manualOverride }),
        empId: empId.toUpperCase(),
        manualOverride,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRecord) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Engineer record updated successfully",
      data: updatedRecord,
    });
  } catch (e) {
    console.error("Error updating engineer record:", e);
    return res.status(500).json({
      success: false,
      message: "Error updating engineer data",
      error: e.message,
    });
  }
};

export const deleteEngineerRecord = async (req, res) => {
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
        .json({ success: false, message: "Engineer ID is required" });
    }

    const deleted = await EngineerReocord.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Engineer not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Engineer record deleted successfully",
      data: deleted,
    });
  } catch (e) {
    console.error("Error deleting engineer record:", e);
    res
      .status(500)
      .json({ success: false, message: "Error deleting engineer record" });
  }
};

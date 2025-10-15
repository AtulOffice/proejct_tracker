import WeeklyAssignment from "../models/devReocrd.model.js";

export const saveWeeklyAssignment = async (req, res) => {
  try {
    const { weekStart, assignments, tasksByDate, engineers } = req.body;

    if (!weekStart || (!assignments && !tasksByDate)) {
      return res.status(400).json({
        success: false,
        message: "weekStart and assignment data are required",
      });
    }

    const start = new Date(weekStart);
    if (isNaN(start)) {
      return res.status(400).json({
        success: false,
        message: "Invalid weekStart date",
      });
    }

    if (start.getDay() !== 1) {
      return res.status(400).json({
        success: false,
        message: "weekStart must be a Monday",
      });
    }

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const getDayName = (date) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[date.getDay()];
    };

    let formattedAssignments = {};
    let engineerName = [];

    if (tasksByDate && engineers) {
      for (const dateStr in tasksByDate) {
        const date = new Date(dateStr);
        if (isNaN(date)) continue;
        const dayName = getDayName(date);

        const engineerTaskData = tasksByDate[dateStr];
        const assignmentsForDate = [];

        for (const engineerId in engineerTaskData) {
          const engineer = engineers.find((e) => e.engineerId === engineerId);

          const tasks = engineerTaskData[engineerId];
          tasks.forEach((task) => {
            assignmentsForDate.push({
              engineerId: engineer?.engineerId || engineerId,
              engineerName: engineer?.engineerName || "",
              projectName: engineer?.projectName || "",
              jobNumber: engineer?.jobNumber || "",
              tasks: task,
            });
            engineerName.push(engineer?.engineerName || "");
          });
        }

        formattedAssignments[dayName] = assignmentsForDate;
      }
      engineerName = [...new Set(engineerName.filter((name) => name))];
    } else if (assignments) {
      for (const dateStr in assignments) {
        const date = new Date(dateStr);
        if (isNaN(date)) continue;
        const dayName = getDayName(date);
        formattedAssignments[dayName] = assignments[dateStr];
      }
    }

    const existingWeek = await WeeklyAssignment.findOne({
      weekStart: start,
      weekEnd: end,
    });

    if (existingWeek) {
      existingWeek.assignments = formattedAssignments;
      existingWeek.updatedAt = new Date();
      existingWeek.engineerName = engineerName;
      await existingWeek.save();

      return res.status(200).json({
        success: true,
        message: "Weekly assignments updated successfully",
        data: existingWeek,
      });
    } else {
      const newWeek = await WeeklyAssignment.create({
        weekStart: start,
        weekEnd: end,
        assignments: formattedAssignments,
        engineerName,
      });

      return res.status(201).json({
        success: true,
        message: "Weekly assignments saved successfully",
        data: newWeek,
      });
    }
  } catch (error) {
    console.error("Error saving weekly assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Error saving weekly assignments",
      error: error.message,
    });
  }
};

export const updateWeeklyAssignments = async (req, res) => {
  try {
    const { weekStart, assignments, tasksByDate, engineers } = req.body;

    if (!weekStart || (!assignments && !tasksByDate)) {
      return res.status(400).json({
        success: false,
        message: "weekStart and assignment data are required",
      });
    }

    const start = new Date(weekStart);
    if (isNaN(start)) {
      return res.status(400).json({
        success: false,
        message: "Invalid weekStart date",
      });
    }

    if (start.getDay() !== 1) {
      return res.status(400).json({
        success: false,
        message: "weekStart must be a Monday",
      });
    }

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const getDayName = (date) => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[date.getDay()];
    };

    let formattedAssignments = {};
    let engineerName = [];

    if (tasksByDate && engineers) {
      for (const dateStr in tasksByDate) {
        const date = new Date(dateStr);
        if (isNaN(date)) continue;
        const dayName = getDayName(date);

        const engineerTaskData = tasksByDate[dateStr];
        const assignmentsForDate = [];

        for (const engineerId in engineerTaskData) {
          const engineer = engineers.find((e) => e.engineerId === engineerId);
          const tasks = engineerTaskData[engineerId];

          tasks.forEach((task) => {
            assignmentsForDate.push({
              engineerId: engineer?.engineerId || engineerId,
              engineerName: engineer?.engineerName || "",
              projectName: engineer?.projectName || "",
              jobNumber: engineer?.jobNumber || "",
              tasks: task,
            });
            engineerName.push(engineer?.engineerName || "");
          });
        }

        formattedAssignments[dayName] = assignmentsForDate;
      }
      engineerName = [...new Set(engineerName.filter((name) => name))];
    } else if (assignments) {
      for (const dateStr in assignments) {
        const date = new Date(dateStr);
        if (isNaN(date)) continue;
        const dayName = getDayName(date);
        formattedAssignments[dayName] = assignments[dateStr];
      }
    }

    const existingWeek = await WeeklyAssignment.findOne({
      weekStart: start,
      weekEnd: end,
    });

    if (!existingWeek) {
      return res.status(404).json({
        success: false,
        message: "Weekly assignment not found for the given weekStart",
      });
    }

    existingWeek.assignments = formattedAssignments;
    existingWeek.updatedAt = new Date();
    if (engineerName.length > 0) {
      existingWeek.engineerName = engineerName;
    }

    await existingWeek.save();

    return res.status(200).json({
      success: true,
      message: "Weekly assignments updated successfully",
      data: existingWeek,
    });
  } catch (error) {
    console.error("Error updating weekly assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating weekly assignments",
      error: error.message,
    });
  }
};

export const getWeeklyAssignmentByDate = async (req, res) => {
  try {
    const { weekStart } = req.query;

    if (!weekStart) {
      return res.status(400).json({
        success: false,
        message: "weekStart query parameter is required",
      });
    }

    const startDate = new Date(weekStart);
    if (isNaN(startDate)) {
      return res.status(400).json({
        success: false,
        message: "Invalid weekStart date",
      });
    }

    const assignment = await WeeklyAssignment.findOne({ weekStart: startDate });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No assignments found for this week",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error fetching weekly assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching weekly assignment",
      error: error.message,
    });
  }
};

export const getAllAssements = async (req, res) => {
  try {
    const assignment = await WeeklyAssignment.find(
      {},
      { weekStart: 1, _id: 1, createdAt: 1, engineerName: 1 }
    ).sort({ createdAt: -1 });

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No assignments found for this week",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error fetching weekly assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching weekly assignment",
      error: error.message,
    });
  }
};

export const getAssementbyId = async (req, res) => {
  try {
    const { id } = req.params;

    const assignment = await WeeklyAssignment.findById(id);
    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "No assignments found for this week",
      });
    }

    return res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error fetching weekly assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching weekly assignment",
      error: error.message,
    });
  }
};

export const deleteWeeklyAssignmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Assignment ID is required",
      });
    }

    const deleted = await WeeklyAssignment.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "No assignment found with this ID",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Weekly assignment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting weekly assignment:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting weekly assignment",
      error: error.message,
    });
  }
};

export const getAllWeeklyAssignmentsPagination = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await WeeklyAssignment.countDocuments();
    const assignments = await WeeklyAssignment.find()
      .sort({ weekStart: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      message: "Weekly assignments fetched successfully",
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching weekly assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching weekly assignments",
      error: error.message,
    });
  }
};

export const getAllWeeklyAssignments = async (req, res) => {
  try {
    const assignments = await WeeklyAssignment.find(
      {},
      { assignments: 0 }
    ).sort({ weekStart: -1 });

    if (!assignments.length) {
      return res.status(404).json({
        success: false,
        message: "No weekly assignments found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Weekly assignments fetched successfully",
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching weekly assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching weekly assignments",
      error: error.message,
    });
  }
};
export const getAllWeeklyAssignmentsallfield = async (req, res) => {
  try {
    const assignments = await WeeklyAssignment.find({}).sort({ weekStart: -1 });

    if (!assignments.length) {
      return res.status(404).json({
        success: false,
        message: "No weekly assignments found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Weekly assignments fetched successfully",
      data: assignments,
    });
  } catch (error) {
    console.error("Error fetching weekly assignments:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching weekly assignments",
      error: error.message,
    });
  }
};

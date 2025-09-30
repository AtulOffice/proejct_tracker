import ProjectModel from "../models/Project.model.js";
import dayjs from "dayjs";
import workStatusModel from "../models/WorkStatus.model.js";

export const Recordsformave = async (req, res) => {
  try {
    const {
      projectName,
      engineerName,
      entityType,
      finalMomnumber,
      actualStartDate,
      actualEndDate,
      soType,
      client,
      jobNumber,
      bill,
      dueBill,
      BillNotice,
      visitDate,
      visitendDate,
      momDate,
      momsrNo,
      endUser,
      orderNumber,
      orderDate,
      daysspendsite,
      startDate,
      endDate,
      description,
      location,
      status,
      priority,
      duration,
      service,
      workScope,
      expenseScope,
      supplyStatus,
      deleveryDate,
      requestDate,
      actualVisitDuration,
      EndChecklist,
      StartChecklist,
      ContactPersonNumber,
      ContactPersonName,
      ExpensSubmission,
      BackupSubmission,
    } = req.body;

    const ExistanceData = await ProjectModel.findOne({ jobNumber });
    if (ExistanceData) {
      return res
        .status(400)
        .json({ success: false, message: "Job number is  already stored" });
    }
    const data = await ProjectModel.create(req.body);
    return res.status(201).json({
      success: true,
      message: "data saved successfully",
      data,
    });
  } catch (e) {
    console.log(e?.message);
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

export const findrecord = async (req, res) => {
  try {
    const data = await ProjectModel.find();
    return res.status(200).json({
      success: true,
      message: "data fetch successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "error while fetching data",
    });
  }
};

export const findrecordbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ProjectModel.findById(id);
    return res.status(200).json({
      success: true,
      message: "data fetch successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "error while fetching data",
    });
  }
};

export const updateRecords = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const updatedData = await ProjectModel.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedData) {
      return res
        .status(404)
        .json({ success: false, message: "Record not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Data updated successfully",
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRecord = await ProjectModel.findByIdAndDelete(id);

    if (!deletedRecord) {
      return res.status(404).json({
        success: false,
        message: "project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: deletedRecord.projectName,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      success: false,
      message: "Error while deleting the record",
    });
  }
};

export const LatestProjectPagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;
  try {
    let data = [];
    let total = 0;

    if (!search) {
      data = await ProjectModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectModel.countDocuments();
    } else {
      const result = await ProjectModel.findOne({
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
      success: true,
      message: "Data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const Pagination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;
  try {
    let data = [];
    let total = 0;

    if (!search) {
      data = await ProjectModel.find()
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectModel.countDocuments();
    } else {
      const result = await ProjectModel.findOne({
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
      success: true,
      message: "data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const PaginationDevStatus = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const Development = req.query.devstatus || "";
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  try {
    let data = [];
    let total = 0;

    if (!search) {
      const filter = Development ? { Development } : {};

      data = await ProjectModel.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectModel.countDocuments(filter);
    } else {
      const result = await ProjectModel.findOne({
        jobNumber: { $regex: new RegExp(`^${search}$`, "i") },
      });
      console.log(result);
      if (result?.Development) {
        data = [result];
        total = 1;
      } else {
        data = [];
        total = 0;
      }
    }
    return res.json({
      success: true,
      message: "data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const PaginationCatogary = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || "";
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  try {
    let data = [];
    let total = 0;
    if (!search) {
      const filter = status ? { status } : {};

      data = await ProjectModel.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectModel.countDocuments(filter);
    } else {
      const result = await ProjectModel.findOne({
        jobNumber: { $regex: new RegExp(`^${search}$`, "i") },
        ...(status && { status }),
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
      success: true,
      message: "data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const Paginationsotype = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const soType = req.query.soType || "";
  const skip = (page - 1) * limit;
  try {
    let data = [];
    let total = 0;
    if (!search) {
      const filter = soType ? { soType } : {};
      data = await ProjectModel.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectModel.countDocuments(filter);
    } else {
      const result = await ProjectModel.findOne({
        jobNumber: { $regex: new RegExp(`^${search}$`, "i") },
        ...(soType && { soType }),
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
      success: true,
      message: "Data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
export const findrecordbyJobnumber = async (req, res) => {
  try {
    const jobNumber = req.query.jobNumber;

    if (!jobNumber) {
      return res.status(400).json({
        success: false,
        message: "jobNumber is required",
      });
    }

    const data = await ProjectModel.findOne({
      jobNumber: { $regex: new RegExp(`^${jobNumber}$`, "i") },
      status: "running",
    });

    if (!data || data.length === 0) {
      return res.status(400).json({
        success: true,
        message: "No matching record found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Data fetched successfully",
      data,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Error while fetching data",
    });
  }
};

export const UrgentProjectPegination = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || "";
  const search = req.query.search || "";
  const startDateQuery = req.query.startDate;
  const skip = (page - 1) * limit;

  try {
    const filter = {};
    let data = [];
    let total = 0;
    if (status) {
      filter.status = status;
    }
    if (startDateQuery) {
      const inputDate = new Date(startDateQuery);
      const endDate = new Date(inputDate);
      endDate.setDate(inputDate.getDate() + 7);

      const formattedStart = dayjs(inputDate).format("YYYY-MM-DD");
      const formattedEnd = dayjs(endDate).format("YYYY-MM-DD");

      filter.startDate = { $gte: formattedStart, $lte: formattedEnd };
    }
    if (!search) {
      data = await ProjectModel.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);
      total = await ProjectModel.countDocuments(filter);
    } else {
      filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
      const result = await ProjectModel.findOne(filter);
      if (result) {
        data = [result];
        total = 1;
      } else {
        data = [];
        total = 0;
      }
    }

    return res.json({
      success: true,
      message: "data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getProjectOverview = async (req, res) => {
  try {
    const projects = await ProjectModel.find({}).sort({
      updatedAt: -1,
      createdAt: -1,
    });
    const latestProjects = projects.slice(0, 3);
    const highPriority = projects
      .filter((p) => {
        const created = new Date(p.createdAt);
        const now = new Date();
        const previousYear = now.getFullYear(); //  <-------
        return p.priority === "high" && created.getFullYear() === previousYear;
      })
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .slice(0, 3);

    const statusGroups = {
      upcoming: { name: "UpComing", cnt: 0 },
      running: { name: "Active", cnt: 0 },
      urgent: { name: "Urgent", cnt: 0 },
      pending: { name: "Pending", cnt: 0 },
      complete: { name: "Completed", cnt: 0 },
      closed: { name: "Closed", cnt: 0 },
      norequest: { name: "No Request", cnt: 0 },
      cancelled: { name: "Cancelled", cnt: 0 },
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const count = await workStatusModel.countDocuments({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    projects.forEach((project) => {
      const { status, startDate } = project;

      if (status === "completed") statusGroups.complete.cnt += 1;
      if (status === "closed") statusGroups.closed.cnt += 1;
      if (status === "cancelled") statusGroups.cancelled.cnt += 1;
      if (status === "no request") statusGroups.norequest.cnt += 1;
      if (status === "running") statusGroups.running.cnt += 1;
      if (status === "upcoming") statusGroups.upcoming.cnt += 1;
      if (status === "pending") statusGroups.pending.cnt += 1;

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const diffDays = (start - today) / (1000 * 60 * 60 * 24);
        if (diffDays >= 0 && diffDays <= 7) {
          statusGroups.urgent.cnt += 1;
        }
      }
    });

    const chartData = [
      {
        title: "Completed",
        value: statusGroups.complete.cnt,
        color: "#fbbf24",
      },
      {
        title: "Active",
        value: statusGroups.running.cnt,
        color: "#6366f1",
      },
      {
        title: "Upcoming",
        value: statusGroups.upcoming.cnt,
        color: "#34d399",
      },
      {
        title: "Pending",
        value: statusGroups.pending.cnt,
        color: "#a78bfa",
      },
      {
        title: "Urgent",
        value: statusGroups.urgent.cnt,
        color: "#f87171",
      },
      {
        title: "Cancelled",
        value: statusGroups.cancelled.cnt,
        color: "#9ca3af",
      },
      {
        title: "Closed",
        value: statusGroups.closed.cnt,
        color: "#facc15",
      },
      {
        title: "No request",
        value: statusGroups.norequest.cnt,
        color: "#60a5fa",
      },
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const chart = chartData
      .filter((item) => item.value > 0)
      .map((item) => ({
        name: item.title,
        cnt: total ? Math.round((item.value / total) * 100) : 0,
        color: item.color,
      }));

    res.json({
      latestProjects,
      highPriority,
      statusGroups: statusGroups,
      chart,
      todayNotice: count,
    });
  } catch (error) {
    console.error("Error in dashboard API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

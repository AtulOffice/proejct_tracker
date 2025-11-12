import ProjectModel from "../models/Project.model.js";
import workStatusModel from "../models/WorkStatus.model.js";
import EngineerReocord from "../models/engineers..model.js";
import ProjectDevModel from "../models/Project.Dev.model.js";
import mongoose from "mongoose";
import StartChecklistsModel from "../models/startCheck.model.js";
import EndChecklistsModel from "../models/endCheckList.js";
import Order from "../models/orderSheet.model.js";

export const Recordsformave = async (req, res) => {
  try {
    const { jobNumber, engineerData, OrderMongoId, ...projectFields } =
      req.body;
    if (!jobNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Job number is Required" });
    }

    const existingProject = await ProjectModel.findOne({ jobNumber });
    if (existingProject) {
      return res
        .status(400)
        .json({ success: false, message: "Job number is already stored" });
    }

    const EngineerDetails = Array.from(
      engineerData
        .reduce((map, eng) => {
          const assignedAt = eng.assignedAt
            ? new Date(eng.assignedAt)
            : new Date();
          const durationDays = eng.days || 0;
          const endTime = eng.endTime
            ? new Date(eng.endTime)
            : new Date(
                assignedAt.getTime() + durationDays * 24 * 60 * 60 * 1000
              );

          map.set(eng.engineerId, {
            engineerId: eng.engineerId,
            name: eng.engineerName || eng.name,
            empId: eng.empId || "",
            assignedAt,
            durationDays,
            endTime,
            isMom: eng.isMom ?? false,
            isFinalMom: eng.isFinalMom ?? false,
            projToengObjectId: new mongoose.Types.ObjectId(),
          });
          return map;
        }, new Map())
        .values()
    );

    const project = await ProjectModel.create({
      ...projectFields,
      jobNumber,
      EngineerDetails,
      OrderMongoId,
    });
    await Order.findByIdAndUpdate(
      OrderMongoId,
      {
        ProjectDetails: project._id,
        isSaveInProject: true,
      },
      { new: true }
    );

    let updatedCount = 0;
    let skippedEngineers = [];
    let notFoundEngineers = [];
    let failedEngineers = [];

    for (const eng of EngineerDetails) {
      try {
        const engineer = await EngineerReocord.findById(eng.engineerId);

        if (!engineer) {
          notFoundEngineers.push(eng.engineerId);
          continue;
        }

        if (engineer.isAssigned) {
          skippedEngineers.push(engineer.name || eng.engineerId);
          continue;
        }
        await EngineerReocord.findByIdAndUpdate(
          eng.engineerId,
          {
            $set: { isAssigned: true, manualOverride: false },
            $push: {
              assignments: {
                projectId: project._id,
                projectName: project.projectName,
                jobNumber: project.jobNumber,
                assignedAt: eng.assignedAt,
                durationDays: eng.durationDays,
                endTime: eng.endTime,
                isMom: eng.isMom ?? false,
                isFinalMom: eng.isFinalMom ?? false,
                engToprojObjectId: eng.projToengObjectId,
              },
            },
          },
          { new: true }
        );

        updatedCount++;
      } catch (err) {
        console.error(
          `Error updating engineer ${eng.engineerId}:`,
          err.message
        );
        failedEngineers.push(eng.engineerId);
      }
    }

    return res.status(200).json({
      message: "Engineer assignment process completed.",
      summary: {
        updated: updatedCount,
        skipped: skippedEngineers.length,
        notFound: notFoundEngineers.length,
        failed: failedEngineers.length,
      },
      details: {
        skippedEngineers,
        notFoundEngineers,
        failedEngineers,
      },
    });
  } catch (e) {
    console.error(e);
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
    const {
      engineerData,
      completionDocuments,
      dispatchDocuments,
      customerDocuments,
      internalDocuments,
      OrderMongoId,
      ...otherData
    } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });

    const project = await ProjectModel.findById(id);
    if (!project)
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });

    Object.keys(otherData).forEach((key) => {
      if (project.schema.path(key)) project[key] = otherData[key];
    });

    const mergeNested = (target, source) => {
      if (!source) return;
      Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          if (!target[key]) target[key] = {};
          mergeNested(target[key], value);
        } else {
          target[key] = value;
        }
      });
    };

    mergeNested(project.completionDocuments, completionDocuments);
    mergeNested(project.dispatchDocuments, dispatchDocuments);
    mergeNested(project.customerDocuments, customerDocuments);
    mergeNested(project.internalDocuments, internalDocuments);

    let transformedEngineers = [];
    if (Array.isArray(engineerData) && engineerData.length > 0) {
      transformedEngineers = engineerData.map((eng) => {
        const assignedAt = eng.assignedAt
          ? new Date(eng.assignedAt)
          : new Date();
        const durationDays = eng.days || 0;
        const endTime = eng.endTime
          ? new Date(eng.endTime)
          : new Date(assignedAt.getTime() + durationDays * 24 * 60 * 60 * 1000);

        const existing = project.EngineerDetails?.find(
          (e) => e.engineerId.toString() === eng.engineerId.toString()
        );
        const linkObjectId =
          existing && (existing.isMom === true || existing.isFinalMom === true)
            ? new mongoose.Types.ObjectId()
            : existing?.projToengObjectId || new mongoose.Types.ObjectId();
        const projToengObjectId = linkObjectId;
        return {
          engineerId: eng.engineerId,
          name: eng.engineerName || eng.name,
          empId: eng.empId || "",
          assignedAt,
          durationDays,
          endTime,
          isMom: eng.isMom ?? false,
          isFinalMom: eng.isFinalMom ?? false,
          projToengObjectId: projToengObjectId,
        };
      });

      if (!Array.isArray(project.EngineerDetails)) {
        project.EngineerDetails = [];
      }

      transformedEngineers.forEach((newEng) => {
        const existing = project.EngineerDetails.find(
          (e) => e.engineerId.toString() === newEng.engineerId.toString()
        );

        if (
          existing &&
          (existing.isMom === true || existing.isFinalMom === true)
        ) {
          project.EngineerDetails.push(newEng);
        } else {
          project.EngineerDetails = project.EngineerDetails.filter(
            (e) => e.engineerId.toString() !== newEng.engineerId.toString()
          );
          project.EngineerDetails.push(newEng);
        }
      });
    }
    await project.save();

    const updatedProject = await ProjectModel.findById(project._id).lean();

    let updatedCount = 0;
    let skippedEngineers = [];
    let notFoundEngineers = [];
    let failedEngineers = [];

    for (const eng of transformedEngineers) {
      try {
        const engineer = await EngineerReocord.findById(eng.engineerId);
        if (!engineer) {
          notFoundEngineers.push(eng.engineerId);
          continue;
        }

        if (engineer.isAssigned) {
          skippedEngineers.push(engineer.name || eng.engineerId);
          continue;
        }

        const existingAssignment = engineer.assignments.find(
          (a) => a.projectId.toString() === project._id.toString()
        );

        const engToprojObjectId =
          existingAssignment &&
          (existingAssignment.isMom === true ||
            existingAssignment.isFinalMom === true)
            ? eng.projToengObjectId
            : existingAssignment?.engToprojObjectId || eng.projToengObjectId;

        const updateOps = {
          $set: { isAssigned: true, manualOverride: false },
        };

        if (
          existingAssignment &&
          (existingAssignment.isMom === true ||
            existingAssignment.isFinalMom === true)
        ) {
          updateOps.$push = {
            assignments: {
              projectId: project._id,
              projectName: project.projectName,
              jobNumber: project.jobNumber,
              assignedAt: eng.assignedAt,
              durationDays: eng.durationDays,
              endTime: eng.endTime,
              isMom: eng.isMom ?? false,
              isFinalMom: eng.isFinalMom ?? false,
              engToprojObjectId,
            },
          };
        } else {
          updateOps.$pull = { assignments: { projectId: project._id } };
          updateOps.$push = {
            assignments: {
              projectId: project._id,
              projectName: project.projectName,
              jobNumber: project.jobNumber,
              assignedAt: eng.assignedAt,
              durationDays: eng.durationDays,
              endTime: eng.endTime,
              isMom: eng.isMom ?? false,
              isFinalMom: eng.isFinalMom ?? false,
              engToprojObjectId,
            },
          };
        }

        try {
          if (updateOps.$pull && updateOps.$push) {
            await EngineerReocord.findByIdAndUpdate(eng.engineerId, {
              $pull: updateOps.$pull,
            });

            const { $set, $push } = updateOps;
            await EngineerReocord.findByIdAndUpdate(
              eng.engineerId,
              { $set, $push },
              { new: true }
            );
          } else {
            await EngineerReocord.findByIdAndUpdate(eng.engineerId, updateOps, {
              new: true,
            });
          }
        } catch (err) {
          console.error(
            `Error updating assignments for ${eng.engineerId}:`,
            err
          );
        }

        updatedCount++;
      } catch (err) {
        console.error(
          `Error updating engineer ${eng.engineerId}:`,
          err.message
        );
        failedEngineers.push(eng.engineerId);
      }
    }

    return res.status(200).json({
      message: "Update process completed.",
      data: updatedProject,
      summary: {
        updated: updatedCount,
        skipped: skippedEngineers.length,
        notFound: notFoundEngineers.length,
        failed: failedEngineers.length,
      },
      details: { skippedEngineers, notFoundEngineers, failedEngineers },
    });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    if (true) {
      return res.status(400).json({
        success: false,
        message: "delete operation is closed by developer temperory",
      });
    }

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
  const search = req.query.search?.trim() || "";
  const devStatusRaw = req.query.devStatus || "";

  const skip = (page - 1) * limit;

  try {
    let data = [];
    let total = 0;
    const devStatus = devStatusRaw.toUpperCase();
    const filter = {};

    if (devStatus && ["OFFICE", "SITE", "N/A"].includes(devStatus)) {
      filter.Development = devStatus;
    } else if (!devStatus) {
      filter.Development = { $in: ["OFFICE", "SITE"] };
    }
    if (!search) {
      data = await ProjectModel.find(filter)
        .sort({ updatedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit);

      total = await ProjectModel.countDocuments(filter);
    } else {
      const result = await ProjectModel.findOne({
        jobNumber: { $regex: new RegExp(`^${search}$`, "i") },
      });

      if (
        result &&
        ((devStatus && result.Development === devStatus) ||
          (!devStatus && ["OFFICE", "SITE"].includes(result.Development)))
      ) {
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
    console.error("PaginationDevStatus error:", err);
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
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
    }
    const pipeline = [];
    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }

    pipeline.push({
      $addFields: {
        deliveryDateObj: {
          $dateFromString: {
            dateString: "$deleveryDate",
            format: "%Y-%m-%d",
            onError: null,
            onNull: null,
          },
        },
        visitDateObj: {
          $dateFromString: {
            dateString: "$visitDate",
            format: "%Y-%m-%d",
            onError: null,
            onNull: null,
          },
        },
      },
    });

    pipeline.push({
      $addFields: {
        compareDate: {
          $cond: [
            { $ne: ["$deliveryDateObj", null] },
            "$deliveryDateObj",
            "$visitDateObj",
          ],
        },
      },
    });

    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 180);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    pipeline.push({
      $match: {
        status: { $ne: "completed" },
        $or: [
          { EngineerDetails: { $exists: false } },
          { EngineerDetails: { $size: 0 } },
        ],
      },
    });

    pipeline.push({
      $match: {
        $or: [
          { compareDate: { $gte: startDate, $lte: endDate } },
          { visitDateObj: { $gte: startDate, $lte: endDate } },
        ],
      },
    });

    pipeline.push({
      $sort: { compareDate: -1, updatedAt: -1, createdAt: -1 },
    });

    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const data = await ProjectModel.aggregate(pipeline);

    const totalPipeline = pipeline.filter(
      (stage) => !("$skip" in stage || "$limit" in stage)
    );
    totalPipeline.push({ $count: "total" });

    const totalResult = await ProjectModel.aggregate(totalPipeline);
    const total = totalResult[0]?.total || 0;

    return res.json({
      success: true,
      message: "Data fetched successfully",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      data,
    });
  } catch (err) {
    console.error("Error in UrgentProjectPegination:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const UrgentProjectAction = async (req, res) => {
  const search = req.query.search || "";

  try {
    const filter = {};
    if (search) {
      filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
    }

    const pipeline = [];

    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }

    pipeline.push({
      $addFields: {
        deliveryDateObj: {
          $dateFromString: {
            dateString: "$deleveryDate",
            format: "%Y-%m-%d",
            onError: null,
            onNull: null,
          },
        },
        visitDateObj: {
          $dateFromString: {
            dateString: "$visitDate",
            format: "%Y-%m-%d",
            onError: null,
            onNull: null,
          },
        },
      },
    });

    pipeline.push({
      $addFields: {
        compareDate: {
          $ifNull: ["$visitDateObj", "$deliveryDateObj"],
        },
      },
    });
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 180);
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + 30);

    pipeline.push({
      $match: {
        status: { $ne: "completed" },
        $or: [
          { EngineerDetails: { $exists: false } },
          { EngineerDetails: { $size: 0 } },
        ],
      },
    });

    pipeline.push({
      $match: {
        $or: [
          { compareDate: { $gte: startDate, $lte: endDate } },
          { visitDateObj: { $gte: startDate, $lte: endDate } },
        ],
      },
    });
    pipeline.push({ $sort: { compareDate: -1, updatedAt: -1, createdAt: -1 } });

    const data = await ProjectModel.aggregate(pipeline);

    return res.json({
      success: true,
      message: "Data fetched successfully",
      totalItems: data.length,
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const allProjectsFetch = async (req, res) => {
  const search = req.query.search || "";

  try {
    const filter = {};

    if (search) {
      filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
    }

    const data = await ProjectModel.find(filter, {
      projectName: 1,
      status: 1,
      jobNumber: 1,
      deleveryDate: 1,
      visitDate: 1,
      engineerName: 1,
      updatedAt: 1,
      createdAt: 1,
      OrderMongoId: 1,
      PlanDetails: 1,
      DevelopmentDetials: 1,
      isPlanRecord: 1,
    }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      message: "Data fetched successfully",
      totalItems: data.length,
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const allProjectsFetchDev = async (req, res) => {
  const search = req.query.search || "";

  try {
    const filter = {
      Development: { $in: ["OFFICE", "SITE"] },
    };

    if (search) {
      filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
    }

    const data = await ProjectModel.find(filter, {
      projectName: 1,
      status: 1,
      jobNumber: 1,
      deleveryDate: 1,
      visitDate: 1,
      engineerName: 1,
      updatedAt: 1,
      createdAt: 1,
      OrderMongoId: 1,
      DevelopmentSetcion: 1,
      PlanDetails: 1,
      DevelopmentDetials: 1,
      isPlanRecord: 1,
    }).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    return res.json({
      success: true,
      message: "Data fetched successfully",
      totalItems: data.length,
      data,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getProjectOverview = async (req, res) => {
  try {
    // this is temm
    const filter = {};
    const pipeline = [];

    if (Object.keys(filter).length > 0) {
      pipeline.push({ $match: filter });
    }

    pipeline.push({
      $addFields: {
        deliveryDateObj: {
          $dateFromString: {
            dateString: "$deleveryDate",
            format: "%Y-%m-%d",
            onError: null,
            onNull: null,
          },
        },
        visitDateObj: {
          $dateFromString: {
            dateString: "$visitDate",
            format: "%Y-%m-%d",
            onError: null,
            onNull: null,
          },
        },
      },
    });

    pipeline.push({
      $addFields: {
        compareDate: {
          $cond: [
            { $ne: ["$deliveryDateObj", null] },
            "$deliveryDateObj",
            "$visitDateObj",
          ],
        },
      },
    });
    const dateval = new Date();
    const startDate = new Date(dateval);
    startDate.setDate(dateval.getDate() - 180);
    const endDate = new Date(dateval);
    endDate.setDate(dateval.getDate() + 30);

    pipeline.push({
      $match: {
        status: { $ne: "completed" },
        $or: [
          { EngineerDetails: { $exists: false } },
          { EngineerDetails: { $size: 0 } },
        ],
      },
    });

    pipeline.push({
      $match: {
        $or: [
          { compareDate: { $gte: startDate, $lte: endDate } },
          { visitDateObj: { $gte: startDate, $lte: endDate } },
        ],
      },
    });
    pipeline.push({
      $sort: { compareDate: -1, updatedAt: -1, createdAt: -1 },
    });

    const data = await ProjectModel.aggregate(pipeline);

    const projects = await ProjectModel.find({}).sort({
      updatedAt: -1,
      createdAt: -1,
    });

    const projectStatus = await ProjectDevModel.find().sort({ updatedAt: -1 });
    const latestProjects = projects.slice(0, 3);
    const highPriority = projects
      .filter((p) => {
        const created = new Date(p.createdAt);
        const now = new Date();
        const previousYear = now.getFullYear();
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

    const countEngineer = await EngineerReocord.countDocuments({
      isAssigned: true,
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
      // {
      //   title: "Urgent",
      //   value: statusGroups.urgent.cnt,
      //   color: "#f87171",
      // },

      {
        title: "Urgent",
        value: data.length,
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
      highPriority: projectStatus,
      statusGroups: {
        ...statusGroups,
        urgent: { name: "Urgent", cnt: data.length },
      },
      chart,
      todayworkNotice: count,
      todayNotice: countEngineer,
    });
  } catch (error) {
    console.error("Error in dashboard API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getEngineerOverview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    const engineer = await EngineerReocord.findById(id).select(
      "name email active assignments"
    );
    if (!engineer) {
      return res.status(404).json({
        success: false,
        message: "Engineer not found",
      });
    }

    const latestProjects = await EngineerReocord.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$assignments" },
      {
        $lookup: {
          from: "projects",
          localField: "assignments.projectId",
          foreignField: "_id",
          as: "projectData",
        },
      },
      { $unwind: { path: "$projectData", preserveNullAndEmptyArrays: true } },
      { $sort: { "assignments.assignedAt": -1 } },
      { $limit: 3 },
      {
        $project: {
          _id: 0,
          projectId: "$projectData._id",
          projectName: {
            $ifNull: ["$projectData.projectName", "$assignments.projectName"],
          },
          jobNumber: {
            $ifNull: ["$projectData.jobNumber", "$assignments.jobNumber"],
          },
          client: "$projectData.client",
          endUser: "$projectData.endUser",
          Development: "$projectData.Development",
          location: "$projectData.location",
          assignedAt: "$assignments.assignedAt",
        },
      },
    ]);

    const totalWorkStatus = await workStatusModel.countDocuments({
      submittedBy: new mongoose.Types.ObjectId(id),
    });

    const totalStartChecklist = await StartChecklistsModel.countDocuments({
      submittedBy: new mongoose.Types.ObjectId(id),
    });

    const totalEndChecklist = await EndChecklistsModel.countDocuments({
      submittedBy: new mongoose.Types.ObjectId(id),
    });

    const chartData = [
      { title: "Work Status", value: totalWorkStatus, color: "#3b82f6" },
      {
        title: "Start Checklist",
        value: totalStartChecklist,
        color: "#10b981",
      },
      { title: "End Checklist", value: totalEndChecklist, color: "#f59e0b" },
    ];

    res.status(200).json({
      success: true,
      engineer: {
        id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        active: engineer.active,
      },
      overview: {
        latestProjects,
        totalWorkStatus,
        totalStartChecklist,
        totalEndChecklist,
        chartData,
      },
    });
  } catch (error) {
    console.error("❌ Error in getEngineerOverview:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getEngineerProjectsPaginated = async (req, res) => {
  try {
    const { id } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const engineer = await EngineerReocord.findById(id).select(
      "name email active"
    );
    if (!engineer) {
      return res.status(404).json({
        success: false,
        message: "Engineer not found",
      });
    }
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $unwind: "$assignments" },
      // { $sort: { "assignments.assignedAt": -1 } },
      { $sort: { "projectData.updatedAt": -1 } },
      {
        $lookup: {
          from: "projects",
          localField: "assignments.projectId",
          foreignField: "_id",
          as: "projectData",
        },
      },
      { $unwind: { path: "$projectData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          projectId: "$projectData._id",
          projectName: {
            $ifNull: ["$projectData.projectName", "$assignments.projectName"],
          },
          jobNumber: {
            $ifNull: ["$projectData.jobNumber", "$assignments.jobNumber"],
          },
          engineerName: "$projectData.engineerName",
          entityType: "$projectData.entityType",
          soType: "$projectData.soType",
          startChecklist: "$projectData.StartChecklist",
          endChecklist: "$projectData.EndChecklist",
          endUser: "$projectData.endUser",
          client: "$projectData.client",
          Development: "$projectData.Development",
          location: "$projectData.location",
          expenseScope: "$projectData.expenseScope",
          workScope: "$projectData.workScope",
          assignedAt: "$assignments.assignedAt",
          endTime: "$assignments.endTime",
          durationDays: "$assignments.durationDays",
        },
      },
      { $skip: skip },
      { $limit: limit },
    ];

    const assignments = await EngineerReocord.aggregate(pipeline);

    const totalCount = await EngineerReocord.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $project: { total: { $size: "$assignments" } } },
    ]);

    const totalAssignments = totalCount[0]?.total || 0;

    return res.status(200).json({
      success: true,
      message: "Engineer assignments fetched successfully",
      engineer: {
        _id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        active: engineer.active,
        totalAssignments,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalAssignments / limit),
        totalItems: totalAssignments,
      },
      assignments,
    });
  } catch (error) {
    console.error("❌ Error fetching engineer projects:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

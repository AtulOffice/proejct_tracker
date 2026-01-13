import mongoose from "mongoose";
import ProjectModel from "../models/Project.model.js";
import workStatusModel from "../models/WorkStatus.model.js";
import EngineerReocord from "../models/engineers.model.js";
import ProjectDevModel from "../models/Project.Dev.model.js";
import StartChecklistsModel from "../models/startCheck.model.js";
import EndChecklistsModel from "../models/endCheckList.js";
import Order from "../models/orderSheet.model.js";
import PlanningModel from "../models/dev.Planning.model.js";
import EngineerProgressReport from "../models/devProgressReport.models.js"

export const RecordsformaveNew = async (req, res) => {
  try {
    const { jobNumber, OrderMongoId, ...projectFields } = req.body;
    if (!jobNumber) {
      return res.status(400).json({
        success: false,
        message: "Job number is required",
      });
    }

    if (!OrderMongoId) {
      return res.status(400).json({
        success: false,
        message: "OrderMongoId is required",
      });
    }
    const existingProject = await ProjectModel.findOne({ jobNumber });
    if (existingProject) {
      return res.status(400).json({
        success: false,
        message: "Job number is already stored",
      });
    }

    const project = await ProjectModel.create({
      ...projectFields,
      jobNumber,
      OrderMongoId,
    });
    const updatedOrder = await Order.findByIdAndUpdate(
      OrderMongoId,
      {
        ProjectDetails: project._id,
        isSaveInProject: true,
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Project saved and linked to order successfully.",
      data: {
        project,
        order: updatedOrder,
      },
    });
  } catch (error) {
    console.error("Project Save Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const updateRecordsDocs = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      CustomerDevDocuments,
      SIEVPLDevDocuments,
      swDevDocumentsforFat,
      inspectionDocuments,
      dispatchDocuments,
      PostCommisionDocuments,
      CustomerDevDocumentsRemarks,
      SIEVPLDevDocumentsRemarks,
      ...otherData
    } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    const project = await ProjectModel.findById(id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    Object.keys(otherData).forEach((key) => {
      if (project.schema.path(key)) {
        project[key] = otherData[key];
      }
    });
    const mergeNested = (target = {}, source) => {
      if (!source) return target;

      Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          target[key] = mergeNested(target[key] || {}, value);
        } else {
          target[key] = value;
        }
      });
      return target;
    };

    if (CustomerDevDocuments) {
      project.CustomerDevDocuments = mergeNested(
        project.CustomerDevDocuments,
        CustomerDevDocuments
      );
    }

    if (SIEVPLDevDocuments) {
      project.SIEVPLDevDocuments = mergeNested(
        project.SIEVPLDevDocuments,
        SIEVPLDevDocuments
      );
    }

    if (swDevDocumentsforFat) {
      project.swDevDocumentsforFat = mergeNested(
        project.swDevDocumentsforFat,
        swDevDocumentsforFat
      );
    }

    if (inspectionDocuments) {
      project.inspectionDocuments = mergeNested(
        project.inspectionDocuments,
        inspectionDocuments
      );
    }

    if (PostCommisionDocuments) {
      project.PostCommisionDocuments = mergeNested(
        project.PostCommisionDocuments,
        PostCommisionDocuments
      );
    }
    if (dispatchDocuments && Array.isArray(dispatchDocuments)) {
      dispatchDocuments.forEach((newPhase) => {
        const phaseIndex = newPhase.phaseIndex;
        if (phaseIndex == null) return;

        const existingPhase = project.dispatchDocuments.find(
          (p) => p.phaseIndex === phaseIndex
        );

        if (existingPhase) {
          mergeNested(existingPhase, newPhase);
        } else {
          project.dispatchDocuments.push(newPhase);
        }
      });
    }
    if (typeof CustomerDevDocumentsRemarks === "string") {
      project.CustomerDevDocumentsRemarks = CustomerDevDocumentsRemarks;
    }

    if (typeof SIEVPLDevDocumentsRemarks === "string") {
      project.SIEVPLDevDocumentsRemarks = SIEVPLDevDocumentsRemarks;
    }
    project.isProjectDocssave = true;

    const dataval = await project.save();
    return res.status(200).json({
      success: true,
      message: "Documents updated successfully.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

export const updateRecords = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      engineerData,
      CustomerDevDocuments,
      SIEVPLDevDocuments,
      swDevDocumentsforFat,
      inspectionDocuments,
      dispatchDocuments,
      PostCommisionDocuments,
      CustomerDevDocumentsRemarks,
      SIEVPLDevDocumentsRemarks,
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

    const mergeNested = (target = {}, source) => {
      if (!source) return target;

      Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          target[key] = mergeNested(target[key] || {}, value);
        } else {
          target[key] = value;
        }
      });

      return target;
    };

    if (CustomerDevDocuments) {
      project.CustomerDevDocuments = mergeNested(
        project.CustomerDevDocuments,
        CustomerDevDocuments
      );
    }

    if (SIEVPLDevDocuments) {
      project.SIEVPLDevDocuments = mergeNested(
        project.SIEVPLDevDocuments,
        SIEVPLDevDocuments
      );
    }

    if (swDevDocumentsforFat) {
      project.swDevDocumentsforFat = mergeNested(
        project.swDevDocumentsforFat,
        swDevDocumentsforFat
      );
    }

    if (inspectionDocuments) {
      project.inspectionDocuments = mergeNested(
        project.inspectionDocuments,
        inspectionDocuments
      );
    }

    if (PostCommisionDocuments) {
      project.PostCommisionDocuments = mergeNested(
        project.PostCommisionDocuments,
        PostCommisionDocuments
      );
    }
    if (dispatchDocuments && Array.isArray(dispatchDocuments)) {
      dispatchDocuments.forEach((newPhase) => {
        const phaseIndex = newPhase.phaseIndex;
        if (phaseIndex == null) return;

        const existingPhase = project.dispatchDocuments.find(
          (p) => p.phaseIndex === phaseIndex
        );

        if (existingPhase) {
          mergeNested(existingPhase, newPhase);
        } else {
          project.dispatchDocuments.push(newPhase);
        }
      });
    }
    if (typeof CustomerDevDocumentsRemarks === "string") {
      project.CustomerDevDocumentsRemarks = CustomerDevDocumentsRemarks;
    }

    if (typeof SIEVPLDevDocumentsRemarks === "string") {
      project.SIEVPLDevDocumentsRemarks = SIEVPLDevDocumentsRemarks;
    }

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

export const updateRecordsSession = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const {
      engineerData,
      CustomerDevDocuments,
      SIEVPLDevDocuments,
      swDevDocumentsforFat,
      inspectionDocuments,
      dispatchDocuments,
      PostCommisionDocuments,
      CustomerDevDocumentsRemarks,
      SIEVPLDevDocumentsRemarks,
      OrderMongoId,
      ...otherData
    } = req.body;

    if (!id) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "ID is required" });
    }

    const project = await ProjectModel.findById(id).session(session);

    if (!project) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    Object.keys(otherData).forEach((key) => {
      if (project.schema.path(key)) project[key] = otherData[key];
    });

    const mergeNested = (target = {}, source) => {
      if (!source) return target;

      Object.entries(source).forEach(([key, value]) => {
        if (value && typeof value === "object" && !Array.isArray(value)) {
          target[key] = mergeNested(target[key] || {}, value);
        } else {
          target[key] = value;
        }
      });

      return target;
    };

    if (CustomerDevDocuments) {
      project.CustomerDevDocuments = mergeNested(
        project.CustomerDevDocuments,
        CustomerDevDocuments
      );
    }

    if (SIEVPLDevDocuments) {
      project.SIEVPLDevDocuments = mergeNested(
        project.SIEVPLDevDocuments,
        SIEVPLDevDocuments
      );
    }

    if (swDevDocumentsforFat) {
      project.swDevDocumentsforFat = mergeNested(
        project.swDevDocumentsforFat,
        swDevDocumentsforFat
      );
    }

    if (inspectionDocuments) {
      project.inspectionDocuments = mergeNested(
        project.inspectionDocuments,
        inspectionDocuments
      );
    }

    if (PostCommisionDocuments) {
      project.PostCommisionDocuments = mergeNested(
        project.PostCommisionDocuments,
        PostCommisionDocuments
      );
    }

    if (dispatchDocuments && Array.isArray(dispatchDocuments)) {
      dispatchDocuments.forEach((newPhase) => {
        const phaseIndex = newPhase.phaseIndex;
        if (phaseIndex == null) return;

        const existingPhase = project.dispatchDocuments.find(
          (p) => p.phaseIndex === phaseIndex
        );

        if (existingPhase) {
          mergeNested(existingPhase, newPhase);
        } else {
          project.dispatchDocuments.push(newPhase);
        }
      });
    }

    if (typeof CustomerDevDocumentsRemarks === "string") {
      project.CustomerDevDocumentsRemarks = CustomerDevDocumentsRemarks;
    }

    if (typeof SIEVPLDevDocumentsRemarks === "string") {
      project.SIEVPLDevDocumentsRemarks = SIEVPLDevDocumentsRemarks;
    }

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
          projToengObjectId,
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

    await project.save({ session });

    const updatedProject = await ProjectModel.findById(project._id)
      .session(session)
      .lean();

    let updatedCount = 0;
    let skippedEngineers = [];
    let notFoundEngineers = [];
    let failedEngineers = [];

    for (const eng of transformedEngineers) {
      try {
        const engineer = await EngineerReocord.findById(eng.engineerId).session(
          session
        );

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

        await EngineerReocord.findByIdAndUpdate(eng.engineerId, updateOps, {
          new: true,
          session,
        });

        updatedCount++;
      } catch (err) {
        failedEngineers.push(eng.engineerId);
      }
    }

    await session.commitTransaction();
    session.endSession();

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
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ success: false, message: e.message });
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
    const data = await ProjectModel.findById(id).populate(
      "OrderMongoId",
      ` jobNumber entityType soType bookingDate client endUser site actualDeleveryDate
    orderNumber orderDate deleveryDate name technicalEmail phone amndReqrd
    orderValueSupply orderValueService orderValueTotal cancellation
    paymentAdvance paymentPercent1 paymentType1 paymentType1other paymentAmount1
    payemntCGBG1 paymentrecieved1 paymentPercent2 paymentType2 paymentType2other
    paymentAmount2 payemntCGBG2 paymentrecieved2 paymentPercent3 paymentType3
    paymentType3other paymentAmount3 payemntCGBG3 paymentrecieved3 poReceived
    status creditDays dispatchStatus billPending billingStatus jobDescription remarks
    concerningSalesManager ProjectDetails isSaveInProject retentionYesNo retentionPercent
    retentionAmount retentionDocs retentinoDocsOther retentionType retentionPeriod
    invoiceTerm invoicePercent mileStone invoicemileStoneOther createdBy updatedBy
    createdAt updatedAt `
    );

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

    if (devStatus && ["LOGIC", "SCADA", "BOTH"].includes(devStatus)) {
      filter.Development = devStatus;
    } else if (!devStatus) {
      filter.Development = { $in: ["LOGIC", "SCADA", "BOTH"] };
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
          (!devStatus &&
            ["LOGIC", "SCADA", "BOTH"].includes(result.Development)))
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
    const pipeline = [];
    if (search) {
      pipeline.push({
        $match: {
          jobNumber: { $regex: new RegExp(`^${search}$`, "i") },
        },
      });
    }
    pipeline.push({
      $lookup: {
        from: "orders",
        localField: "OrderMongoId",
        foreignField: "_id",
        as: "OrderMongoId",
      },
    });

    pipeline.push({
      $unwind: {
        path: "$OrderMongoId",
        preserveNullAndEmptyArrays: true,
      },
    });
    pipeline.push({
      $addFields: {
        deliveryDateObj: "$OrderMongoId.deleveryDate",
        visitDateObj: "$visitDate",
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

    pipeline.push({
      $sort: { compareDate: -1, updatedAt: -1, createdAt: -1 },
    });

    pipeline.push({
      $match: {
        service: { $in: ["DEV", "DEVCOM", "COMMISSIONING"] },
      },
    });

    pipeline.push({
      $project: {
        _id: 1,
        projectName: 1,
        jobNumber: 1,
        status: 1,
        visitDate: 1,
        createdAt: 1,
        updatedAt: 1,
        deleveryDate: "$OrderMongoId.deleveryDate",
        service: 1,
        OrderMongoId: "$OrderMongoId._id",
      },
    });

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

export const getAllProjectsnew = async (req, res) => {
  try {
    const docsProjects = await ProjectModel.find({
      isProjectDocssave: false,
    })
      .select(
        "jobNumber entityType soType client _id Development priority ScadaPlace LogicPlace devScope CommisinionPO Workcommission commScope LinkedOrderNumber service"
      )
      .populate(
        "OrderMongoId",
        "name technicalEmail phone bookingDate client endUser site concerningSalesManager deleveryDate actualDeleveryDate"
      )
      .sort({
        updatedAt: -1,
        createdAt: -1,
      });
    res.status(200).json({
      success: true,
      count: docsProjects.length,
      docsProjects,
    });
  } catch (error) {
    console.error("Error fetching Projects For docs save:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Docs Project",
      error: error.message,
    });
  }
};

export const getAllProjectsnewbyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID",
      });
    }

    const docsProject = await ProjectModel.findById(id)
      .select(
        "jobNumber entityType soType client _id Development priority ScadaPlace LogicPlace devScope CommisinionPO Workcommission commScope LinkedOrderNumber service swname swtechnicalEmail swphone isMailSent lotval CustomerDevDocuments SIEVPLDevDocuments swDevDocumentsforFat inspectionDocuments dispatchDocuments PostCommisionDocuments SIEVPLDevDocumentsRemarks CustomerDevDocumentsRemarks lotval"
      )
      .populate(
        "OrderMongoId",
        "name technicalEmail phone bookingDate client endUser site concerningSalesManager deleveryDate actualDeleveryDate"
      )

    if (!docsProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found or Docs already saved",
      });
    }

    res.status(200).json({
      success: true,
      docsProject,
      message: "data fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching Projects For docs save:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching Docs Project",
      error: error.message,
    });
  }
};

export const allProjectsFetch = async (req, res) => {
  const search = req.query.search || "";

  try {
    const filter = {};

    if (search) {
      // filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
      filter.jobNumber = { $regex: search, $options: "i" };
    }

    const projects = await ProjectModel.find(filter, {
      projectName: 1,
      status: 1,
      jobNumber: 1,
      visitDate: 1,
      OrderMongoId: 1,
      createdAt: 1,
      updatedAt: 1,
    })
      .populate({
        path: "OrderMongoId",
        select: "deleveryDate bookingDate endUser actualDeleveryDate",
      })
      .sort({
        updatedAt: -1,
        createdAt: -1,
      });

    const data = projects.map((p) => ({
      _id: p._id,
      projectName: p.projectName,
      jobNumber: p.jobNumber,
      status: p.status,
      visitDate: p.visitDate || null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      deleveryDate: p.OrderMongoId?.deleveryDate || null,
      bookingDate: p.OrderMongoId?.bookingDate || null,
      endUser: p.OrderMongoId?.endUser || null,
      actualDeleveryDate: p.OrderMongoId?.actualDeleveryDate || null,
      OrderMongoId: p.OrderMongoId
        ? {
          _id: p.OrderMongoId._id,
          deleveryDate: p.OrderMongoId.deleveryDate || null,
          bookingDate: p.OrderMongoId.bookingDate || null,
          endUser: p.OrderMongoId.endUser || null,
          actualDeleveryDate: p.OrderMongoId.actualDeleveryDate || null,
        }
        : null,
    }));

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
      Development: { $in: ["LOGIC", "SCADA", "BOTH"] },
    };

    if (search) {
      filter.jobNumber = { $regex: new RegExp(`^${search}$`, "i") };
    }

    const projectSelectFields = {
      jobNumber: 1,
      projectName: 1,
      status: 1,
      visitDate: 1,
      Development: 1,
      createdAt: 1,
      updatedAt: 1,
      OrderMongoId: 1,
      isPlanRecord: 1,
      service: 1,
      Development: 1,
      LogicPlace: 1,
      ScadaPlace: 1,
      PlanDetails: 1,
      devScope: 1,
      commScope: 1,
    };

    const projects = await ProjectModel.find(filter, projectSelectFields)
      .populate({
        path: "OrderMongoId",
        select: `
      -paymentAdvance
      -paymentPercent1 -paymentType1 -paymentType1other -paymentAmount1 -payemntCGBG1 -paymentrecieved1
      -paymentPercent2 -paymentType2 -paymentType2other -paymentAmount2 -payemntCGBG2 -paymentrecieved2
      -paymentPercent3 -paymentType3 -paymentType3other -paymentAmount3 -payemntCGBG3 -paymentrecieved3
      -retentionYesNo -retentionPercent -retentionAmount -retentionDocs -retentinoDocsOther 
      -retentionType -retentionPeriod
      -__v
    `,
      })
      .sort({
        updatedAt: -1,
        createdAt: -1,
      });
    return res.json({
      success: true,
      message: "Data fetched successfully",
      totalItems: projects.length,
      data: projects,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

export const ProjectsFetchDevById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Project ID is required",
      });
    }

    const projectSelectFields = {
      jobNumber: 1,
      projectName: 1,
      status: 1,
      visitDate: 1,
      Development: 1,
      createdAt: 1,
      updatedAt: 1,
      OrderMongoId: 1,
      isPlanRecord: 1,
      service: 1,
      LogicPlace: 1,
      ScadaPlace: 1,
      PlanDetails: 1,
      devScope: 1,
      commScope: 1,
    };

    const project = await ProjectModel.findById(
      id,
      projectSelectFields
    ).populate({
      path: "OrderMongoId",
      select: `
          -paymentAdvance
          -paymentPercent1 -paymentType1 -paymentType1other -paymentAmount1 -payemntCGBG1 -paymentrecieved1
          -paymentPercent2 -paymentType2 -paymentType2other -paymentAmount2 -payemntCGBG2 -paymentrecieved2
          -paymentPercent3 -paymentType3 -paymentType3other -paymentAmount3 -payemntCGBG3 -paymentrecieved3
          -retentionYesNo -retentionPercent -retentionAmount -retentionDocs -retentinoDocsOther
          -retentionType -retentionPeriod
          -__v
        `,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.json({
      success: true,
      message: "Project fetched successfully",
      data: project,
    });
  } catch (err) {
    console.error("Error fetching project by ID:", err);
    return res.status(500).json({
      success: false,
      error: "Server error",
      details: err.message,
    });
  }
};


export const calculateOverallProgressForAllPlannings = async () => {
  const plans = await PlanningModel.find({})
    .populate("allEngineers", "name empId developmentProjectList")
    .lean();

  const results = [];

  for (const plan of plans) {
    if (!Array.isArray(plan.allEngineers) || plan.allEngineers.length === 0) {
      continue;
    }

    const projectId = plan.ProjectDetails;

    const progressReports = await EngineerProgressReport.find({ projectId })
      .populate("submittedBy", "_id")
      .lean();

    if (!progressReports.length) continue;
    const reportMap = {};
    for (const r of progressReports) {
      const key = `${r.submittedBy._id}_${r.SectionId}_${r.phaseId}`;
      if (!reportMap[key]) reportMap[key] = [];
      reportMap[key].push(r);
    }

    const TYPES = ["logic", "scada", "testing"];
    const sectionMap = {};

    for (const engineer of plan.allEngineers) {
      TYPES.forEach(type => {
        const devSections = engineer.developmentProjectList?.[type] || [];

        devSections.forEach(section => {
          if (!section.project) return;
          if (section.project.toString() !== projectId.toString()) return;

          section.phases?.forEach(phase => {
            const sectionName = phase.sectionName || "Unnamed Section";
            const phaseIndex = phase.phaseIndex ?? 0;

            if (!sectionMap[sectionName]) {
              sectionMap[sectionName] = {
                sectionName,
                phaseIndex,
                logic: { engineers: [] },
                scada: { engineers: [] },
                testing: { engineers: [] },
              };
            }

            const key = `${engineer._id}_${section._id}_${phase._id}`;
            const reports = reportMap[key] || [];
            if (!reports.length) return;

            const typeBucket = sectionMap[sectionName][type];

            let engineerEntry = typeBucket.engineers.find(
              e => e.engineerId.toString() === engineer._id.toString()
            );

            if (!engineerEntry) {
              engineerEntry = {
                engineerId: engineer._id,
                progressReports: [],
              };
              typeBucket.engineers.push(engineerEntry);
            }

            engineerEntry.progressReports.push(...reports);
          });
        });
      });
    }

    const orderedSections = Object.values(sectionMap).sort(
      (a, b) => a.phaseIndex - b.phaseIndex
    );
    if (!orderedSections.length) continue;

    const overallProgress = await calculateOverallProgress(orderedSections);
    if (
      overallProgress.logic === 0 &&
      overallProgress.scada === 0 &&
      overallProgress.testing === 0
    ) {
      continue;
    }

    results.push({
      planningId: plan._id,
      projectId,
      jobNumber: plan.jobNumber,
      projectName: plan.projectName,
      overallProgress,
    });
  }
  return results;
};

export const getProjectOverview = async (req, res) => {
  try {
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

    // const projectStatus = await ProjectDevModel.find().sort({ updatedAt: -1 });
    const projectStatus = await calculateOverallProgressForAllPlannings()

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
        projectIncludeDev: [],
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

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Engineer ID",
      });
    }

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

      {
        $lookup: {
          from: "projects",
          localField: "assignments.projectId",
          foreignField: "_id",
          as: "projectData",
        },
      },
      { $unwind: { path: "$projectData", preserveNullAndEmptyArrays: true } },
      { $sort: { "projectData.updatedAt": -1 } },
      {
        $project: {
          _id: "$projectData._id",
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
          orderNumber: "$projectData.orderNumber",
          orderDate: "$projectData.orderDate",
          ContactPersonNumber: "$projectData.ContactPersonNumber",
          technicalEmail: "$projectData.technicalEmail",
          ContactPersonName: "$projectData.ContactPersonName",
          visitDate: "$projectData.visitDate",
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


// export const getEngineerProjects = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const engineer = await EngineerReocord.findById(id).select(
//       "name email active"
//     );
//     if (!engineer) {
//       return res.status(404).json({
//         success: false,
//         message: "Engineer not found",
//       });
//     }
//     const pipeline = [
//       { $match: { _id: new mongoose.Types.ObjectId(id) } },
//       { $unwind: "$assignments" },

//       {
//         $lookup: {
//           from: "projects",
//           localField: "assignments.projectId",
//           foreignField: "_id",
//           as: "projectData",
//         },
//       },
//       { $unwind: { path: "$projectData", preserveNullAndEmptyArrays: true } },

//       { $sort: { "projectData.updatedAt": -1 } },

//       {
//         $project: {
//           _id: "$projectData._id",
//           projectName: {
//             $ifNull: ["$projectData.projectName", "$assignments.projectName"],
//           },
//           jobNumber: {
//             $ifNull: ["$projectData.jobNumber", "$assignments.jobNumber"],
//           },
//           engineerName: "$projectData.engineerName",
//           entityType: "$projectData.entityType",
//           soType: "$projectData.soType",
//           startChecklist: "$projectData.StartChecklist",
//           endChecklist: "$projectData.EndChecklist",
//           endUser: "$projectData.endUser",
//           client: "$projectData.client",
//           Development: "$projectData.Development",
//           location: "$projectData.location",
//           expenseScope: "$projectData.expenseScope",
//           workScope: "$projectData.workScope",
//           assignedAt: "$assignments.assignedAt",
//           endTime: "$assignments.endTime",
//           durationDays: "$assignments.durationDays",
//           orderNumber: "$projectData.orderNumber",
//           orderDate: "$projectData.orderDate",
//           ContactPersonNumber: "$projectData.ContactPersonNumber",
//           technicalEmail: "$projectData.technicalEmail",
//           ContactPersonName: "$projectData.ContactPersonName",
//           visitDate: "$projectData.visitDate",
//         },
//       },
//     ];

//     const assignments = await EngineerReocord.aggregate(pipeline);

//     return res.status(200).json({
//       success: true,
//       message: "Engineer assignments fetched successfully",
//       engineer: {
//         _id: engineer._id,
//         name: engineer.name,
//         email: engineer.email,
//         active: engineer.active,
//         totalAssignments: assignments.length,
//       },
//       assignments,
//     });
//   } catch (error) {
//     console.error("❌ Error fetching engineer projects:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error",
//       error: error.message,
//     });
//   }
// };


export const getEngineerProjects = async (req, res) => {
  try {
    const { id } = req.params;
    const { search } = req.query;

    const engineer = await EngineerReocord.findById(id).select(
      "name email active"
    );

    if (!engineer) {
      return res.status(404).json({
        success: false,
        message: "Engineer not found",
      });
    }
    const searchFilter = search
      ? {
        $or: [
          { "projectData.projectName": { $regex: search, $options: "i" } },
          { "projectData.jobNumber": { $regex: search, $options: "i" } },
          { "projectData.client": { $regex: search, $options: "i" } },
          { "projectData.endUser": { $regex: search, $options: "i" } },
          { "projectData.orderNumber": { $regex: search, $options: "i" } },
        ],
      }
      : {};

    const pipeline = [
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
      {
        $lookup: {
          from: "orders",
          localField: "projectData.OrderMongoId",
          foreignField: "_id",
          as: "orderData",
        },
      },
      {
        $unwind: {
          path: "$orderData",
          preserveNullAndEmptyArrays: true,
        },
      },

      ...(search ? [{ $match: searchFilter }] : []),

      { $sort: { "projectData.updatedAt": -1 } },

      {
        $project: {
          _id: "$projectData._id",
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
          orderNumber: "$projectData.orderNumber",
          orderDate: "$projectData.orderDate",
          ContactPersonNumber: "$projectData.ContactPersonNumber",
          technicalEmail: "$projectData.technicalEmail",
          ContactPersonName: "$projectData.ContactPersonName",
          visitDate: "$projectData.visitDate",
          createdAt: "$projectData.createdAt",
          updatedAt: "$projectData.updatedAt",
          OrderMongoId: {
            $cond: [
              { $ifNull: ["$orderData._id", false] },
              { _id: "$orderData._id" },
              "$$REMOVE"
            ]
          }
        },
      },
    ];

    const assignments = await EngineerReocord.aggregate(pipeline);

    return res.status(200).json({
      success: true,
      message: "Engineer projects fetched successfully",
      engineer: {
        _id: engineer._id,
        name: engineer.name,
        email: engineer.email,
        active: engineer.active,
        totalAssignments: assignments.length,
      },
      assignments,
    });
  } catch (error) {
    console.error("❌ Error fetching engineer projects:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


export const calculateOverallProgress = async (sections) => {
  const TYPES = ["logic", "scada", "testing"];

  const bucket = {
    logic: [],
    scada: [],
    testing: [],
  };

  sections.forEach(section => {
    TYPES.forEach(type => {
      section[type]?.engineers?.forEach(engineer => {
        if (!engineer.progressReports?.length) return;

        const latestReport = engineer.progressReports.reduce((latest, curr) =>
          new Date(curr.createdAt) > new Date(latest.createdAt) ? curr : latest
        );

        bucket[type].push(latestReport.actualCompletionPercent || 0);
      });
    });
  });

  const avg = (arr) =>
    arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

  return {
    logic: avg(bucket.logic),
    scada: avg(bucket.scada),
    testing: avg(bucket.testing),
  };
};


export const getAdminProjectProgressByPlanning = async (req, res) => {
  try {
    const { planningId } = req.params;

    if (!planningId) {
      return res.status(400).json({
        success: false,
        message: "planningId is required",
      });
    }

    const plan = await PlanningModel.findById(planningId)
      .populate("allEngineers", "name email empId developmentProjectList")
      .lean();

    if (!plan) {
      return res.status(404).json({
        success: false,
        message: "Planning not found",
      });
    }

    const projectId = plan.ProjectDetails;

    const progressReports = await EngineerProgressReport.find({ projectId })
      .populate("submittedBy", "name email empId")
      .lean();
    const reportMap = {};
    for (const r of progressReports) {
      const key = `${r.submittedBy._id}_${r.SectionId}_${r.phaseId}`;
      if (!reportMap[key]) reportMap[key] = [];
      reportMap[key].push(r);
    }

    const TYPES = ["logic", "scada", "testing"];
    const sectionMap = {};
    plan.allEngineers.forEach((engineer) => {
      TYPES.forEach((type) => {
        const devSections = engineer.developmentProjectList?.[type] || [];

        devSections.forEach((section) => {
          if (section.project.toString() !== projectId.toString()) return;

          section.phases.forEach((phase) => {
            const sectionName = phase.sectionName || "Unnamed Section";
            const phaseIndex = phase.phaseIndex;

            if (!sectionMap[sectionName]) {
              sectionMap[sectionName] = {
                sectionName,
                phaseIndex,
                logic: { engineers: [] },
                scada: { engineers: [] },
                testing: { engineers: [] },
              };
            }

            const key = `${engineer._id}_${section._id}_${phase._id}`;
            const reports = reportMap[key] || [];

            if (reports.length === 0) return;

            const typeBucket = sectionMap[sectionName][type];

            let engineerEntry = typeBucket.engineers.find(
              (e) => e.engineerId.toString() === engineer._id.toString()
            );

            if (!engineerEntry) {
              engineerEntry = {
                engineerId: engineer._id,
                name: engineer.name,
                email: engineer.email,
                empId: engineer.empId,
                progressReports: [],
              };
              typeBucket.engineers.push(engineerEntry);
            }

            engineerEntry.progressReports.push(...reports);
          });
        });
      });
    });

    const orderedSections = Object.values(sectionMap).sort(
      (a, b) => a.phaseIndex - b.phaseIndex
    );
    const overallProgress = await calculateOverallProgress(orderedSections);

    const normalizedPlanRange = plan.plans.map(section => {

      const base =
        section.documents?.[0] ||
        section.scada?.[0] ||
        section.logic?.[0] ||
        section.testing?.[0];

      return {
        sectionName: base.sectionName,
        sectionStartDate: base.sectionStartDate,
        sectionEndDate: base.sectionEndDate,

        phases: {
          documents: section.documents?.[0]
            ? {
              startDate: section.documents[0].startDate,
              endDate: section.documents[0].endDate,
            }
            : null,

          scada: section.scada?.[0]
            ? {
              startDate: section.scada[0].startDate,
              endDate: section.scada[0].endDate,
            }
            : null,

          logic: section.logic?.[0]
            ? {
              startDate: section.logic[0].startDate,
              endDate: section.logic[0].endDate,
            }
            : null,

          testing: section.testing?.[0]
            ? {
              startDate: section.testing[0].startDate,
              endDate: section.testing[0].endDate,
            }
            : null,
        }
      };
    });


    return res.status(200).json({
      success: true,
      messsage: "progress dev fetches succuessfullly",
      planRange: normalizedPlanRange,
      planningId,
      projectId,
      overallProgress,
      projectName: plan.projectName,
      jobNumber: plan.jobNumber,
      sections: orderedSections,
    });
  } catch (error) {
    console.error("getAdminProjectProgressByPlanning error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

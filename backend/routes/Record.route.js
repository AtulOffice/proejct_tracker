import express from "express";
import {
  Pagination,
  PaginationCatogary,
  Paginationsotype,
  Recordsformave,
  UrgentProjectPegination,
  deleteRecord,
  findrecord,
  findrecordbyId,
  findrecordbyJobnumber,
  getProjectOverview,
  updateRecords,
} from "../controller/record.controller.js";

export const RecordRouter = express.Router();

RecordRouter.post("/save", Recordsformave);
RecordRouter.get("/getProjectOverview", getProjectOverview);
RecordRouter.get("/fetch", findrecord);
RecordRouter.get("/fetch/:id", findrecordbyId);
RecordRouter.get("/fetchbyjob", findrecordbyJobnumber);
RecordRouter.put("/update/:id", updateRecords);
RecordRouter.delete("/delete/:id", deleteRecord);
RecordRouter.get("/pagination", Pagination);
RecordRouter.get("/catogray/pagination", PaginationCatogary);
RecordRouter.get("/sotype/pagination", Paginationsotype);
RecordRouter.get("/urgentProject/pagination", UrgentProjectPegination);

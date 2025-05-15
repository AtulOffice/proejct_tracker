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
import rateLimit from "express-rate-limit";

export const RecordRouter = express.Router();

const limiter = rateLimit({
  windowMs: 1 * 30 * 1000,
  max: 2,
  message: {
    success: false,
    message: "you  hit too many request plase wait 2 minutes",
  },
});

// app.use(limiter);

// RecordRouter.get("/fetch",limiter, findrecord);
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

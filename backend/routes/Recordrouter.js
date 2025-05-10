import express from "express";
import {
  Pagination,
  Recordsformave,
  deleteRecord,
  findrecord,
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

RecordRouter.post("/save", Recordsformave);
RecordRouter.get("/fetch", findrecord);
RecordRouter.put("/update/:id", updateRecords);
// RecordRouter.get("/fetch",limiter, findrecord);
RecordRouter.delete("/delete/:id", deleteRecord);
RecordRouter.get("/pagination", Pagination);

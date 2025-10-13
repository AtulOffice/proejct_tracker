import express from "express";
import dotenv from "dotenv";
import { ProjectRouter } from "./routes/project.route.js";
import { ConnDB } from "./db.js";
import { userRouter } from "./routes/user.route.js";
import cors from "cors";
import { WorkstsRouter } from "./routes/WorkStatus.route.js";
import rateLimit from "express-rate-limit";
import { engineerStatus } from "./cronJobs.js";
import { ProjectDevRouter } from "./routes/projectDev.route.js";
import cookieParser from "cookie-parser";
import { EngineerRouter } from "./routes/engineer.route.js";
import { DevRecordRouter } from "./routes/devlopment.Record.router.js";
dotenv.config();

const port = process.env.PORT || 9000;
const app = express();

// engineerStatus();

const corsOptions = {
  origin: [
    `${process.env.FRONT_PORT}`,
    "https://warlike-unlubricative-angelo.ngrok-free.dev",
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 240,
  message: {
    success: false,
    message: "You hit too many requests. Please wait 2 minutes.",
  },
});
// app.use(limiter);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello i am server of form submission");
});
app.use("/api/v1", ProjectRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/worksts", WorkstsRouter);
app.use("/api/v1/projectDev", ProjectDevRouter);
app.use("/api/v1/engineer", EngineerRouter);
app.use("/api/v1/devrecord", DevRecordRouter);

app.listen(port, async () => {
  await ConnDB({ str: process.env.DBSTR });
  console.log(`server is linsten on port ${port}`);
});

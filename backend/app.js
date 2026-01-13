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
import { EngineerRouterside } from "./routes/engineerside.route.js";
import { DevRecordRouter } from "./routes/devlopment.Record.route.js";
import { PlannigRouter } from "./routes/dev.Planning.route.js";
import { engineerAuthRouter } from "./routes/engineer.auth.route.js";
import { OrderRouter } from "./routes/Order.route.js";
import { ImageUploadRouter } from "./routes/image.route.js";
import { StartRouter } from "./routes/startCheckList.routes.js";
import { EndRouter } from "./routes/endCheckList.routes.js";
import { MarketRouter } from "./routes/marketing.route.js";
import { connectRedis } from "./utils/redis.js"
dotenv.config();

const port = process.env.PORT || 9000;
const app = express();
app.use(express.json({ limit: "110mb" }));

// engineerStatus();

const corsOptions = {
  origin: [
    `${process.env.FRONT_PORT}`,
    `${process.env.ENG_PORT}`,
    `http://localhost:5173`,
    `http://localhost:5174`,
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

app.get("/hello", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "hello i am server of form submission" });
});
app.use("/api/v1", ProjectRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/projectDev", ProjectDevRouter);
app.use("/api/v1/engineer", EngineerRouter);
app.use("/api/v1/engineerside", EngineerRouterside);
app.use("/api/v1/devrecord", DevRecordRouter);
app.use("/api/v1/planningDev", PlannigRouter);
app.use("/api/v1/engineerauth", engineerAuthRouter);
app.use("/api/v1/order", OrderRouter);
app.use("/api/v1/imageUploader", ImageUploadRouter);
app.use("/api/v1/worksts", WorkstsRouter);
app.use("/api/v1/startCheck", StartRouter);
app.use("/api/v1/endCheck", EndRouter);
app.use("/api/v1/market", MarketRouter)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.listen(port, async () => {
  await ConnDB({ str: process.env.DBSTR });
  await connectRedis()
  console.log(`server is linsten on port ${port}`);
});

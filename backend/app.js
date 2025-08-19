import express from "express";
import dotenv from "dotenv";
import { RecordRouter } from "./routes/Record.route.js";
import { ConnDB } from "./db.js";
import { userRouter } from "./routes/user.route.js";
import cors from "cors";
import { WorkstsRouter } from "./routes/WorkStatus.route.js";
import rateLimit from "express-rate-limit";
import { setupCronJobs } from "./cronJobs.js";
import { ProjectDevRouter } from "./routes/projectDev.route.js";
dotenv.config();

const port = process.env.PORT || 9000;
const app = express();
// setupCronJobs();

const corsOptions = {
  origin: process.env.FRONT_PORT,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// app.use(cors(corsOptions));
const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 240,
  message: {
    success: false,
    message: "You hit too many requests. Please wait 2 minutes.",
  },
});
// app.use(limiter);
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello i am server of form submission");
});
app.use("/api/v1", RecordRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/worksts", WorkstsRouter);
app.use("/api/v1/projectDev", ProjectDevRouter);

app.listen(port, () => {
  ConnDB({ str: process.env.DBSTR });
  console.log(`server is linsten on port ${port}`);
});

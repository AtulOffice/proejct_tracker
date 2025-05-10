import express from "express";
import dotenv from "dotenv";
import { RecordRouter } from "./routes/Recordrouter.js";
import { ConnDB } from "./db.js";
import { userRouter } from "./routes/user.route.js";
import cors from "cors";
import { WorkstsRouter } from "./routes/WorkStatus.route.js";
// import { setupCronJobs } from "./cronJobs.js";
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
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello i am server of form submission");
});
app.use("/api/v1", RecordRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1/worksts", WorkstsRouter);

app.listen(port, () => {
  ConnDB({ str: process.env.DBSTR });
  console.log(`server is linsten on port ${port}`);
});

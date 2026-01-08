import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const allowedOrigins = [process.env.SERVER_URL, process.env.ADMIN_URL];

export const apiCors = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

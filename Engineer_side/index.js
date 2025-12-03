import express from "express";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const app = express();

app.get("/api", (req, res) => res.json({ message: "Welcome to our API" }));
app.use(express.static(path.join(__dirname, "./client/dist")));
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});
app.get("/", (req, res) => res.json({ message: "Welcome to our API" }));
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not Found" })
);
const PORT = process.env.PORT || 4005;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise Rejection`);
  server.close(() => {
    server.exit(1);
  });
});
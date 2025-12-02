import express from "express";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import dotenv from "dotenv";
dotenv.config();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

const app = express();

// Default route
app.get("/api", (req, res) => res.json({ message: "Welcome to our API" }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "./client/dist")));

// Catch all other routes to serve frontend (for React/SPA support)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});
// Default route
app.get("/", (req, res) => res.json({ message: "Welcome to our API" }));
app.use((req, res) =>
  res.status(404).json({ success: false, message: "Not Found" })
);

const PORT = process.env.PORT || 4005;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled promise Rejection`);
  server.close(() => {
    server.exit(1);
  });
});
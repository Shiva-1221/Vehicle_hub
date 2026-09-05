import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import adminRoutes from "./routes/adminRoutes";

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "../uploads")
  )
);

// Connect to MongoDB
connectDB();

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "VehicleRent API is running",
  });
});

// Server port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});
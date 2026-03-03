const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===== CORS (พอแค่นี้) ===== */

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

/* ===== Routes ===== */

const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");
const mealRoutes = require("./routes/mealRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reportRoutes = require("./routes/reportRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/meals", mealRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/report", reportRoutes);

/* ===== Start Server ===== */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
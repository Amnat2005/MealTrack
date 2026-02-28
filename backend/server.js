const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());


// routes

const authRoutes =
  require("./routes/authRoutes");

const foodRoutes =
  require("./routes/foodRoutes");

const mealRoutes =
  require("./routes/mealRoutes");

const dashboardRoutes = 
  require("./routes/dashboardRoutes");

const reportRoutes =
  require("./routes/reportRoutes");


// use routes

app.use("/api/auth", authRoutes);

app.use("/api/foods", foodRoutes);

app.use("/api/meals", mealRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/report", reportRoutes);

// start server

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});
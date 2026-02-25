const db = require("../config/db");

// GET all meals (protected)
exports.getMeals = (req, res) => {
  res.json({
    message: "Protected meals route working!",
    user: req.user,
  });
};

// CREATE meal (protected)
exports.createMeal = (req, res) => {
  res.json({
    message: "Create meal route working!",
    user: req.user,
  });
};
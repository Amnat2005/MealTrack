const Food = require("../models/foodModel");

// GET all foods
exports.getFoods = (req, res) => {
  Food.getAllFoods((err, results) => {
    if (err) {
      console.error("SQL ERROR (getFoods):", err);
      return res.status(500).json({ message: err.message });
    }
    res.status(200).json(results);
  });
};

// GET single food by ID
exports.getFood = (req, res) => {
  const id = req.params.id;

  Food.getFoodById(id, (err, results) => {
    if (err) {
      console.error("SQL ERROR (getFood):", err);
      return res.status(500).json({ message: err.message });
    }

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.status(200).json(results[0]);
  });
};

// CREATE new food
exports.createFood = (req, res) => {
  const { name, calories, unit, created_by } = req.body;

  if (!name || !calories) {
    return res.status(400).json({ message: "Name and calories are required" });
  }

  Food.createFood({ name, calories, unit, created_by }, (err, result) => {
    if (err) {
      console.error("SQL ERROR (createFood):", err);
      return res.status(500).json({ message: err.message });
    }

    res.status(201).json({
      message: "Food created successfully",
      id: result.insertId,
    });
  });
};

// UPDATE food
exports.updateFood = (req, res) => {
  const id = req.params.id;
  const { name, calories, unit } = req.body;

  Food.updateFood(id, { name, calories, unit }, (err, result) => {
    if (err) {
      console.error("SQL ERROR (updateFood):", err);
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ message: "Food updated successfully" });
  });
};

// DELETE food
exports.deleteFood = (req, res) => {
  const id = req.params.id;

  Food.deleteFood(id, (err, result) => {
    if (err) {
      console.error("SQL ERROR (deleteFood):", err);
      return res.status(500).json({ message: err.message });
    }

    res.status(200).json({ message: "Food deleted successfully" });
  });
};
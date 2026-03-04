const express = require("express");
const router = express.Router();

const mealController = require("../controllers/mealController");
const { verifyToken } = require("../middleware/authMiddleware");

// GET all meals
router.get("/", verifyToken, mealController.getMeals);

// GET today summary
router.get("/summary/today", verifyToken, mealController.getTodaySummary);

// GET meal by id
router.get("/:id", verifyToken, mealController.getMealById);

// CREATE meal (full flow)
router.post("/", verifyToken, mealController.createMeal);

// DELETE meal
router.delete("/:id", verifyToken, mealController.deleteMeal);

module.exports = router;
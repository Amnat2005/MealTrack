const express = require("express");
const router = express.Router();

const mealController = require("../controllers/mealController");
const { verifyToken } = require("../middleware/authMiddleware");


// GET all meals
router.get(
  "/",
  verifyToken,
  mealController.getMeals
);

router.get(
  "/summary/today",
  verifyToken,
  mealController.getTodaySummary
);

router.get(
  "/:id",
  verifyToken,
  mealController.getMealById
);

router.post(
  "/",
  verifyToken,
  mealController.createMeal
);

router.post(
  "/:mealId/items",
  verifyToken,
  mealController.addMealItem
);

router.delete(
  "/:id",
  verifyToken,
  mealController.deleteMeal
);

module.exports = router;
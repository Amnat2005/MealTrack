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


// GET meal by id
router.get(
  "/:id",
  verifyToken,
  mealController.getMealById
);


// CREATE meal
router.post(
  "/",
  verifyToken,
  mealController.createMeal
);


// ADD food
router.post(
  "/:mealId/items",
  verifyToken,
  mealController.addMealItem
);


module.exports = router;
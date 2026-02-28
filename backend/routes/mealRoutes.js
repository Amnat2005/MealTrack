const express = require("express");
const router = express.Router();

const mealController = require("../controllers/mealController");
const { verifyToken } = require("../middleware/authMiddleware");


// ================= GET ALL MEALS =================
router.get("/", verifyToken, mealController.getMeals);


// ================= GET MEAL BY ID =================
router.get("/:id", verifyToken, mealController.getMealById);


// ================= CREATE MEAL =================
router.post("/", verifyToken, mealController.createMeal);


// ================= ADD FOOD TO MEAL =================
router.post("/:mealId/items", verifyToken, mealController.addMealItem);


module.exports = router;
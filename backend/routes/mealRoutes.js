const express = require("express");
const router = express.Router();
const mealController = require("../controllers/mealController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/", verifyToken, mealController.getMeals);

module.exports = router;
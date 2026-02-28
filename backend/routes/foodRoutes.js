const express = require("express");
const router = express.Router();

const foodController = require("../controllers/foodController");
const { verifyToken } = require("../middleware/authMiddleware");


// GET all foods
router.get(
  "/",
  verifyToken,
  foodController.getFoods
);


// GET food by id
router.get(
  "/:id",
  verifyToken,
  foodController.getFoodById
);


// CREATE food
router.post(
  "/",
  verifyToken,
  foodController.createFood
);


// DELETE food
router.delete(
  "/:id",
  verifyToken,
  foodController.deleteFood
);


module.exports = router;
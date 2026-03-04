const db = require("../config/db");


// ================= GET ALL MEALS =================
exports.getMeals = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT 
        ml.id,
        ml.meal_date,
        ml.meal_type,
        ml.total_calories,
        mi.quantity,
        f.name AS food_name
      FROM meal_logs ml
      LEFT JOIN meal_items mi ON ml.id = mi.meal_log_id
      LEFT JOIN foods f ON mi.food_id = f.id
      WHERE ml.user_id = ?
      ORDER BY ml.meal_date DESC
    `;

    const [rows] = await db.query(sql, [userId]);

    res.json({
      data: rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= GET MEAL BY ID =================
exports.getMealById = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.id;

    const sql = `
      SELECT *
      FROM meal_logs
      WHERE id = ? AND user_id = ?
    `;

    const [rows] = await db.query(sql, [mealId, userId]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Meal not found" });

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= CREATE MEAL (FULL FLOW) =================
exports.createMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { food_id, quantity, meal_type, meal_date } = req.body;

    if (!food_id || !quantity || !meal_type || !meal_date) {
      return res.status(400).json({
        message: "food_id, quantity, meal_type, meal_date required"
      });
    }

    // 1️⃣ หา food
    const [foodRows] = await db.query(
      "SELECT * FROM foods WHERE id = ?",
      [food_id]
    );

    if (foodRows.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    const food = foodRows[0];
    const totalCalories = food.calories * quantity;

    // 2️⃣ สร้าง meal_log
    const [mealResult] = await db.query(
      `INSERT INTO meal_logs
      (user_id, meal_date, meal_type, total_calories)
      VALUES (?, ?, ?, ?)`,
      [userId, meal_date, meal_type, totalCalories]
    );

    const mealId = mealResult.insertId;

    // 3️⃣ เพิ่ม meal_item
    await db.query(
      `INSERT INTO meal_items
      (meal_log_id, food_id, quantity, calories)
      VALUES (?, ?, ?, ?)`,
      [mealId, food_id, quantity, totalCalories]
    );

    res.status(201).json({
      message: "Meal created successfully",
      mealId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= DELETE MEAL =================
exports.deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const mealId = req.params.id;

    const [check] = await db.query(
      "SELECT * FROM meal_logs WHERE id = ? AND user_id = ?",
      [mealId, userId]
    );

    if (check.length === 0)
      return res.status(404).json({ message: "Meal not found" });

    await db.query(
      "DELETE FROM meal_items WHERE meal_log_id = ?",
      [mealId]
    );

    await db.query(
      "DELETE FROM meal_logs WHERE id = ?",
      [mealId]
    );

    res.json({ message: "Meal deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= TODAY SUMMARY =================
exports.getTodaySummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const sql = `
      SELECT
        SUM(total_calories) AS total
      FROM meal_logs
      WHERE user_id = ?
      AND DATE(meal_date) = CURDATE()
    `;

    const [rows] = await db.query(sql, [userId]);

    res.json(rows[0]);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
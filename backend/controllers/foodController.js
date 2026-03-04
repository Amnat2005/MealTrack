const db = require("../config/db");


// ================= GET FOODS =================
exports.getFoods = async (req, res) => {
  try {
    console.log("GET FOODS CALLED");

    const sql = `SELECT * FROM foods ORDER BY name ASC`;

    const [rows] = await db.query(sql);

    res.json(rows);

  } catch (err) {
    console.error("DB ERROR >>>", err);
    res.status(500).json({ message: err.message });
  }
};

// ================= GET FOOD BY ID =================
exports.getFoodById = async (req, res) => {
  try {
    const id = req.params.id;

    const sql = `SELECT * FROM foods WHERE id = ?`;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



// ================= CREATE FOOD =================
exports.createFood = async (req, res) => {
  try {
    const { name, calories, unit } = req.body;

    if (!name || !calories) {
      return res.status(400).json({
        message: "name and calories required"
      });
    }

    const sql = `
      INSERT INTO foods (name, calories, unit)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [name, calories, unit]);

    res.status(201).json({ message: "Food created" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};



exports.deleteFood = async (req, res) => {
  try {
    const foodId = req.params.id;

    await db.query(
      "DELETE FROM meal_items WHERE food_id = ?",
      [foodId]
    );

    await db.query(
      "DELETE FROM foods WHERE id = ?",
      [foodId]
    );

    res.json({ message: "Food deleted" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
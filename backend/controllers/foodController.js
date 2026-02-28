const db = require("../config/db");


// ================= GET FOODS =================
exports.getFoods = (req, res) => {

  const sql = `
    SELECT *
    FROM foods
    ORDER BY name ASC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    res.json(results);

  });

};



// ================= GET FOOD BY ID =================
exports.getFoodById = (req, res) => {

  const id = req.params.id;

  const sql = `
    SELECT *
    FROM foods
    WHERE id = ?
  `;

  db.query(sql, [id], (err, results) => {

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Food not found"
      });
    }

    res.json(results[0]);

  });

};



// ================= CREATE FOOD =================
exports.createFood = (req, res) => {

  const { name, calories, unit } = req.body;

  if (!name || !calories) {
    return res.status(400).json({
      message: "name and calories required"
    });
  }

  const sql = `
    INSERT INTO foods
    (name, calories, unit)
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [name, calories, unit],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Food created"
      });

    }
  );

};



exports.deleteFood = (req, res) => {

  const foodId = req.params.id;

  // ลบใน meal_items ก่อน
  const deleteItemsSql =
    "DELETE FROM meal_items WHERE food_id = ?";

  db.query(
    deleteItemsSql,
    [foodId],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      // แล้วค่อยลบ food
      const deleteFoodSql =
        "DELETE FROM foods WHERE id = ?";

      db.query(
        deleteFoodSql,
        [foodId],
        (err) => {

          if (err) {
            return res.status(500).json({
              message: err.message
            });
          }

          res.json({
            message: "Food deleted"
          });

        }
      );

    }
  );

};
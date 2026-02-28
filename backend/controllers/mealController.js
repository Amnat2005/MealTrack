const db = require("../config/db");


// ================= GET ALL MEALS =================
exports.getMeals = (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT *
    FROM meal_logs
    WHERE user_id = ?
    ORDER BY meal_date DESC
  `;

  db.query(sql, [userId], (err, results) => {

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    res.json(results);

  });

};



// ================= GET MEAL BY ID =================
exports.getMealById = (req, res) => {

  const userId = req.user.id;
  const mealId = req.params.id;

  const sql = `
    SELECT 
      m.id AS meal_id,
      m.meal_date,
      m.meal_type,
      m.total_calories,
      mi.id AS item_id,
      mi.food_id,
      mi.quantity,
      mi.calories,
      f.name
    FROM meal_logs m

    LEFT JOIN meal_items mi
      ON m.id = mi.meal_log_id

    LEFT JOIN foods f
      ON f.id = mi.food_id

    WHERE m.id = ?
    AND m.user_id = ?
  `;

  db.query(sql, [mealId, userId], (err, results) => {

    if (err) {
      return res.status(500).json({
        message: err.message
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Meal not found"
      });
    }

    res.json(results);

  });

};



// ================= CREATE MEAL =================
exports.createMeal = (req, res) => {

  const userId = req.user.id;
  const { meal_date, meal_type } = req.body;

  if (!meal_date || !meal_type) {
    return res.status(400).json({
      message: "meal_date and meal_type required"
    });
  }

  const sql = `
    INSERT INTO meal_logs
    (user_id, meal_date, meal_type, total_calories)
    VALUES (?, ?, ?, 0)
  `;

  db.query(
    sql,
    [userId, meal_date, meal_type],
    (err) => {

      if (err) {
        return res.status(500).json({
          message: err.message
        });
      }

      res.status(201).json({
        message: "Meal created successfully"
      });

    }
  );

};



// ================= TODAY SUMMARY =================
exports.getTodaySummary = (req, res) => {

  const userId = req.user.id;

  const sql = `
    SELECT
      DATE(meal_date) AS date,
      SUM(total_calories) AS total
    FROM meal_logs
    WHERE user_id = ?
    AND DATE(meal_date) = CURDATE()
    GROUP BY DATE(meal_date)
  `;

  db.query(sql, [userId], (err, result) => {

    if (err)
      return res.status(500).json({
        message: err.message
      });

    res.json(result);

  });

};



// ================= ADD FOOD =================
exports.addMealItem = (req, res) => {

  const userId = req.user.id;
  const mealId = req.params.mealId;

  const { food_id, quantity } = req.body;

  if (!food_id || !quantity) {

    return res.status(400).json({
      message: "food_id and quantity required"
    });

  }

  // check meal owner

  const checkMealSql =
    "SELECT * FROM meal_logs WHERE id = ? AND user_id = ?";

  db.query(
    checkMealSql,
    [mealId, userId],
    (err, mealResults) => {

      if (err)
        return res.status(500).json({
          message: err.message
        });

      if (mealResults.length === 0) {

        return res.status(403).json({
          message: "Unauthorized meal"
        });

      }

      // get food

      const foodSql =
        "SELECT * FROM foods WHERE id = ?";

      db.query(
        foodSql,
        [food_id],
        (err, foodResults) => {

          if (err)
            return res.status(500).json({
              message: err.message
            });

          if (foodResults.length === 0) {

            return res.status(404).json({
              message: "Food not found"
            });

          }

          const food = foodResults[0];

          const totalCalories =
            food.calories * quantity;

          // insert item

          const insertSql = `
            INSERT INTO meal_items
            (meal_log_id, food_id, quantity, calories)
            VALUES (?, ?, ?, ?)
          `;

          db.query(
            insertSql,
            [mealId, food_id, quantity, totalCalories],
            (err) => {

              if (err)
                return res.status(500).json({
                  message: err.message
                });

              // update total

              const updateSql = `
                UPDATE meal_logs
                SET total_calories =
                total_calories + ?
                WHERE id = ?
              `;

              db.query(
                updateSql,
                [totalCalories, mealId],
                (err) => {

                  if (err)
                    return res.status(500).json({
                      message: err.message
                    });

                  res.json({
                    message:
                      "Food added to meal successfully"
                  });

                }
              );

            }
          );

        }
      );

    }
  );

};
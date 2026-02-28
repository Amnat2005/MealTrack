const db = require("../config/db");

exports.getDashboard = (req, res) => {

  const userId = req.user.id;

  const todaySql = `
    SELECT
      COUNT(*) AS meals,
      SUM(total_calories) AS calories
    FROM meal_logs
    WHERE user_id = ?
    AND DATE(meal_date) = CURDATE()
  `;

  const foodSql = `
    SELECT COUNT(*) AS foods
    FROM foods
  `;

  const userSql = `
    SELECT id, name, email
    FROM users
    WHERE id = ?
  `;

  db.query(todaySql, [userId], (err, todayResult) => {

    if (err)
      return res.status(500).json({ message: err.message });

    db.query(foodSql, (err, foodResult) => {

      if (err)
        return res.status(500).json({ message: err.message });

      db.query(userSql, [userId], (err, userResult) => {

        if (err)
          return res.status(500).json({ message: err.message });

        res.json({
          today: todayResult[0],
          foods: foodResult[0],
          user: userResult[0]
        });

      });

    });

  });

};
const db = require("../config/db");


exports.getDashboard = (req, res) => {

  const userId = req.user.id;


  const sqlToday = `
    SELECT SUM(total_calories) AS todayCalories
    FROM meal_logs
    WHERE user_id = ?
    AND DATE(meal_date) = CURDATE()
  `;


  const sqlMeals = `
    SELECT COUNT(*) AS totalMeals
    FROM meal_logs
    WHERE user_id = ?
  `;


  const sqlFoods = `
    SELECT COUNT(*) AS totalFoods
    FROM foods
    WHERE created_by = ?
  `;


  db.query(sqlToday, [userId], (err, todayResult) => {

    if (err)
      return res.status(500).json({ message: err.message });


    db.query(sqlMeals, [userId], (err, mealResult) => {

      if (err)
        return res.status(500).json({ message: err.message });


      db.query(sqlFoods, [userId], (err, foodResult) => {

        if (err)
          return res.status(500).json({ message: err.message });


        res.json({

          todayCalories:
            todayResult[0].todayCalories || 0,

          totalMeals:
            mealResult[0].totalMeals,

          totalFoods:
            foodResult[0].totalFoods

        });

      });

    });

  });

};
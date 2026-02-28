const pool = require("../config/db");


// ==========================
// 7 DAYS REPORT
// ==========================
exports.get7DaysReport = async (req, res) => {
  try {

    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
        DATE(m.meal_date) AS date,
        SUM(mi.calories) AS calories
      FROM meal_logs m
      JOIN meal_items mi 
        ON m.id = mi.meal_log_id
      WHERE m.user_id = ?
      AND m.meal_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(m.meal_date)
      ORDER BY date ASC
      `,
      [userId]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};



// ==========================
// RANGE REPORT
// ==========================
exports.getReportRange = async (req, res) => {
  try {

    const userId = req.user.id;
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({
        message: "start and end date required",
      });
    }

    const [rows] = await pool.query(
      `
      SELECT 
        DATE(m.meal_date) AS date,
        SUM(mi.calories) AS total
      FROM meal_logs m
      JOIN meal_items mi 
        ON m.id = mi.meal_log_id
      WHERE m.user_id = ?
      AND DATE(m.meal_date) BETWEEN ? AND ?
      GROUP BY DATE(m.meal_date)
      ORDER BY date
      `,
      [userId, start, end]
    );

    res.json(rows);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
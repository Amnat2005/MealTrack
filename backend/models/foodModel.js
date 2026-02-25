const db = require("../config/db");

exports.getAllFoods = (callback) => {
  db.query("SELECT * FROM foods", callback);
};

exports.getFoodById = (id, callback) => {
  db.query("SELECT * FROM foods WHERE id = ?", [id], callback);
};

exports.createFood = (foodData, callback) => {
  const { name, calories, unit, created_by } = foodData;
  db.query(
    "INSERT INTO foods (name, calories, unit, created_by) VALUES (?, ?, ?, ?)",
    [name, calories, unit, created_by],
    callback
  );
};

exports.updateFood = (id, foodData, callback) => {
  const { name, calories, unit } = foodData;
  db.query(
    "UPDATE foods SET name=?, calories=?, unit=? WHERE id=?",
    [name, calories, unit, id],
    callback
  );
};

exports.deleteFood = (id, callback) => {
  db.query("DELETE FROM foods WHERE id = ?", [id], callback);
};
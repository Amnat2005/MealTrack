const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "mysecretkey";

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // เช็คว่ามีข้อมูลส่งมาจริงไหม
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    const [rows] = await db.query(sql, [email]);

    // เช็คว่าเจอ user ไหม
    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    // เปรียบเทียบรหัสผ่าน
    const isMatch = await bcrypt.compare(password.trim(), user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // สร้าง token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // เช็คว่ามี email ซ้ำไหม
    const checkSql = "SELECT * FROM users WHERE email = ?";
    const [existing] = await db.query(checkSql, [email]);

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const insertSql = "INSERT INTO users (email, password) VALUES (?, ?)";
    await db.query(insertSql, [email, hashedPassword]);

    return res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id; // มาจาก JWT
    const { currentPassword, newPassword } = req.body;

    const [rows] = await db.query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      rows[0].password
    );

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashed, userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
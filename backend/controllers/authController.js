const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

exports.register = async (req, res) => {
  const { name, email, phone, password } = req.body;

  const [existing] = await db.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );

  if (existing.length > 0) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users(name,email,phone,password) VALUES(?,?,?,?)",
    [name, email, phone, hash]
  );

  res.json({ message: "Registered successfully" });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const user = rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
};

exports.me = async (req, res) => {
  const [rows] = await db.query(
    "SELECT id,name,email,phone FROM users WHERE id = ?",
    [req.user.id]
  );

  res.json(rows[0]);
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Email not found" });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 15 * 60 * 1000);

  await db.query(
    "UPDATE users SET reset_token=?, reset_token_expiry=? WHERE email=?",
    [token, expiry, email]
  );

  // Email config
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset",
    text: `Reset your password: ${resetLink}`
  });

  res.json({ message: "Reset link sent to email" });
};
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;

  const [rows] = await db.query(
    "SELECT * FROM users WHERE reset_token=? AND reset_token_expiry > NOW()",
    [token]
  );

  if (rows.length === 0) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  const hash = await bcrypt.hash(password, 10);

  await db.query(
    `UPDATE users 
     SET password=?, reset_token=NULL, reset_token_expiry=NULL
     WHERE reset_token=?`,
    [hash, token]
  );

  res.json({ message: "Password updated successfully" });
};
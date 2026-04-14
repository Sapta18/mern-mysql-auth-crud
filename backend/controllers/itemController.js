const db = require("../config/db");

exports.getItems = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM items WHERE user_id=? ORDER BY id DESC",
    [req.user.id]
  );

  res.json(rows);
};

exports.getItemById = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM items WHERE id=? AND user_id=?",
    [req.params.id, req.user.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ message: "Item not found" });
  }

  res.json(rows[0]);
};

exports.createItem = async (req, res) => {
  const { title, description, status } = req.body;

  await db.query(
    "INSERT INTO items(user_id,title,description,status) VALUES(?,?,?,?)",
    [req.user.id, title, description, status]
  );

  res.json({ message: "Item created" });
};

exports.updateItem = async (req, res) => {
  const { title, description, status } = req.body;

  await db.query(
    `UPDATE items
     SET title=?, description=?, status=?
     WHERE id=? AND user_id=?`,
    [title, description, status, req.params.id, req.user.id]
  );

  res.json({ message: "Item updated" });
};

exports.deleteItem = async (req, res) => {
  await db.query(
    "DELETE FROM items WHERE id=? AND user_id=?",
    [req.params.id, req.user.id]
  );

  res.json({ message: "Item deleted" });
};

exports.getStats = async (req, res) => {
  const [rows] = await db.query(
    `SELECT
      COUNT(*) AS total,
      SUM(status='active') AS active,
      SUM(status='pending') AS pending,
      SUM(status='completed') AS completed
     FROM items
     WHERE user_id=?`,
    [req.user.id]
  );

  res.json(rows[0]);
};
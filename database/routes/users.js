const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all users
router.get("/", (req, res) => {
  db.query("SELECT * FROM Users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add new user
router.post("/", (req, res) => {
  const { user_id, name, email, password } = req.body;

  const sql = `
    INSERT INTO Users (user_id, name, email, password)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [user_id, name, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "User added successfully", user_id });
  });
});

module.exports = router;

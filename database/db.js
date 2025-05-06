const mysql = require("mysql2");
const path = require("path");
const express = require("express");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL Database");
});

app.get("/", (req, res) => {
  db.query("SELECT * FROM Users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add new user
app.post("/", (req, res) => {
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

module.exports = db;

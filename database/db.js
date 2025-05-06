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

// Get all user 
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

// Get scan history for a specific user
app.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT S.scan_id, P.name AS product_name, S.ocr_text, S.image_url, S.scan_time
    FROM Scans S
    JOIN Products P ON S.product_id = P.product_id
    WHERE S.user_id = ? ORDER BY S.scan_time DESC
  `;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add new scan
app.post("/", (req, res) => {
  const { scan_id, user_id, product_id, ocr_text, image_url } = req.body;

  const sql = `
    INSERT INTO Scans (scan_id, user_id, product_id, ocr_text, image_url)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [scan_id, user_id, product_id, ocr_text, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Scan added successfully", scan_id });
  });
});

// Get specific scan
app.get("/:scan_id", (req, res) => {
  const sql = "SELECT * FROM Scans WHERE scan_id = ?";
  db.query(sql, [req.params.scan_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Scan not found" });
    res.json(result[0]);
  });
});

// Get all scans for a specific user
app.get("/user/:user_id", (req, res) => {
  const sql = `
    SELECT S.scan_id, P.name AS product_name, S.ocr_text, S.image_url, S.scan_time
    FROM Scans S
    JOIN Products P ON S.product_id = P.product_id
    WHERE S.user_id = ?
    ORDER BY S.scan_time DESC
  `;
  db.query(sql, [req.params.user_id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Delete a scan
app.delete("/:scan_id", (req, res) => {
  const sql = "DELETE FROM Scans WHERE scan_id = ?";
  db.query(sql, [req.params.scan_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Scan deleted successfully" });
  });
});



module.exports = db;

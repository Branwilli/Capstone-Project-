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

// Get all recommendations for a specific user
app.get("/:user_id", (req, res) => {
  const { user_id } = req.params;
  const sql = `
    SELECT 
      P1.name AS original_product,
      P2.name AS recommended_alternative,
      R.recommendation_reason,
      R.timestamp
    FROM Recommendations R
    JOIN Products P1 ON R.product_id = P1.product_id
    JOIN Products P2 ON R.recommended_product_id = P2.product_id
    WHERE R.user_id = ?
    ORDER BY R.timestamp DESC
  `;
  db.query(sql, [user_id], (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Add new recommendation
app.post("/", (req, res) => {
  const {
    recommendation_id, user_id,
    product_id, recommended_product_id,
    recommendation_reason
  } = req.body;

  const sql = `
    INSERT INTO Recommendations (
      recommendation_id, user_id, product_id,
      recommended_product_id, recommendation_reason
    )
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    recommendation_id, user_id,
    product_id, recommended_product_id,
    recommendation_reason
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Recommendation added successfully", recommendation_id });
  });
});

// Get recommendations related to a product
// app.get("/product/:product_id", (req, res) => {
//   const sql = `
//     SELECT 
//       R.recommendation_id,
//       R.user_id,
//       P1.name AS original_product,
//       P2.name AS recommended_alternative,
//       R.recommendation_reason,
//       R.timestamp
//     FROM Recommendations R
//     JOIN Products P1 ON R.product_id = P1.product_id
//     JOIN Products P2 ON R.recommended_product_id = P2.product_id
//     WHERE R.product_id = ?
//   `;

//   db.query(sql, [req.params.product_id], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });


// Delete recommendations
app.delete("/:recommendation_id/:user_id", (req, res) => {
  const sql = `
    DELETE FROM Recommendations
    WHERE recommendation_id = ? AND user_id = ?
  `;

  db.query(sql, [req.params.recommendation_id, req.params.user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Recommendation deleted successfully" });
  });
});

app.get("/feedback", (req, res) => {
  const sql = `
    SELECT 
      P1.name AS original_product,
      P1.health_score AS original_score,
      P2.name AS recommended_product,
      R.recommendation_reason
    FROM Recommendations R
    JOIN Products P1 ON R.product_id = P1.product_id
    JOIN Products P2 ON R.recommended_product_id = P2.product_id
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all products
app.get("/", (req, res) => {
  db.query("SELECT * FROM Products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get peoduct by ID
app.get("/:id", (req, res) => {
  const sql = "SELECT * FROM Products WHERE product_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
});

// Add new product
app.post("/", (req, res) => {
  const {
    product_id, name, brand, calories,
    sodium, sugar, fats, cholesterol,
    protein, vitamins, calcium, iron,
    potassium, health_score
  } = req.body;

  const sql = `
    INSERT INTO Products (
      product_id, name, brand, calories, sodium, sugar, fats, cholesterol,
      protein, vitamins, calcium, iron, potassium, health_score
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [
    product_id, name, brand, calories,
    sodium, sugar, fats, cholesterol,
    protein, vitamins, calcium, iron,
    potassium, health_score
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Product added successfully", product_id });
  });
});

//Search product by name or brand
app.get("/search/:query", (req, res) => {
  const q = `%${req.params.query}%`;
  const sql = "SELECT * FROM Products WHERE name LIKE ? OR brand LIKE ?";
  db.query(sql, [q, q], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//Top healthiest Products
app.get("/rankings/healthiest", (req, res) => {
  const sql = "SELECT * FROM Products ORDER BY health_score DESC LIMIT 5";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//Update a product
app.put("/:id", (req, res) => {
  const { name, brand, calories, sodium, sugar, fats, cholesterol, protein, vitamins, calcium, iron, potassium, health_score } = req.body;
  const sql = `
    UPDATE Products SET
    name = ?, brand = ?, calories = ?, sodium = ?, sugar = ?, fats = ?, cholesterol = ?, protein = ?,
    vitamins = ?, calcium = ?, iron = ?, potassium = ?, health_score = ?
    WHERE product_id = ?
  `;
  db.query(sql, [
    name, brand, calories, sodium, sugar, fats, cholesterol, protein,
    vitamins, calcium, iron, potassium, health_score, req.params.id
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product updated successfully" });
  });
});

// Delete a product
app.delete("/:id", (req, res) => {
  db.query("DELETE FROM Products WHERE product_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted successfully" });
  });
});

module.exports = db;

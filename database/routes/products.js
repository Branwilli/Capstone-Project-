const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM Products", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get peoduct by ID
router.get("/:id", (req, res) => {
  const sql = "SELECT * FROM Products WHERE product_id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "Product not found" });
    res.json(result[0]);
  });
});

// Add new product
router.post("/", (req, res) => {
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
router.get("/search/:query", (req, res) => {
  const q = `%${req.params.query}%`;
  const sql = "SELECT * FROM Products WHERE name LIKE ? OR brand LIKE ?";
  db.query(sql, [q, q], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//Top healthiest Products
router.get("/rankings/healthiest", (req, res) => {
  const sql = "SELECT * FROM Products ORDER BY health_score DESC LIMIT 5";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//Update a product
router.put("/:id", (req, res) => {
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
router.delete("/:id", (req, res) => {
  db.query("DELETE FROM Products WHERE product_id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Product deleted successfully" });
  });
});


module.exports = router;

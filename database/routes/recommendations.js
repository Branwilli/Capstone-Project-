const express = require("express");
const db = require("../db");
const router = express.Router();

// Get all recommendations for a specific user
router.get("/:user_id", (req, res) => {
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
router.post("/", (req, res) => {
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
// router.get("/product/:product_id", (req, res) => {
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
router.delete("/:recommendation_id/:user_id", (req, res) => {
  const sql = `
    DELETE FROM Recommendations
    WHERE recommendation_id = ? AND user_id = ?
  `;

  db.query(sql, [req.params.recommendation_id, req.params.user_id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Recommendation deleted successfully" });
  });
});

router.get("/feedback", (req, res) => {
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


module.exports = router;

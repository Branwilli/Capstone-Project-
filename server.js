const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db_config'); // Import the database configuration

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/api/profile', async (req, res) => {
  const { healthConditions, age, gender } = req.body;
  try {
    const query = 'INSERT INTO profiles (healthConditions, age, gender) VALUES (?, ?, ?)';
    await db.query(query, [healthConditions, age, gender]);
    res.status(200).json({ message: 'Profile saved!' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ error: 'Failed to save profile.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/users"));
app.use("/api/products", require("./routes/products"));
app.use("/api/scans", require("./routes/scans"));
app.use("/api/recommendations", require("./routes/recommendations"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

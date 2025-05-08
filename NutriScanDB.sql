CREATE DATABASE NutriScanDB;
USE NutriScanDB;

-- USERS
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- PRODUCTS
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    calories VARCHAR(100),
    sodium FLOAT,
    sugar FLOAT,
    fats FLOAT,
    cholesterol FLOAT,
    protein FLOAT,
    vitamins FLOAT,
    calcium FLOAT,
    iron FLOAT,
    potassium FLOAT,
    health_score DECIMAL(3,1) CHECK (health_score BETWEEN 0 AND 10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SCANS
CREATE TABLE Scans (
    scan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_id INT,
    ocr_text TEXT,
    image_url VARCHAR(255),
    scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE SET NULL
);

-- RECOMMENDATIONS
CREATE TABLE Recommendations (
    recommendation_id INT AUTO_INCREMENT,
    user_id INT,
    product_id INT,
    recommended_product_id INT,
    recommendation_reason TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (recommendation_id, user_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE,
    FOREIGN KEY (recommended_product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

-- FEEDBACK VIEW
CREATE VIEW Feedback AS
SELECT
  P1.name AS original_product,
  P1.health_score AS original_score,
  P2.name AS recommended_product,
  R.recommendation_reason
FROM Recommendations R
JOIN Products P1 ON R.product_id = P1.product_id
JOIN Products P2 ON R.recommended_product_id = P2.product_id;

INSERT INTO Users (name, email, password) VALUES
('John Doe', 'john.doe@email.com', 'pw_123'),
('Jane Smith', 'jane.smith@email.com', 'pw_456'),
('Alice Johnson', 'alice.johnson@email.com', 'pw_789'),
('Michael Brown', 'michael.brown@email.com', 'pw_321'),
('Emily Davis', 'emily.davis@email.com', 'pw_654');

INSERT INTO Products (name, brand, calories, sodium, sugar, fats, cholesterol, protein, vitamins, calcium, iron, potassium, health_score) VALUES
('Whole Grain Cereal', 'HealthyChoice', '150', 120.5, 6.2, 2.5, 0.0, 5.0, 12.0, 35.0, 18.0, 220.0, 8.9),
('Chocolate Flavored Milk', 'DairyBest', '200', 190.0, 22.0, 8.0, 10.0, 6.5, 8.0, 25.0, 2.0, 300.0, 5.2),
('Low-Fat Yogurt', 'NutriYogurt', '120', 80.0, 8.5, 2.0, 5.0, 9.0, 15.0, 40.0, 10.0, 180.0, 7.5),
('Organic Granola Bar', 'NatureBites', '180', 90.0, 12.0, 6.5, 0.0, 4.0, 10.0, 30.0, 12.5, 150.0, 7.8),
('Soda - Cola Flavor', 'FizzDrink', '250', 40.0, 39.0, 0.0, 0.0, 0.0, 0.0, 5.0, 0.5, 10.0, 2.1);

INSERT INTO Scans (user_id, product_id, ocr_text, image_url) VALUES
(1, 1, 'Calories: 150, Sodium: 120mg, Sugar: 6g, Protein: 5g, Fats: 2.5g', 'https://example.com/images/scan_001.jpg'),
(2, 2, 'Calories: 200, Sodium: 190mg, Sugar: 22g, Protein: 6.5g, Fats: 8g', 'https://example.com/images/scan_002.jpg'),
(3, 3, 'Calories: 120, Sodium: 80mg, Sugar: 8.5g, Protein: 9g, Fats: 2g', 'https://example.com/images/scan_003.jpg'),
(4, 4, 'Calories: 180, Sodium: 90mg, Sugar: 12g, Protein: 4g, Fats: 6.5g', 'https://example.com/images/scan_004.jpg'),
(5, 5, 'Calories: 250, Sodium: 40mg, Sugar: 39g, Protein: 0g, Fats: 0g', 'https://example.com/images/scan_005.jpg');

INSERT INTO Recommendations (user_id, product_id, recommended_product_id, recommendation_reason) VALUES
(1, 2, 3, 'Lower sugar and higher protein alternative to Chocolate Flavored Milk.'),
(2, 5, 1, 'Whole Grain Cereal is a healthier choice than soda.'),
(3, 4, 3, 'Low-Fat Yogurt is a better snack than Granola Bar due to lower sugar.'),
(4, 1, 4, 'Granola Bar is a good portable alternative to Whole Grain Cereal.'),
(5, 3, 1, 'Whole Grain Cereal offers more fiber and energy than Low-Fat Yogurt.'),
(1, 4, 1, 'Whole Grain Cereal offers more fiber and energy than Low-Fat Yogurt.');

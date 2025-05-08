# NutriScan

NutriScan is an application that analyzes food products for nutritional content and provides personalized health insights and recommendations. It leverages AI and OCR to extract and interpret nutritional information from product images, scores products based on health metrics using heuristics, and presents results with personalized feedback.

---

## Features

- **OCR Scanning:** Extracts nutritional data from product images.
- **Nutritional Scoring:** Calculates health scores from product images (e.g., NutriScore, chemical risk, lipids, etc.).
- **Personalized Recommendations:** AI-driven suggestions based on user health profiles.
- **User Feedback:** Collects and displays user ratings and feedback.
- **Modern UI:**  React frontend with data visualization.

---

## Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 18+
- npm (Node Package Manager)
- pip (Python Package Installer)

### 1. Backend (Python)

1. Create and activate a virtual environment:
   ```
   python -m venv myenv
   myenv\Scripts\activate 
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### 2. Database/API Server (Node.js/Express)

1. Navigate to the `database/` directory:
   ```
   cd database
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   node server.js
   ```

### 3. Frontend (React)

1. Navigate to the `FrontEnd/` directory:
   ```
   cd FrontEnd
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```
---

## Usage

- Upload or scan a food product label.
- View nutritional breakdown, scores, and AI recommendations.
- Provide feedback and rate the analysis.

---

## Technologies Used

- **Frontend:** React, Bootstrap, CSS
- **Backend:** Python (Flask/Custom), OCR libraries, AI/ML models
- **API/DB:** Node.js, Express, SQL (SQLite/MySQL)
- **Other:** Pandas, Numpy, Rich, OpenAI, Google Generative AI.

---

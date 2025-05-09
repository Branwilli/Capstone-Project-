from flask import Flask, request, jsonify
import mysql.connector
import sys
import os
import base64
import cv2
import numpy as np
import uuid
from pathlib import Path 


backend_path = Path(__file__).resolve().parent/".."/'Backend'
sys.path.append(str(backend_path))

# Feedback module imports
from Feedback.feedback import generate_suggestion, get_location
from Feedback.rating import show_rating_panel, submit_rating, update_stars

# OCR module imports
from OCR.OCR import (
    apply_threshold,
    capture_image,
    categorize_text,
    convert_to_grayscale,
    correct_nutrient_name,
    correct_ocr_errors,
    extract_line_nutrients,
    extract_lines,
    extract_text,
    is_numeric_token,
    layout_analysis,
    nlp_entity_match,
    preprocess_image,
    resize_image,
    select_image,
    process_image_from_array
)

# Scoring module imports
from Scoring.Beverage_Score import Beverage_Score
from Scoring.General_Score import General_Score
from Scoring.Lipids_Score import Lipids_Score
from Scoring.Package import PackageComponent
from Scoring.Score import Score

# Initialize Flask app
recommendations = Flask(__name__)

# Database connection function
def db_connect():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Every-one1",
        database="NutriScanDB"
    )

# Get all recommendations for a user
@recommendations.route("/api/recommendations/<int:user_id>", methods=["GET"])
def get_user_recommendations(user_id):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            P1.name AS original_product,
            P2.name AS recommended_alternative,
            R.recommendation_reason,
            R.timestamp
        FROM Recommendations R
        JOIN Products P1 ON R.product_id = P1.product_id
        JOIN Products P2 ON R.recommended_product_id = P2.product_id
        WHERE R.user_id = %s
        ORDER BY R.timestamp DESC
    """, (user_id,))
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# Add a new recommendation
@recommendations.route("/api/recommendations", methods=["POST"])
def add_recommendation():
    try:
        data = request.get_json()
        image_data = data.get('image')

        if not image:
            return jsonify({'error': 'No image provided'}), 400
        
        image_data = data['image'].split(',')[1]  
        image_bytes = base64.b64decode(image_data)
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if image is None:
            return jsonify({"error": "Could not decode image"}), 400

        nutrition_data = process_image_from_array(image)
        if not nutrition_data.get('nutrients'):
            return jsonify({"error": "No nutrients detected in image"}), 400
       
        Product_Name = data.get('productInfo', 'Unknown')
        
        score = Score({
            nutrition_data['nutrients'],
            Product_Name 
        })
        score_result = score.evaluate()

        feedback = generate_suggestion(score_result, Product_Name)

        return feedback
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    '''data = request.json
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    sql = """
        INSERT INTO Recommendations (user_id, product_id, recommended_product_id, recommendation_reason)
        VALUES (%s, %s, %s, %s)
    """
    values = (
        data["user_id"],
        data["product_id"],
        data["recommended_product_id"],
        data["recommendation_reason"]
    )
    cursor.execute(sql, values)
    db.commit()
    new_id = cursor.lastrowid
    db.close()
    return jsonify({ "message": "Recommendation added", "recommendation_id": new_id }), 201
'''
    
# Delete a recommendation
@recommendations.route("/api/recommendations/<int:recommendation_id>/<int:user_id>", methods=["DELETE"])
def delete_recommendation(recommendation_id, user_id):
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Recommendations WHERE recommendation_id = %s AND user_id = %s", (recommendation_id, user_id))
    db.commit()
    db.close()
    return jsonify({ "message": "Recommendation deleted successfully" })

# Feedback view (product + reason)
@recommendations.route("/api/recommendations/feedback", methods=["GET"])
def feedback_view():
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            P1.name AS original_product,
            P1.health_score AS original_score,
            P2.name AS recommended_product,
            R.recommendation_reason
        FROM Recommendations R
        JOIN Products P1 ON R.product_id = P1.product_id
        JOIN Products P2 ON R.recommended_product_id = P2.product_id
    """)
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# Feedback for a specific user
@recommendations.route("/api/recommendations/feedback/<int:user_id>", methods=["GET"])
def user_feedback(user_id):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT 
            P1.name AS original_product,
            P1.health_score AS original_score,
            P2.name AS recommended_product,
            R.recommendation_reason,
            R.timestamp
        FROM Recommendations R
        JOIN Products P1 ON R.product_id = P1.product_id
        JOIN Products P2 ON R.recommended_product_id = P2.product_id
        WHERE R.user_id = %s
        ORDER BY R.timestamp DESC
    """, (user_id,))
    results = cursor.fetchall()
    db.close()
    return jsonify(results)


# Run the app
if __name__ == "__main__":
    recommendations.run(debug=True)

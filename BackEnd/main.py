from flask import Flask, request, jsonify
import mysql.connector
import os
from dotenv import load_dotenv

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


app = Flask(__name__)
load_dotenv()

# Reusable database connection
def db_connect():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )

# Get all users
@app.route("/api/users", methods=["GET"])
def get_all_users():
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("SELECT * FROM users")

    users_result = cursor.fetchall()
    #print(users_result)
    users_list = []
    for id, fname, lname, addr, email in users_result:
        users_list.append({'UserID': id, 'FirstName': fname, 'Last Name': lname, 'Addres': addr, 'email': email, })
    cursor.close()
    db.close()
    print(users_list)
    return jsonify(users_list)

# Add new user
@app.route("/api/users", methods=["POST"])
def add_user():
    data = request.json
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    sql = "INSERT INTO Users (name, email, password) VALUES (%s, %s, %s)"
    values = (data["name"], data["email"], data["password"])
    cursor.execute(sql, values)
    db.commit()
    new_id = cursor.lastrowid
    db.close()
    return jsonify({ "message": "User added successfully", "user_id": new_id }), 201

# Get all scans for a specific user
@app.route("/api/scans/user/<int:user_id>", methods=["GET"])
def get_user_scans(user_id):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("""
        SELECT S.scan_id, P.name AS product_name, S.ocr_text, S.image_url, S.scan_time
        FROM Scans S
        JOIN Products P ON S.product_id = P.product_id
        WHERE S.user_id = %s
        ORDER BY S.scan_time DESC
    """, (user_id,))
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# Add a new scan
@app.route("/api/scans", methods=["POST"])
def add_scan():
    data = request.json
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    sql = "INSERT INTO Scans (user_id, product_id, ocr_text, image_url) VALUES (%s, %s, %s, %s)"
    values = (data["user_id"], data["product_id"], data["ocr_text"], data["image_url"])
    cursor.execute(sql, values)
    db.commit()
    new_id = cursor.lastrowid
    db.close()
    return jsonify({ "message": "Scan added", "scan_id": new_id }), 201

# Get a specific scan by ID
@app.route("/api/scans/<int:scan_id>", methods=["GET"])
def get_scan(scan_id):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Scans WHERE scan_id = %s", (scan_id,))
    result = cursor.fetchone()
    db.close()
    if not result:
        return jsonify({ "message": "Scan not found" }), 404
    return jsonify(result)

# Delete a scan by ID
@app.route("/api/scans/<int:scan_id>", methods=["DELETE"])
def delete_scan(scan_id):
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Scans WHERE scan_id = %s", (scan_id,))
    db.commit()
    db.close()
    return jsonify({ "message": "Scan deleted successfully" })

# Get all products
@app.route("/api/products", methods=["GET"])
def get_all_products():
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Products")
    result = cursor.fetchall()
    db.close()
    return jsonify(result)

# Get product by ID
@app.route("/api/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Products WHERE product_id = %s", (product_id,))
    product = cursor.fetchone()
    db.close()
    if not product:
        return jsonify({"message": "Product not found"}), 404
    return jsonify(product)

# Add new product
@app.route("/api/products", methods=["POST"])
def add_product():
    data = request.json
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    sql = """
        INSERT INTO Products (
            name, brand, calories, sodium, sugar, fats, cholesterol,
            protein, vitamins, calcium, iron, potassium, health_score
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        data["name"], data["brand"], data["calories"], data["sodium"], data["sugar"],
        data["fats"], data["cholesterol"], data["protein"], data["vitamins"],
        data["calcium"], data["iron"], data["potassium"], data["health_score"]
    )
    cursor.execute(sql, values)
    db.commit()
    product_id = cursor.lastrowid
    db.close()
    return jsonify({ "message": "Product added", "product_id": product_id }), 201

# Delete product
@app.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Products WHERE product_id = %s", (product_id,))
    db.commit()
    db.close()
    return jsonify({ "message": "Product deleted successfully" })

# Search product by name or brand
@app.route("/api/products/search/<query>", methods=["GET"])
def search_products(query):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    q = f"%{query}%"
    cursor.execute("SELECT * FROM Products WHERE name LIKE %s OR brand LIKE %s", (q, q))
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# Top 5 healthiest products
@app.route("/api/products/rankings/healthiest", methods=["GET"])
def healthiest_products():
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Products ORDER BY health_score DESC LIMIT 5")
    results = cursor.fetchall()
    db.close()
    return jsonify(results)
# Get all recommendations for a user
@app.route("/api/recommendations/<int:user_id>", methods=["GET"])
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
@app.route("/api/recommendations", methods=["POST"])
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
    
    '''
    data = request.json
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
@app.route("/api/recommendations/<int:recommendation_id>/<int:user_id>", methods=["DELETE"])
def delete_recommendation(recommendation_id, user_id):
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Recommendations WHERE recommendation_id = %s AND user_id = %s", (recommendation_id, user_id))
    db.commit()
    db.close()
    return jsonify({ "message": "Recommendation deleted successfully" })

# Feedback view (product + reason)
@app.route("/api/recommendations/feedback", methods=["GET"])
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
@app.route("/api/recommendations/feedback/<int:user_id>", methods=["GET"])
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


if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
import mysql.connector

# Initialize the app
products = Flask(__name__)

# Reusable database connection
def db_connect():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Every-one1",
        database="NutriScanDB"
    )

# Get all products
@products.route("/api/products", methods=["GET"])
def get_all_products():
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Products")
    result = cursor.fetchall()
    db.close()
    return jsonify(result)

# Get product by ID
@products.route("/api/products/<int:product_id>", methods=["GET"])
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
@products.route("/api/products", methods=["POST"])
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
@products.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Products WHERE product_id = %s", (product_id,))
    db.commit()
    db.close()
    return jsonify({ "message": "Product deleted successfully" })

# Search product by name or brand
@products.route("/api/products/search/<query>", methods=["GET"])
def search_products(query):
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    q = f"%{query}%"
    cursor.execute("SELECT * FROM Products WHERE name LIKE %s OR brand LIKE %s", (q, q))
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# Top 5 healthiest products
@products.route("/api/products/rankings/healthiest", methods=["GET"])
def healthiest_products():
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Products ORDER BY health_score DESC LIMIT 5")
    results = cursor.fetchall()
    db.close()
    return jsonify(results)

# Run the app
if __name__ == "__main__":
    products.run(debug=True)

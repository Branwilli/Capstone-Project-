from flask import Flask, request, jsonify
import mysql.connector

# Initialize Flask app
scans = Flask(__name__)

# Database connection function
def db_connect():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="Every-one1",
        database="NutriScanDB"
    )

# Get all scans for a specific user
@scans.route("/api/scans/user/<int:user_id>", methods=["GET"])
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
@scans.route("/api/scans", methods=["POST"])
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
@scans.route("/api/scans/<int:scan_id>", methods=["GET"])
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
@scans.route("/api/scans/<int:scan_id>", methods=["DELETE"])
def delete_scan(scan_id):
    db = db_connect()
    cursor = db.cursor()
    cursor.execute("DELETE FROM Scans WHERE scan_id = %s", (scan_id,))
    db.commit()
    db.close()
    return jsonify({ "message": "Scan deleted successfully" })

# Run the app
if __name__ == "__main__":
    scans.run(debug=True)

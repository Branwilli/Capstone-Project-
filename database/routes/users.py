from flask import Blueprint, request, jsonify, Flask
from .db import db_connect

users = Blueprint('users', __name__)

# Get all users
@users.route("/api/users", methods=["GET"])
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
@users.route("/api/users", methods=["POST"])
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

# User login
@users.route("/api/users/login", methods=["POST"])
def login_user():
    data = request.json
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    sql = "SELECT * FROM Users WHERE email = %s AND password = %s"
    values = (data["email"], data["password"])
    cursor.execute(sql, values)
    user = cursor.fetchone()
    cursor.close()
    db.close()
    if user:
        # For demo: assume setup is always complete if user exists
        return jsonify({"message": "Login successful", "user_id": user["id"], "isSetupComplete": True}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

# Get user profile
@users.route("/api/users/profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id")
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    db.close()
    if user:
        return jsonify(user), 200
    else:
        return jsonify({"message": "User not found"}), 404

# Update user profile
@users.route("/api/users/profile", methods=["PUT"])
def update_profile():
    data = request.json
    user_id = data.get("user_id")
    db = db_connect()
    cursor = db.cursor()
    sql = "UPDATE Users SET name=%s, email=%s WHERE id=%s"
    values = (data["name"], data["email"], user_id)
    cursor.execute(sql, values)
    db.commit()
    cursor.close()
    db.close()
    return jsonify({"message": "Profile updated"}), 200


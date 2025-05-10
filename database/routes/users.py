from flask import Blueprint, request, jsonify
from .db import db_connect

users = Blueprint('users', __name__)

# Get all users
@users.route("/api/users", methods=["GET"])
def get_all_users():
    db = db_connect()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users")
    users_list = cursor.fetchall()
    db.close()
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

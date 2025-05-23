import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# Reusable database connection
def db_connect():
    return mysql.connector.connect(
        host=os.getenv('DB_HOST'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        database=os.getenv('DB_NAME')
    )
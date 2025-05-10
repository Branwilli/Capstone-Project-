from flask import Flask
from routes.products import products
from routes.recommendations import recommendations
from routes.scans import scans
from routes.users import users

app = Flask(__name__)

app.register_blueprint(products)
app.register_blueprint(recommendations)
app.register_blueprint(scans)
app.register_blueprint(users)

if __name__ == '__main__':
    app.run(debug=True)
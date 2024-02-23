from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/members")
def members():
    return {"members": ["apple", "banana", "mango"]}

if __name__ == "__main__":
    app.run(debug=True)


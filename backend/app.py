from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/members")
def members():
    return {"members": ["apple", "banana", "mango"]} # remove test data later


@app.route("/submit", methods=["POST"])
def process_data():
    if request.method == "POST":
        try:
            data = request.json # retrieve json data
            extracted_data = data.get("input_data", "")
            numbers_str = extracted_data.split("\n")
            numbers = [int(num) for num in numbers_str]
            result = sum(numbers)
            print(result)
            return {"result": result}

        except Exception as e:
            return {"error": str(e)}, 400

    # if not post method
    return "Invalid request"


if __name__ == "__main__":
    app.run(debug=True)

# TODO: 
    # parse the error values as custom ones if a string is provided for errors, or as a constant error applied to every value if it is provided as a number instead
    # implement custom functions for ceil(x), floor(x), round(x), trunc(x)
    # implement custom functions for sum(x), mean_s(x) sample mean, mean_p(x) population mean
    # implement error propagation sample with latex (ambitious)
    # implement visaulization of data (ambitious)
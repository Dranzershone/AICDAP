from flask import Flask, request, jsonify, render_template
from phishing_detector import analyze_email
from ocr_utils import extract_text_from_image
import os

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze_text():
    email_text = request.json.get("email", "")
    report = analyze_email(email_text, sender_history_count=0)
    return jsonify(report)

@app.route("/analyze-image", methods=["POST"])
def analyze_image():
    file = request.files["image"]
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    extracted_text = extract_text_from_image(file_path)
    report = analyze_email(extracted_text, sender_history_count=0)

    report["Extracted Text"] = extracted_text
    return jsonify(report)

if __name__ == "__main__":
    app.run(debug=True)

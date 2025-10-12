import os
import csv
from flask import Flask, request, jsonify
from urllib.parse import urlparse
import joblib
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'phish_model.pkl')
model = joblib.load(MODEL_PATH)

WHITELIST = {
    "facebook.com",
    "google.com",
    "github.com",
    "microsoft.com",
    "linkedin.com",
    "amazon.com",
    "apple.com",
    "instagram.com",
    "twitter.com",
    "whatsapp.com",
    "paypal.com",
    "yahoo.com",
    "zoom.us",
    "cloudflare.com",
    "stackoverflow.com"
}

THRESHOLD = 0.7


LOGFILE = os.path.join(os.path.dirname(__file__), 'fp_log.csv')

def get_registered_domain(netloc: str) -> str:
    """Return the base registered domain (remove www and port)."""
    host = netloc.split(':')[0].lower()
    if host.startswith("www."):
        host = host[4:]
    return host

def log_case(url, features, pred, prob):
    """Append misclassified / borderline cases for future analysis."""
    try:
        write_header = not os.path.exists(LOGFILE)
        with open(LOGFILE, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if write_header:
                writer.writerow(["url", "pred", "prob"] + [f"f{i}" for i in range(len(features))])
            writer.writerow([url, pred, prob] + list(features))
    except Exception as e:
        print(f"⚠️ Failed to log case: {e}")

from utils.feature_extractor import url_features  


@app.route('/predict', methods=['POST', 'OPTIONS'])
def predict():
    try:
        data = request.get_json()
        if not data or 'url' not in data:
            return jsonify({'error': 'No URL provided'}), 400

        url = data['url']
        parsed = urlparse(url)
        reg_dom = get_registered_domain(parsed.netloc)

   
        if reg_dom in WHITELIST:
            return jsonify({
                'url': url,
                'is_phishing': 0,
                'score': 0.0,
                'reason': 'whitelist'
            })

        features = url_features(url)
        prob = float(model.predict_proba([features])[0][1])
        pred_raw = int(model.predict([features])[0])
        pred = 1 if prob >= THRESHOLD else 0

      
        if pred == 1 and prob < 0.9:
            log_case(url, features, pred, prob)

    
        return jsonify({
            'url': url,
            'is_phishing': pred,
            'score': prob,
            'raw_pred': pred_raw,
            'threshold': THRESHOLD
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return jsonify({'message': 'Phishing Detection API is running 🚀'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)



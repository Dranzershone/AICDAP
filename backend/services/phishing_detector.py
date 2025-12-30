import os
import csv
import logging
from urllib.parse import urlparse
from typing import Dict, Any, Tuple
import joblib
from utils.feature_extractor import url_features

logger = logging.getLogger(__name__)


class PhishingDetector:
    """Service for detecting phishing URLs using ML model"""

    def __init__(self):
        self.model = None
        self.model_path = os.path.join(
            os.path.dirname(__file__), "..", "model", "phish_model.pkl"
        )
        self.logfile = os.path.join(os.path.dirname(__file__), "..", "fp_log.csv")
        self.threshold = 0.7

        # Whitelist of trusted domains
        self.whitelist = {
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
            "stackoverflow.com",
        }

    async def initialize(self):
        """Initialize the phishing detector by loading the model"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                logger.info("Phishing detection model loaded successfully")
            else:
                logger.error(f"Model file not found at {self.model_path}")
                raise FileNotFoundError(f"Model file not found at {self.model_path}")
        except Exception as e:
            logger.error(f"Failed to load phishing detection model: {str(e)}")
            raise

    def get_registered_domain(self, netloc: str) -> str:
        """Return the base registered domain (remove www and port)"""
        host = netloc.split(":")[0].lower()
        if host.startswith("www."):
            host = host[4:]
        return host

    def log_case(self, url: str, features: list, pred: int, prob: float):
        """Append misclassified / borderline cases for future analysis"""
        try:
            write_header = not os.path.exists(self.logfile)
            with open(self.logfile, "a", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                if write_header:
                    writer.writerow(
                        ["url", "pred", "prob"]
                        + [f"f{i}" for i in range(len(features))]
                    )
                writer.writerow([url, pred, prob] + list(features))
        except Exception as e:
            logger.warning(f"Failed to log case: {e}")

    async def analyze_url(self, url: str) -> Dict[str, Any]:
        """Analyze a URL for phishing indicators"""
        try:
            if not self.model:
                raise RuntimeError("Phishing detection model not initialized")

            # Parse URL
            parsed = urlparse(url)
            if not parsed.netloc:
                raise ValueError("Invalid URL provided")

            reg_dom = self.get_registered_domain(parsed.netloc)

            # Check whitelist first
            if reg_dom in self.whitelist:
                return {
                    "url": url,
                    "is_phishing": False,
                    "confidence_score": 0.0,
                    "risk_level": "low",
                    "reason": "Domain is in trusted whitelist",
                    "details": {
                        "domain": reg_dom,
                        "whitelisted": True,
                        "raw_prediction": 0,
                        "threshold": self.threshold,
                    },
                }

            # Extract features and make prediction
            features = url_features(url)
            prob = float(self.model.predict_proba([features])[0][1])
            pred_raw = int(self.model.predict([features])[0])
            pred = 1 if prob >= self.threshold else 0

            # Log borderline cases for model improvement
            if pred == 1 and prob < 0.9:
                self.log_case(url, features, pred, prob)

            # Determine risk level
            risk_level = self._get_risk_level(prob)

            # Generate explanation
            reason = self._generate_explanation(prob, pred, reg_dom)

            return {
                "url": url,
                "is_phishing": bool(pred),
                "confidence_score": round(prob, 4),
                "risk_level": risk_level,
                "reason": reason,
                "details": {
                    "domain": reg_dom,
                    "whitelisted": False,
                    "raw_prediction": pred_raw,
                    "threshold": self.threshold,
                    "features_extracted": len(features),
                },
            }

        except Exception as e:
            logger.error(f"Error analyzing URL {url}: {str(e)}")
            raise

    def _get_risk_level(self, probability: float) -> str:
        """Determine risk level based on probability score"""
        if probability >= 0.8:
            return "high"
        elif probability >= 0.5:
            return "medium"
        elif probability >= 0.3:
            return "low-medium"
        else:
            return "low"

    def _generate_explanation(
        self, probability: float, prediction: int, domain: str
    ) -> str:
        """Generate human-readable explanation for the prediction"""
        if prediction == 1:
            if probability >= 0.9:
                return f"High confidence phishing detection - URL shows strong malicious patterns"
            elif probability >= 0.7:
                return f"Likely phishing URL - suspicious characteristics detected"
            else:
                return f"Potentially suspicious URL - proceed with caution"
        else:
            if probability <= 0.2:
                return f"URL appears safe - no significant threat indicators found"
            else:
                return f"URL appears legitimate but shows some minor suspicious characteristics"

    async def health_check(self) -> Dict[str, Any]:
        """Health check for the phishing detector service"""
        try:
            model_loaded = self.model is not None
            model_exists = os.path.exists(self.model_path)

            return {
                "status": "healthy" if model_loaded else "unhealthy",
                "model_loaded": model_loaded,
                "model_file_exists": model_exists,
                "whitelist_domains": len(self.whitelist),
                "threshold": self.threshold,
            }
        except Exception as e:
            return {"status": "unhealthy", "error": str(e)}

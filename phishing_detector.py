import re
import pandas as pd
import numpy as np
import nltk
import tldextract
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

nltk.download("stopwords")
from nltk.corpus import stopwords

def clean_text(text):
    text = text.lower()
    text = re.sub(r"http\S+", "", text)
    text = re.sub(r"[^a-z\s]", "", text)
    return text.strip()

def train_content_model():
    data = pd.read_csv("sample_emails.csv")
    data["text"] = data["text"].apply(clean_text)

    X_train, X_test, y_train, y_test = train_test_split(
        data["text"], data["label"], test_size=0.2, random_state=42
    )

    vectorizer = TfidfVectorizer(stop_words=stopwords.words("english"))
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    model = LogisticRegression()
    model.fit(X_train_vec, y_train)

    acc = accuracy_score(y_test, model.predict(X_test_vec))
    print(f"[INFO] Content Model Accuracy: {acc:.2f}")

    return model, vectorizer

def content_risk(email, model, vectorizer):
    email = clean_text(email)
    vec = vectorizer.transform([email])
    prob = model.predict_proba(vec)[0][1]
    return prob

def url_risk(email):
    urls = re.findall(r"https?://\S+|www\.\S+", email)
    risk = 0

    for url in urls:
        if re.search(r"\d+\.\d+\.\d+\.\d+", url):
            risk += 0.4

        if "@" in url or "-" in url:
            risk += 0.2

        ext = tldextract.extract(url)
        if ext.domain in ["securelogin", "verifyaccount", "updateinfo"]:
            risk += 0.3

    return min(risk, 1.0)

def sender_behavior(sender_history_count):
    if sender_history_count == 0:
        return 0.6  
    elif sender_history_count < 5:
        return 0.3
    return 0.1

PSYCHOLOGICAL_TRIGGERS = {
    "urgency": ["urgent", "immediately", "within"],
    "fear": ["suspended", "blocked", "compromised"],
    "authority": ["bank", "security team", "it department"],
    "reward": ["won", "prize", "bonus"]
}

def psychology_risk(email):
    score = 0
    reasons = []

    for category, words in PSYCHOLOGICAL_TRIGGERS.items():
        for w in words:
            if w in email.lower():
                score += 0.25
                reasons.append(category)
                break

    return min(score, 1.0), list(set(reasons))

def analyze_email(email_text, sender_history_count):
    content_score = content_risk(email_text, MODEL, VECTORIZER)
    url_score = url_risk(email_text)
    sender_score = sender_behavior(sender_history_count)
    psych_score, psych_reasons = psychology_risk(email_text)

    final_score = (
        0.35 * content_score +
        0.30 * url_score +
        0.20 * sender_score +
        0.15 * psych_score
    )

    classification = (
        "SAFE" if final_score < 0.3 else
        "SUSPICIOUS" if final_score < 0.6 else
        "HIGH-RISK PHISHING"
    )

    return {
        "Content Risk": round(content_score, 2),
        "URL Risk": round(url_score, 2),
        "Sender Risk": round(sender_score, 2),
        "Psychological Risk": round(psych_score, 2),
        "Final Risk Score": round(final_score, 2),
        "Classification": classification,
        "Psychological Indicators": psych_reasons
    }

MODEL, VECTORIZER = train_content_model()

if __name__ == "__main__":
    email = """
    Dear User,
    Your bank account has been suspended due to suspicious activity.
    Verify immediately at http://secure-login-bank.com
    """

    report = analyze_email(email, sender_history_count=0)

    print("\n--- PHISHING RISK REPORT ---")
    for k, v in report.items():
        print(f"{k}: {v}")

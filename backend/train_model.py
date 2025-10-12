import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from utils.feature_extractor import url_features

data = {
    "url": [
        "http://login-paypal.com",
        "http://secure-update.bank-info.ru",
        "http://appleid.support.verify-login.net",
        "https://www.google.com",
        "https://www.github.com",
        "https://www.microsoft.com",
        "http://secure-login-amazon.net",
        "https://www.wikipedia.org",
        "http://facebook-security-alert.com",
        "https://www.stackoverflow.com"
    ],
    "label": [1,1,1,0,0,0,1,0,1,0]
}
df = pd.DataFrame(data)

X = df['url'].apply(url_features).to_list()
y = df['label']
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X, y)


joblib.dump(clf, "model/phish_model.pkl")
print("Saved model to model/phish_model.pkl")

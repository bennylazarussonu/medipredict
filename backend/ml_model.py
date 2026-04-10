import numpy as np
from sklearn.naive_bayes import BernoulliNB
from ml_utils import symptoms_to_vector
import joblib
from database import training_data_collection

MODEL_PATH = "model.joblib"

async def train_model():
    X = []
    y = []
    disease_map = {}
    disease_index = 0

    async for data in training_data_collection.find():
        # Convert symptoms → vector
        # vector = await symptoms_to_vector(data["symptom_vector"])
        X.append(data["symptom_vector"])

        disease = data["true_disease"]
        if disease not in disease_map:
            disease_map[disease] = disease_index
            disease_index += 1

        y.append(disease_map[disease])

    X = np.array(X)
    y = np.array(y)

    model = BernoulliNB()
    model.fit(X, y)

    joblib.dump((model, disease_map), MODEL_PATH)

    print("Model trained and saved")

async def predict_disease(vector):
    model, disease_map = joblib.load("model.joblib")

    probs = model.predict_proba([vector])[0]

    reverse_map = {v: k for k, v in disease_map.items()}

    results = []
    for i, p in enumerate(probs):
        results.append({
            "disease": reverse_map[i],
            "probability": float(p)
        })

    results.sort(key=lambda x: x["probability"], reverse=True)
    return results[:10]
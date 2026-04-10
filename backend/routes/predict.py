from fastapi import APIRouter
from ml_utils import symptoms_to_vector
from ml_model import predict_disease

router = APIRouter()

from fastapi import APIRouter
from ml_utils import symptoms_to_vector
from ml_model import predict_disease
from llm_utils import get_specialist_recommendation
from llm_utils import get_medical_advice

router = APIRouter()

@router.post("/predict")
async def predict(data: dict):
    symptoms = data.get("symptoms", [])
    
    vector = await symptoms_to_vector(symptoms)
    predictions = await predict_disease(vector)

    # Take top 5 diseases
    top_diseases = [p["disease"] for p in predictions[:15]]

    # specialist = await get_specialist_recommendation(top_diseases)
    top_disease = predictions[0]["disease"]
    # advice = await get_medical_advice(top_disease)

    specialists = {}
    advice = {}
    
    for disease in top_diseases:
        specialists[disease] = await get_specialist_recommendation([disease])
        advice[disease] = await get_medical_advice(disease)
    
    return {
        "predictions": predictions,
        "specialists": specialists,
        "advice": advice
    }

    # return {
    #     "symptoms": symptoms,
    #     "predictions": predictions,
    #     "recommended_specialist": specialist,
    #     "medical_advice": advice
    # }
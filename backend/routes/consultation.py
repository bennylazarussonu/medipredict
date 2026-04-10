from fastapi import APIRouter
from datetime import datetime
from database import consultations_collection, symptoms_collection, diseases_collection
from ml_utils import symptoms_to_vector
from ml_model import predict_disease

router = APIRouter()

# @router.post("/consultation")
# async def create_consultation(data: dict):
#     symptoms = data.get("symptoms", [])
    
#     vector = await symptoms_to_vector(symptoms)
#     predictions = await predict_disease(vector)

#     doc = {
#         "patient_name": data.get("patient_name"),
#         "age": data.get("age"),
#         "gender": data.get("gender"),
#         "vitals": data.get("vitals"),
#         "symptoms": symptoms,
#         "symptom_vector": vector,
#         "predictions": predictions,
#         "doctor_confirmed_disease": None,
#         "created_at": datetime.now()
#     }

#     result = await consultations_collection.insert_one(doc)

#     return {
#         "consultation_id": str(result.inserted_id),
#         "predictions": predictions
#     }
@router.post("/consultation")
async def create_consultation(data: dict):
    doc = {
        "patient_id": data.get("patient_id"),
        "doctor_id": data.get("doctor_id"),
        "patient_name": data.get("patient_name"),
        "age": data.get("age"),
        "gender": data.get("gender"),
        "vitals": data.get("vitals"),
        "symptoms": data.get("symptoms"),
        "predictions": data.get("predictions"),
        "doctor_confirmed_disease": None,
        "created_at": datetime.now()
    }

    result = await consultations_collection.insert_one(doc)

    return {
        "message": "Consultation saved",
        "consultation_id": str(result.inserted_id)
    }

@router.get("/history")
async def get_history():
    consultations = await consultations_collection.find().to_list(100)
    for c in consultations:
        c["_id"] = str(c["_id"])
    return consultations

@router.get("/diseases")
async def get_diseases():
    diseases = []
    async for d in diseases_collection.find():
        diseases.append(d["disease_name"])
    return diseases

@router.get("/symptoms")
async def get_symptoms():
    symptoms = []
    async for s in symptoms_collection.find():
        symptoms.append(s["symptom_name"])
    return symptoms
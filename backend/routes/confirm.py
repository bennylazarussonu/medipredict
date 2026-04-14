from fastapi import APIRouter
from database import consultations_collection, training_data_collection
from ml_utils import symptoms_to_vector
from ml_model import train_model
from bson import ObjectId

router = APIRouter()

@router.post("/confirm-diagnosis")
async def confirm_diagnosis(data: dict):
    consultation_id = data.get("consultation_id")
    true_disease = data.get("true_disease")

    print("Confirming diagnosis...")
    print("Consultation ID:", consultation_id)
    print("True Disease:", true_disease)

    consultation = await consultations_collection.find_one(
        {"_id": ObjectId(consultation_id)}
    )

    if not consultation:
        return {"error": "Consultation not found"}

    # Update consultation
    await consultations_collection.update_one(
        {"_id": ObjectId(consultation_id)},
        {"$set": {"doctor_confirmed_disease": true_disease}}
    )

    print("Consultation updated")

    vector = await symptoms_to_vector(consultation["symptoms"])

    # Add to training data
    await training_data_collection.insert_one({
        "symptom_vector": vector,
        "true_disease": true_disease
    })

    print("Inserted into training data")

    # Retrain model
    # await train_model()

    # print("Model retrained")

    return {"status": "Diagnosis confirmed"}
from fastapi import APIRouter
from database import diseases_collection, symptoms_collection, training_data_collection
from ml_utils import symptoms_to_vector
from ml_model import train_model

router = APIRouter()

@router.get("/diseases-full")
async def get_diseases_full():
    diseases = []
    async for d in diseases_collection.find():
        d["_id"] = str(d["_id"])
        diseases.append(d)
    return diseases

from fastapi import APIRouter
from database import diseases_collection, symptoms_collection, training_data_collection
from ml_utils import symptoms_to_vector

router = APIRouter()

@router.get("/diseases-full")
async def get_diseases_full():
    diseases = []
    async for d in diseases_collection.find():
        d["_id"] = str(d["_id"])
        diseases.append(d)
    return diseases

@router.post("/add-disease")
async def add_disease(data: dict):
    disease_name = data.get("disease_name")
    description = data.get("description")
    symptoms = data.get("symptoms")

    if not disease_name or not symptoms:
        return {"error": "Disease name and symptoms required"}

    # Normalize
    disease_name = disease_name.strip()
    symptoms = [s.strip().title() for s in symptoms]

    # Check if disease already exists
    existing_disease = await diseases_collection.find_one({"disease_name": disease_name})
    if existing_disease:
        return {"error": "Disease already exists"}

    # Insert disease
    await diseases_collection.insert_one({
        "disease_name": disease_name,
        "description": description,
        "symptoms": symptoms
    })

    # Ensure symptoms exist in symptoms collection
    for symptom in symptoms:
        existing = await symptoms_collection.find_one({"symptom_name": symptom})
        if not existing:
            count = await symptoms_collection.count_documents({})
            await symptoms_collection.insert_one({
                "symptom_name": symptom,
                "index": count
            })

    # Add multiple training samples (VERY IMPORTANT)
    for _ in range(5):
        await training_data_collection.insert_one({
            "symptoms": symptoms,
            "true_disease": disease_name
        })

    # Retrain model
    await train_model()

    return {"message": "Disease added, training data added, model retrained"}
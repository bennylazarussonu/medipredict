import asyncio
import random
from datetime import datetime
from database import consultations_collection, symptoms_collection
from ml_utils import symptoms_to_vector
from ml_model import predict_disease

names = ["Ravi", "Sneha", "Arjun", "Meena", "Kiran", "Pooja", "Rahul", "Anjali"]
genders = ["Male", "Female"]

async def get_all_symptoms():
    symptoms = []
    async for s in symptoms_collection.find():
        symptoms.append(s["symptom_name"])
    return symptoms

async def generate_dummy():
    all_symptoms = await get_all_symptoms()

    for _ in range(20):  # generate 20 dummy consultations
        selected_symptoms = random.sample(all_symptoms, random.randint(3, 6))

        vector = await symptoms_to_vector(selected_symptoms)
        predictions = await predict_disease(vector)

        doc = {
            "patient_name": random.choice(names),
            "age": random.randint(20, 60),
            "gender": random.choice(genders),
            "vitals": {
                "height": random.randint(150, 180),
                "weight": random.randint(50, 90),
                "bmi": round(random.uniform(18, 30), 1),
                "heart_rate": random.randint(70, 110),
                "bp": f"{random.randint(100,150)}/{random.randint(60,95)}"
            },
            "symptoms": selected_symptoms,
            "symptom_vector": vector,
            "predictions": predictions,
            "doctor_confirmed_disease": None,
            "created_at": datetime.now()
        }

        await consultations_collection.insert_one(doc)

    print("Dummy consultations inserted")

asyncio.run(generate_dummy())
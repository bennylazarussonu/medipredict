import asyncio
import random
from database import diseases_collection, symptoms_collection, training_data_collection

async def get_symptom_index_map():
    symptom_map = {}
    async for s in symptoms_collection.find():
        symptom_map[s["symptom_name"]] = s["index"]
    return symptom_map

def create_vector(symptoms, symptom_map, vector_size):
    vector = [0] * vector_size
    for s in symptoms:
        if s in symptom_map:
            vector[symptom_map[s]] = 1
    return vector

async def generate_training_data():
    symptom_map = await get_symptom_index_map()
    vector_size = len(symptom_map)

    count = 0

    async for disease in diseases_collection.find():
        disease_name = disease["disease_name"]
        disease_symptoms = disease["symptoms"]

        # Generate multiple training samples per disease
        for _ in range(20):  # 20 samples per disease
            # Randomly remove some symptoms to simulate real case
            num_symptoms = random.randint(1, len(disease_symptoms))
            selected_symptoms = random.sample(disease_symptoms, num_symptoms)

            vector = create_vector(selected_symptoms, symptom_map, vector_size)

            doc = {
                "symptom_vector": vector,
                "true_disease": disease_name
            }

            await training_data_collection.insert_one(doc)
            count += 1

    print(f"Generated {count} training samples")

asyncio.run(generate_training_data())
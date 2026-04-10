from database import symptoms_collection

async def symptoms_to_vector(user_symptoms):
    all_symptoms = []
    
    async for s in symptoms_collection.find().sort("index", 1):
        all_symptoms.append(s["symptom_name"])

    vector = [0] * len(all_symptoms)

    for i, symptom in enumerate(all_symptoms):
        if symptom in user_symptoms:
            vector[i] = 1

    return vector
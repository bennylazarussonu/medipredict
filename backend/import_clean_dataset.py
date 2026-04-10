import pandas as pd
import asyncio
import ast
from database import diseases_collection, symptoms_collection

def clean_text(text):
    text = str(text)
    text = text.replace("_", " ")
    text = text.replace("-", " ")
    text = text.strip()
    text = text.title()
    return text

# Properly parse list string like ["Fever", "Chills"]
def parse_symptoms(symptom_string):
    try:
        symptom_list = ast.literal_eval(symptom_string)
        return [clean_text(s) for s in symptom_list]
    except:
        return []

async def import_data():
    df = pd.read_csv("clean.csv", sep="~")

    unique_symptoms = set()
    disease_index = 0

    for _, row in df.iterrows():
        disease_name = clean_text(row["name"])
        description = str(row["Desc"])
        symptoms_desc = str(row["symptomsDesc"])

        symptoms_list = parse_symptoms(row["symptoms"])

        for s in symptoms_list:
            unique_symptoms.add(s)

        disease_doc = {
            "disease_name": disease_name,
            "description": description,
            "symptoms": symptoms_list,
            "symptoms_description": symptoms_desc,
            "disease_index": disease_index
        }

        await diseases_collection.update_one(
            {"disease_name": disease_name},
            {"$set": disease_doc},
            upsert=True
        )

        disease_index += 1

    print(f"Inserted {disease_index} diseases")

    # Insert symptoms
    unique_symptoms = sorted(list(unique_symptoms))

    for index, symptom in enumerate(unique_symptoms):
        await symptoms_collection.update_one(
            {"symptom_name": symptom},
            {"$set": {"symptom_name": symptom, "index": index}},
            upsert=True
        )

    print(f"Inserted {len(unique_symptoms)} unique symptoms")

asyncio.run(import_data())
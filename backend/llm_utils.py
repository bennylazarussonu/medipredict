# import os
# from openai import OpenAI
# from dotenv import load_dotenv
# from pathlib import Path

# env_path = Path(__file__).resolve().parent / ".env"
# load_dotenv(dotenv_path=env_path)

# api_key = os.getenv("OPENAI_API_KEY")
# print("API KEY LOADED:", api_key is not None)

# client = OpenAI(api_key=api_key)

# async def get_specialist_recommendation(diseases):
#     disease_list = ", ".join(diseases)

#     prompt = f"""
# A patient is predicted to possibly have the following diseases:
# {disease_list}

# Which medical specialist should the patient consult?
# Return only specialist names separated by comma.
# Examples:
# Heart → Cardiologist
# Lungs → Pulmonologist
# Skin → Dermatologist
# Brain → Neurologist
# Hormones → Endocrinologist
# General infections → General Physician
# """

#     response = client.chat.completions.create(
#         model="gpt-4.1-mini",
#         messages=[
#             {"role": "system", "content": "You are a medical assistant."},
#             {"role": "user", "content": prompt}
#         ]
#     )

#     return response.choices[0].message.content

import os
from groq import Groq
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("GROQ_API_KEY")
print("API KEY LOADED:", api_key is not None)

client = Groq(api_key=api_key)

async def get_specialist_recommendation(diseases):
    disease_list = ", ".join(diseases)

    prompt = f"""
    A patient may have the following diseases:
    {disease_list}

    Which specialist should the patient consult?
    Return nothing else except, specialist name(s) separated by commas.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a medical assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content

async def get_medical_advice(disease):
    prompt = f"""
    Provide the following for {disease}:
    1. Recommended tests
    2. Treatment
    3. Prevention
    4. Diet advice
    Keep it short.
    """

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": "You are a medical assistant."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content
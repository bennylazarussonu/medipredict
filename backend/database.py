from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)

db = client["medipredict"]

users_collection = db["users"]
symptoms_collection = db["symptoms"]
diseases_collection = db["diseases"]
consultations_collection = db["consultations"]
training_data_collection = db["training_data"]
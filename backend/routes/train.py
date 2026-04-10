from fastapi import APIRouter
from ml_model import train_model

router = APIRouter()

@router.get("/train")
async def train():
    result = await train_model()
    return {"status": result}

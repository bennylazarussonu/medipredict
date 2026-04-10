from fastapi import FastAPI
from routes.predict import router as predict_router
from routes.train import router as train_router
from routes.consultation import router as consultation_router
from routes.confirm import router as confirm_router
from routes.diseases import router as diseases_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(predict_router)
app.include_router(train_router)
app.include_router(consultation_router)
app.include_router(confirm_router)
app.include_router(diseases_router)

@app.get("/")
async def home():
    return {"message": "MediPredict API Running"}


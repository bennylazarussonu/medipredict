# MediPredict

An intelligent medical diagnosis support system that leverages machine learning and AI to help healthcare professionals diagnose diseases based on patient symptoms.

## Overview

MediPredict is a full-stack web application designed to:
- Predict potential diseases from patient symptoms using a trained ML model
- Provide specialist recommendations using LLM (Groq API)
- Generate medical advice and treatment information
- Store and manage consultation records
- Allow doctors to confirm diagnoses to improve model accuracy
- Build a centralized database of diseases and symptoms

**Current Status:** MVP (Minimum Viable Product) - functional prototype with core features implemented

---

## Features

### 🔍 Disease Prediction
- Input patient symptoms and vitals
- Get top 15 disease predictions with confidence scores
- Specialist recommendations for each predicted disease
- Detailed medical advice per disease

### 📋 Consultation Management
- Store complete patient consultations with vitals
- Search consultation history
- Track predicted vs. actual diagnoses
- Build ground truth data for model improvement

### 🏥 Disease Database
- Browse disease catalog with symptoms
- Add new diseases with custom symptoms
- Auto-generates training data for new diseases
- Searchable disease/symptom database

### 📊 ML Model Improvement
- Doctors confirm diagnoses to collect ground truth
- Automatic training data generation
- Retrain model with improved data
- Monitor model performance over time

---

## Technology Stack

### Backend
- **Framework:** FastAPI (Python async web framework)
- **Server:** Uvicorn (ASGI server)
- **Database:** MongoDB (NoSQL document database)
- **ML Library:** scikit-learn (Bernoulli Naive Bayes)
- **Data Tools:** NumPy, Pandas, joblib
- **LLM:** Groq API (llama-3.1-8b-instant)
- **Async Driver:** Motor (async MongoDB)
- **Environment:** python-dotenv

### Frontend
- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.1
- **Routing:** React Router DOM 7.13.2
- **Styling:** Tailwind CSS 4.2.2
- **HTTP Client:** Axios 1.14.0
- **Icons:** Lucide React 1.7.0
- **Code Quality:** ESLint

---

## Project Structure

```
medipredict/
├── backend/
│   ├── main.py                          # FastAPI application entry point
│   ├── database.py                      # MongoDB setup & collections
│   ├── ml_model.py                      # Model training & prediction
│   ├── ml_utils.py                      # Symptom vectorization
│   ├── llm_utils.py                     # LLM integration (Groq)
│   ├── requirements.txt                 # Python dependencies
│   ├── model.joblib                     # Trained ML model
│   ├── routes/
│   │   ├── predict.py                   # Disease prediction endpoint
│   │   ├── consultation.py              # Consultation CRUD endpoints
│   │   ├── train.py                     # Model training endpoint
│   │   ├── confirm.py                   # Diagnosis confirmation endpoint
│   │   └── diseases.py                  # Disease database endpoints
│   ├── generate_training_data.py        # Training data generation script
│   └── generate_dummy_consultations.py  # Test data generation script
│
├── frontend/
│   ├── package.json                     # npm dependencies
│   ├── vite.config.js                   # Vite configuration
│   ├── index.html                       # HTML entry point
│   └── src/
│       ├── main.jsx                     # React entry point
│       ├── App.jsx                      # Main app with routing
│       ├── api/
│       │   └── api.js                   # Axios API client
│       ├── components/
│       │   └── Navbar.jsx               # Navigation bar
│       └── pages/
│           ├── Consultation.jsx         # Prediction form & results
│           ├── History.jsx              # Consultation history
│           └── Diseases.jsx             # Disease management
│
└── README.md                            # This file
```

---

## Installation

### Prerequisites
- **Node.js** (v16+) and npm
- **Python** (3.9+) and pip
- **MongoDB** (local or cloud - MongoDB Atlas)
- **Groq API Key** (free tier available at https://console.groq.com)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate   # macOS/Linux
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create `.env` file in backend directory:**
```env
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/medipredict
GROQ_API_KEY=your_groq_api_key_here
```

5. **Initialize database (optional - create sample data):**
```bash
python generate_training_data.py
python generate_dummy_consultations.py
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Ensure backend URL is correct in `src/api/api.js`:**
```javascript
const API = axios.create({
  baseURL: "http://127.0.0.1:8000"
});
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
source venv/Scripts/activate  # Windows: venv\Scripts\activate
uvicorn main:app --reload
```

Server runs on: **http://localhost:8000**

### Start Frontend Development Server

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

### Build for Production

**Frontend:**
```bash
npm run build
```

**Backend:**
```bash
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

---

## API Endpoints

### Prediction
- **`POST /predict`** - Get disease predictions from symptoms
  - Request: `{ "symptoms": ["Fever", "Cough", "Headache"] }`
  - Response: Predictions with probabilities, specialists, and medical advice

### Consultations
- **`POST /consultation`** - Save a new consultation
- **`GET /history`** - Retrieve all consultations
- **`POST /confirm-diagnosis`** - Confirm actual diagnosis & improve model

### Disease Management
- **`GET /diseases`** - List all disease names
- **`GET /diseases-full`** - List diseases with full details
- **`GET /symptoms`** - List all available symptoms
- **`POST /add-disease`** - Add new disease with symptoms

### Training
- **`GET /train`** - Retrain ML model on current training data

Full API documentation available at: **http://localhost:8000/docs** (interactive Swagger UI)

---

## Database Schema

### Collections

**symptoms**
- Indexed list of all symptoms
- Used for symptom vectorization

**diseases**
- Disease catalog with descriptions
- Associated symptoms for each disease

**consultations**
- Patient consultation records
- Includes vitals, symptoms, predictions
- Doctor-confirmed diagnosis

**training_data**
- Binary symptom vectors paired with actual disease
- Used to train ML model

**users** (Future implementation)
- User authentication & roles

---

## Usage

### Making a Prediction

1. Go to **Consultation** page
2. Enter patient details (name, age, gender)
3. Enter vitals (height, weight, BP, pulse)
4. Select symptoms from the list (search available)
5. Click **"Predict Disease"**
6. Review predictions and medical advice
7. Click **"Save Consultation"** to store records

### Confirming Diagnosis

1. Go to **History** page
2. Find the consultation record
3. Review AI predictions
4. Click **"Confirm Diagnosis"** on the actual disease
5. Data is saved to improve future predictions

### Adding Diseases

1. Go to **Database** page
2. Click **"+ Add Disease"**
3. Enter disease name and description
4. Select associated symptoms
5. Click **"Add Disease"**
6. System automatically generates training samples

---

## Machine Learning Model

### Algorithm: Bernoulli Naive Bayes

**Why Bernoulli Naive Bayes?**
- Symptoms are binary (present/absent) - perfect fit
- Fast training and inference
- Probabilistic output (confidence scores)
- Minimal hyperparameter tuning needed
- Works well with tabular data

### How It Works

1. **Symptom Vectorization:** Converts symptom list to binary vector
   ```
   Symptoms: ["Fever", "Cough", "Headache"]
   Vector:   [1, 0, 1, 0, 1, 0, ...]  (1 = present, 0 = absent)
   ```

2. **Model Training:** Learns disease probability from symptom vectors
3. **Prediction:** Returns probability for each disease class
4. **Ranking:** Returns top 10-15 predictions sorted by probability

### Improving Model Accuracy

The model improves through:
- **Doctor confirmations** → Ground truth data
- **New diseases** → Automatically generates 5 training samples
- **Retraining** → `GET /train` endpoint retrains on accumulated data

---

## Configuration

### Environment Variables (`.env`)

```env
# MongoDB Connection
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/medipredict

# Groq LLM API
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxx
```

### Server Ports

- **Backend:** `http://localhost:8000`
- **Frontend:** `http://localhost:5173`
- **MongoDB:** Connection via MONGO_URL

---

## Troubleshooting

### Backend Issues

**"ModuleNotFoundError: No module named 'fastapi'"**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt`

**"Connection refused - MongoDB"**
- Check `MONGO_URL` in `.env` is correct
- Verify MongoDB server is running
- For MongoDB Atlas, whitelist your IP

**"GROQ_API_KEY not found"**
- Create `.env` file with correct key
- Restart backend server

**"model.joblib not found"**
- Run `python generate_training_data.py` first
- Then `GET /train` to create model

### Frontend Issues

**"Cannot GET /predict" (CORS error)**
- Ensure backend is running on port 8000
- Check CORS origins in `main.py`
- Verify `api.js` baseURL is correct

**"Blank page / no content loading**
- Open browser console (F12)
- Check for errors
- Ensure both servers are running

**"Changes not reflecting in UI**
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page (Ctrl+R)

---

## Development Tips

### Running Scripts

**Generate training data from diseases:**
```bash
python generate_training_data.py
```

**Create test consultations:**
```bash
python generate_dummy_consultations.py
```

**Retrain model:**
```bash
curl http://localhost:8000/train
```

### Debugging

**Backend logging:**
- Check console output from `uvicorn main:app --reload`
- Add `print()` statements to routes

**Frontend debugging:**
- Open browser DevTools (F12)
- Check Network tab for API calls
- Check Console for JavaScript errors

---

## Known Limitations

1. **No evaluation metrics** - Model accuracy unknown (no train/test split)
2. **No authentication** - Anyone can add diagnoses
3. **Single model version** - No version control for models
4. **Training data imbalance** - New diseases may overfit
5. **Slow predictions** - LLM API calls can take 5-15 seconds
6. **No error handling** - Production-unfriendly error responses

---

## Future Improvements

- [ ] Add user authentication & authorization
- [ ] Implement model evaluation metrics (accuracy, precision, recall)
- [ ] Add model versioning and performance tracking
- [ ] Support multiple ML algorithms (Random Forest, Neural Networks)
- [ ] Add data validation & input sanitization
- [ ] Create admin dashboard for model monitoring
- [ ] Implement consultation export (PDF reports)
- [ ] Add audit trail for diagnosis confirmations
- [ ] Optimize LLM calls (batch processing, caching)
- [ ] Deploy to production (Docker, Kubernetes)

---

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the MIT License.

---

## Support

For issues, questions, or suggestions:
- Open a GitHub issue
- Contact the development team
- Check the [API documentation](http://localhost:8000/docs)

---

## Changelog

### Version 0.1.0 (Current)
- ✅ MVP implementation
- ✅ Disease prediction (Bernoulli NB)
- ✅ Consultation history
- ✅ Disease database
- ✅ LLM integration (Groq)
- 🔄 Model evaluation metrics (in progress)
- 🔄 User authentication (planned)

---

**Last Updated:** April 2026  
**Project Status:** Active Development
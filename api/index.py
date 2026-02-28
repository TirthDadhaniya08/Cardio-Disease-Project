from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os
import sys

# Define the input data model (Pydantic)
class PredictionInput(BaseModel):
    age: int # in years
    gender: int # 1: Female, 2: Male
    height: int # cm
    weight: float # kg
    ap_hi: int # Systolic
    ap_lo: int # Diastolic
    cholesterol: int # 1, 2, 3
    gluc: int # 1, 2, 3
    smoke: int # 0, 1
    alco: int # 0, 1
    active: int # 0, 1

app = FastAPI(title="Disease Predictor API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://disease-predictor-ai.netlify.app/", # Allow Next.js frontend
        "http://localhost:3000", # Allow local Next.js frontend
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Load Model and Scaler
# Vercel serverless functions sometimes run from the project root instead of the api folder.
# We will check both potential locations for the model file.
base_dir = os.path.dirname(__file__)
model_name = 'cardio_model_week3.pkl'

path_options = [
    os.path.join(base_dir, '..', model_name),          # Local dev: /api/../model.pkl
    os.path.join(base_dir, model_name),                # Sometimes Vercel places it in same dir
    os.path.join(os.getcwd(), model_name),             # Vercel cwd root
    os.path.join(os.getcwd(), 'api', '..', model_name) # Explicit cwd relative
]

MODEL_PATH = None
for p in path_options:
    if os.path.exists(p):
        MODEL_PATH = p
        break

if not MODEL_PATH:
    MODEL_PATH = path_options[0] # Fallback to default to print error on it

model_data = None
model = None
scaler = None

try:
    # Use joblib to load the pickle file
    print(f"Loading model from: {MODEL_PATH}")
    model_data = joblib.load(MODEL_PATH)
    
    # Extract model and scaler from the dictionary
    if isinstance(model_data, dict):
        model = model_data.get('model')
        scaler = model_data.get('scaler')
        if not model or not scaler:
            raise ValueError("Dictionary missing 'model' or 'scaler' keys")
    else:
        raise ValueError("Loaded file is not a dictionary as expected")
    
    print("Model and Scaler loaded successfully.")

except Exception as e:
    print(f"CRITICAL ERROR loading model: {e}")
    # We don't exit here to allow the app to start and show the error on request, 
    # or you might choose to exit.

@app.get("/")
@app.get("/api")
def home():
    return {"message": "Cardiovascular Disease Prediction API is running"}

@app.post("/predict")
@app.post("/api/predict")
def predict(input_data: PredictionInput):
    if not model or not scaler:
        raise HTTPException(status_code=500, detail="Model is not loaded.")

    try:
        # 1. Feature Engineering
        # age is already in years from input
        age_years = input_data.age
        
        # BMI Calculation: weight (kg) / (height (m))^2
        # height is in cm, so divide by 100
        height_m = input_data.height / 100.0
        bmi = input_data.weight / (height_m ** 2)
        
        # MAP Calculation: (ap_hi + 2 * ap_lo) / 3
        map_value = (input_data.ap_hi + 2 * input_data.ap_lo) / 3.0
        
        # 2. Create Feature Vector
        # Order: ['gender', 'height', 'weight', 'ap_hi', 'ap_lo', 'cholesterol', 'gluc', 'smoke', 'alco', 'active', 'age_years', 'bmi', 'MAP']
        features = np.array([[
            input_data.gender,
            input_data.height,
            input_data.weight,
            input_data.ap_hi,
            input_data.ap_lo,
            input_data.cholesterol,
            input_data.gluc,
            input_data.smoke,
            input_data.alco,
            input_data.active,
            age_years,
            bmi,
            map_value
        ]])
        
        # 3. Scaling (Manual formulation to remove scikit-learn)
        # These constants were extracted from the fitted StandardScaler in cardio_model_week3.pkl
        SCALER_MEANS = np.array([
            1.34699155e+00, 1.64402644e+02, 7.41306556e+01, 1.26630500e+02,
            8.13068182e+01, 1.36629516e+00, 1.22636218e+00, 8.78496503e-02,
            5.27935606e-02, 8.04177593e-01, 5.33058093e+01, 2.74739237e+01,
            9.64147120e+01
        ])
        
        SCALER_SCALES = np.array([
            0.47601304, 7.96329989, 14.29615498, 16.62171395, 9.45291316,
            0.68068297, 0.57276343, 0.28307612, 0.22362111, 0.39683245,
            6.76348550, 5.31133134, 11.02801243
        ])
        
        features_scaled = (features - SCALER_MEANS) / SCALER_SCALES
        
        # 4. Prediction
        prediction = model.predict(features_scaled)
        probability = model.predict_proba(features_scaled)[0][1] # Probability of class 1 (Disease)
        
        # Heuristic Override: If Cholesterol or Glucose is "Well Above Normal" (3),
        # force High Risk visualization if the model was borderline or low.
        is_high_risk_factor = (input_data.cholesterol == 3) or (input_data.gluc == 3)
        
        if is_high_risk_factor and probability < 0.5:
             # Boost probability to at least 55% to flag as High Risk
             probability = max(probability, 0.55)
             prediction[0] = 1

        result_class = int(prediction[0])
        
        return {
            "prediction_class": result_class,
            "probability": float(probability),
            "risk_percentage": float(probability) * 100,
            "has_disease": bool(result_class == 1)
        }

    except Exception as e:
        print(f"Prediction Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

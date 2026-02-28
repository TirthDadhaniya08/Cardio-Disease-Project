from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
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
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'cardio_model_week3.pkl')
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
def home():
    return {"message": "Cardiovascular Disease Prediction API is running"}

@app.post("/predict")
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
        features = pd.DataFrame([{
            'gender': input_data.gender,
            'height': input_data.height,
            'weight': input_data.weight,
            'ap_hi': input_data.ap_hi,
            'ap_lo': input_data.ap_lo,
            'cholesterol': input_data.cholesterol,
            'gluc': input_data.gluc,
            'smoke': input_data.smoke,
            'alco': input_data.alco,
            'active': input_data.active,
            'age_years': age_years,
            'bmi': bmi,
            'MAP': map_value
        }])
        
        # 3. Scaling
        features_scaled = scaler.transform(features)
        
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

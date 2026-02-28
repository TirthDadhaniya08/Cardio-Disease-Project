import joblib
import pandas as pd
import numpy as np
import os

model_path = os.path.join(os.path.dirname(__file__), 'cardio_model_week3.pkl')
print(f"Loading model from: {model_path}")
model_data = joblib.load(model_path)
model = model_data.get('model')
scaler = model_data.get('scaler')

# Test Case: High Risk on paper, but Normal BP
# Age 50, Male, Cholesterol 3, Gluc 3, Smoke 1, Alco 1, Active 0
# Height 175, Weight 85 -> BMI ~27.7
# BP 120/80 (Normal)
input_data = {
    'age': 55,
    'gender': 2,
    'height': 175,
    'weight': 85,
    'ap_hi': 120,
    'ap_lo': 80,
    'cholesterol': 3,
    'gluc': 3,
    'smoke': 1,
    'alco': 1,
    'active': 0
}

age_years = input_data['age']
height_m = input_data['height'] / 100.0
bmi = input_data['weight'] / (height_m ** 2)
map_value = (input_data['ap_hi'] + 2 * input_data['ap_lo']) / 3.0

features = pd.DataFrame([{
    'gender': input_data['gender'],
    'height': input_data['height'],
    'weight': input_data['weight'],
    'ap_hi': input_data['ap_hi'],
    'ap_lo': input_data['ap_lo'],
    'cholesterol': input_data['cholesterol'],
    'gluc': input_data['gluc'],
    'smoke': input_data['smoke'],
    'alco': input_data['alco'],
    'active': input_data['active'],
    'age_years': age_years,
    'bmi': bmi,
    'MAP': map_value
}])

print("Features:")
print(features.T)

features_scaled = scaler.transform(features)
prediction = model.predict(features_scaled)
probability = model.predict_proba(features_scaled)[0][1]

# Test Case 2: High BP
input_data['ap_hi'] = 160
input_data['ap_lo'] = 100
map_value2 = (input_data['ap_hi'] + 2 * input_data['ap_lo']) / 3.0

features2 = features.copy()
features2['ap_hi'] = 160
features2['ap_lo'] = 100
features2['MAP'] = map_value2

features_scaled2 = scaler.transform(features2)
prob2 = model.predict_proba(features_scaled2)[0][1]

# Write results to file
with open("debug_output.txt", "w", encoding="utf-8") as f:
    f.write(f"Prediction: {prediction[0]}\n")
    f.write(f"Probability: {probability}\n")
    f.write(f"Prediction with High BP (160/100): {prob2}\n")

print("Written to debug_output.txt")

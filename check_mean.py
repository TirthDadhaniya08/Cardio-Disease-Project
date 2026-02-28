import joblib
import numpy as np

model_path = os.path.join(os.path.dirname(__file__), 'cardio_model_week3.pkl')
data = joblib.load(model_path)
scaler = data['scaler']

names = scaler.feature_names_in_
means = scaler.mean_

for n, m in zip(names, means):
    print(f"{n}: {m}")

import joblib
import numpy as np

model_path = r'c:\Users\vrajr\Desktop\MLDL UI\disease-predictor\cardio_model_week3.pkl'
data = joblib.load(model_path)
scaler = data['scaler']

feature_names = scaler.feature_names_in_
means = scaler.mean_
vars = scaler.var_

print(f"{'Feature':<15} | {'Mean':<15} | {'Std Dev':<15}")
print("-" * 50)
for name, mean, var in zip(feature_names, means, vars):
    print(f"{name:<15} | {mean:<15.4f} | {np.sqrt(var):<15.4f}")

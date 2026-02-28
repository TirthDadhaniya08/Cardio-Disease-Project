import joblib
import pickle
import sys
import os
import pandas as pd
import numpy as np

model_path = r'c:\Users\vrajr\Desktop\MLDL UI\disease-predictor\cardio_model_week3.pkl'

print(f"Loading model from: {model_path}")

try:
    try:
        model = joblib.load(model_path)
        print("Model loaded with joblib")
    except:
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
        print("Model loaded with pickle")

    with open('model_features.txt', 'w', encoding='utf-8') as f:
        f.write(f"Type: {type(model)}\n")
        
        if isinstance(model, dict):
            f.write(f"Keys: {list(model.keys())}\n")
            # Try to identify the model within the dict
            for key, value in model.items():
                f.write(f"Key: {key}, Type: {type(value)}\n")
                if hasattr(value, 'n_features_in_'):
                    f.write(f"  --> {key} has {value.n_features_in_} features\n")
                    if hasattr(value, 'feature_names_in_'):
                        f.write(f"  --> {key} feature names: {value.feature_names_in_}\n")
        
        elif hasattr(model, 'n_features_in_'):
            f.write(f"Number of features: {model.n_features_in_}\n")
    
    print("info written to model_features.txt")

except Exception as e:
    print(f"Error loading model: {e}")

import pandas as pd
import numpy as np
import pickle
import os
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Try to load the trained model, fallback to rule-based if not available
_model = None
_feature_names = None

def _load_model():
    global _model, _feature_names
    if _model is None:
        try:
            model_path = os.path.join(os.path.dirname(__file__), 'loan_model.pkl')
            features_path = os.path.join(os.path.dirname(__file__), 'model_features.pkl')
            if os.path.exists(model_path):
                with open(model_path, 'rb') as f:
                    _model = pickle.load(f)
                with open(features_path, 'rb') as f:
                    _feature_names = pickle.load(f)
                print("Model loaded successfully")
        except Exception as e:
            print(f"Could not load model: {e}. Using rule-based prediction.")

def predict_loan_approval(income_annum, loan_amount, loan_term, cibil_score, education, self_employed):
    """
    Predict loan approval based on user inputs.
    
    Args:
        income_annum: Annual income
        loan_amount: Car price (MSRP)
        loan_term: Loan term in years (default 5)
        cibil_score: Credit score (300-850)
        education: 1 if college graduate, 0 if not
        self_employed: 1 if self-employed, 0 if not
    
    Returns:
        dict with approval status and probability
    """
    # Try to use trained model, fallback to rule-based
    _load_model()
    
    if _model is not None and _feature_names is not None:
        try:
            # Create feature vector matching the model's expected format
            # The model expects: income_annum, loan_amount, loan_term, cibil_score, education, self_employed
            # Plus other features that were in the training data (set to 0 or median)
            features = pd.DataFrame({
                'income_annum': [income_annum],
                'loan_amount': [loan_amount],
                'loan_term': [loan_term],
                'cibil_score': [cibil_score],
                'education': [education],
                'self_employed': [self_employed],
                'no_of_dependents': [0],  # Default, not in quiz
                'residential_assets_value': [0],  # Default
                'commercial_assets_value': [0],  # Default
                'luxury_assets_value': [0],  # Default
                'bank_asset_value': [0],  # Default
            })
            
            # Ensure all required features are present
            for feature in _feature_names:
                if feature not in features.columns:
                    features[feature] = 0
            
            # Reorder columns to match training data
            features = features[_feature_names]
            
            # Predict
            prediction = _model.predict(features)[0]
            proba = _model.predict_proba(features)[0]
            probability = proba[1] if len(proba) > 1 else proba[0]
            
            return {
                "approved": bool(prediction),
                "probability": round(float(probability), 3),
                "score": round(float(probability * 100), 1),
                "reason": "Model prediction based on your profile" if prediction else "Model indicates loan may not be approved based on your profile"
            }
        except Exception as e:
            print(f"Error using model: {e}. Falling back to rule-based prediction.")
    
    # Fallback: Rule-based prediction
    loan_to_income_ratio = loan_amount / income_annum if income_annum > 0 else 999
    
    # Weighted scoring
    score = 0
    
    # Credit score (most important factor)
    if cibil_score >= 750:
        score += 40
    elif cibil_score >= 700:
        score += 30
    elif cibil_score >= 650:
        score += 20
    elif cibil_score >= 600:
        score += 10
    
    # Loan to income ratio
    if loan_to_income_ratio <= 0.3:
        score += 30
    elif loan_to_income_ratio <= 0.5:
        score += 20
    elif loan_to_income_ratio <= 0.7:
        score += 10
    
    # Education bonus
    if education == 1:
        score += 15
    
    # Self-employed (slightly negative)
    if self_employed == 0:
        score += 5
    
    # Loan term (shorter is better)
    if loan_term <= 3:
        score += 10
    elif loan_term <= 5:
        score += 5
    
    # Approval threshold
    approved = score >= 50
    probability = min(0.99, max(0.01, score / 100))
    
    return {
        "approved": approved,
        "probability": round(probability, 3),
        "score": score,
        "reason": "High credit score and favorable loan-to-income ratio" if approved else "Credit score or loan amount may be too high relative to income"
    }


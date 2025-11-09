"""
Script to save the trained model from model_loan.ipynb
Run this after training the model in the notebook
"""
import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Load data (same as notebook)
loan_original = pd.read_csv("data/data.csv")
loan_original.columns = loan_original.columns.str.replace(' ', '')
loan = loan_original.drop(['loan_id'], axis=1)

# Create dummies (same as notebook)
loan_dummies = pd.get_dummies(loan)
loan_dummies.rename(columns = {
    'education_ Graduate':'education', 
    'self_employed_ Yes':'self_employed', 
    'loan_status_ Approved':'loan_status' 
}, inplace = True)
loan_dummies = loan_dummies.drop(['education_ Not Graduate', 'self_employed_ No', 'loan_status_ Rejected'], axis=1)

# Prepare features
y = loan_dummies['loan_status']
X = loan_dummies.drop(['loan_status'], axis=1)

# Train model (same parameters as notebook)
rf_opt = RandomForestClassifier(
    n_estimators=150, 
    max_depth=None,
    min_samples_leaf=1, 
    min_samples_split=5,
    random_state=0
)
rf_opt.fit(X, y)

# Save model
with open('loan_model.pkl', 'wb') as f:
    pickle.dump(rf_opt, f)

# Save feature names for reference
feature_names = list(X.columns)
with open('model_features.pkl', 'wb') as f:
    pickle.dump(feature_names, f)

print("Model saved successfully!")
print(f"Features: {feature_names}")


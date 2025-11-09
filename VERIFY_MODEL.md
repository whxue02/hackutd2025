# How to Verify the Loan Approval Model is Working

## Step 1: Check Model Files Exist
```bash
cd backend
ls -la *.pkl
```
You should see:
- `loan_model.pkl` (2.3 MB)
- `model_features.pkl` (212 bytes)

## Step 2: Test the Model Directly
```bash
cd backend
source venv/bin/activate
python3 -c "from predict_loan import predict_loan_approval; result = predict_loan_approval(75000, 30000, 5, 720, 1, 0); print(result)"
```

Expected output:
```
Model loaded successfully
[predict_loan_approval] Using MSRP (loan_amount): $30,000.00 as input to ML model
{'approved': True, 'probability': 0.734, 'score': 73.4, 'reason': 'Model prediction based on your profile'}
```

## Step 3: Start Backend Server
```bash
cd backend
source venv/bin/activate
python3 sai.py
```

You should see:
- Server running on port 5001
- "Model loaded successfully" message when first prediction is made

## Step 4: Start Frontend
```bash
cd frontend
npm run dev
```

## Step 5: Test in Browser

1. **Complete the Quiz:**
   - Click "Start Interactive Quiz"
   - Fill in all questions:
     - Annual Income (e.g., 75000)
     - Credit Score (e.g., 720)
     - College Graduate: Yes/No
     - Self-Employed: Yes/No
     - City (e.g., Dallas)
     - State (e.g., Texas)
     - Miles per Week (e.g., 200)
   - Click "Complete Quiz"

2. **Navigate to All Grid View:**
   - Click "Explore Dashboard" or switch to "All" view
   - You should see car cards

3. **Click "Check Loan Approval" Button:**
   - Each car card has a button at the bottom
   - Click it to open the modal
   - You should see:
     - Loading spinner
     - Then approval result (Approved/Not Approved)
     - Probability percentage
     - Reason

## Step 6: Check Browser Console

Open browser DevTools (F12) and check Console tab. You should see:

```
[AllGridView] Check Loan Approval clicked for: Toyota Camry
[AllGridView] Quiz answers: {annualIncome: "75000", creditScore: "720", ...}
[AllGridView] Car MSRP: 30000
[AllGridView] Calling predictLoanApproval...
[Loan Prediction] Using MSRP: $30,000 for 2024 Toyota Camry
[Loan Prediction] Sending to ML model: {annualIncome: 75000, creditScore: 720, ...}
[AllGridView] Prediction received: {approved: true, probability: 0.734, ...}
```

## Step 7: Check Backend Logs

In the terminal where `sai.py` is running, you should see:

```
[Loan Prediction] Received MSRP (loan_amount): 30,000.00
[Loan Prediction] Inputs - Income: 75,000.00, Credit: 720, MSRP: 30,000.00, Term: 5 years
[predict_loan_approval] Using MSRP (loan_amount): $30,000.00 as input to ML model
[predict_loan_approval] Feature vector includes loan_amount (MSRP): 30000
```

## Troubleshooting

### Modal doesn't open:
- Check browser console for errors
- Verify quiz is completed (button should say "Check Loan Approval" not "Complete Quiz First")
- Check if `selectedCarForLoan` state is being set

### API Error:
- Verify backend is running on port 5001
- Check CORS is enabled in `sai.py`
- Verify API URL in `loanPrediction.ts` is `http://localhost:5001`

### Model not loading:
- Check `loan_model.pkl` exists in `backend/` directory
- Run `python3 save_model.py` to regenerate model files
- Check backend logs for "Model loaded successfully" message

### No quiz answers:
- Make sure you complete the quiz first
- Check `quizAnswers` is being passed from `App.tsx` to `AllGridView`
- Verify quiz completion handler is saving answers

## Quick Test Script

Run this to test the API directly:

```bash
curl -X POST http://localhost:5001/predict/loan \
  -H "Content-Type: application/json" \
  -d '{
    "annualIncome": 75000,
    "creditScore": 720,
    "isCollegeGrad": true,
    "isSelfEmployed": false,
    "loanAmount": 30000,
    "loanTerm": 5
  }'
```

Expected response:
```json
{
  "approved": true,
  "probability": 0.734,
  "score": 73.4,
  "reason": "Model prediction based on your profile"
}
```


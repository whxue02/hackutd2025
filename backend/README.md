# Backend Setup

## Installation

1. Create and activate virtual environment:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Save the trained model (if not already done):
```bash
python3 save_model.py
```

## Running the Server

```bash
source venv/bin/activate
python3 sai.py
```

The server will run on `http://localhost:5001`

## API Endpoints

### POST `/predict/loan`
Predicts loan approval for a car purchase.

**Request Body:**
```json
{
  "annualIncome": "75000",
  "creditScore": "720",
  "isCollegeGrad": true,
  "isSelfEmployed": false,
  "loanAmount": 30000,
  "loanTerm": 5
}
```

**Response:**
```json
{
  "approved": true,
  "probability": 0.734,
  "score": 73.4,
  "reason": "Model prediction based on your profile"
}
```


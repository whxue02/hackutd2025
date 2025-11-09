import { QuizAnswers } from "../components/Quiz";
import { Car } from "../types/car";

export interface LoanPrediction {
  approved: boolean;
  probability: number;
  score: number;
  reason: string;
}

const API_BASE_URL = "http://localhost:5001"; // Backend API URL

export async function predictLoanApproval(
  quizAnswers: QuizAnswers,
  car: Car,
  loanTerm: number = 5
): Promise<LoanPrediction> {
  try {
    // Validate and extract MSRP from car data
    if (!car || !car.financing || !car.financing.msrp) {
      throw new Error(`Car MSRP not available for ${car?.make || 'unknown'} ${car?.model || 'unknown'}`);
    }
    
    const loanAmount = car.financing.msrp;
    
    // Validate quiz answers
    if (!quizAnswers) {
      throw new Error("Quiz answers are required");
    }
    
    // EXTRACT VALUES FROM QUIZ - NO HARDCODING
    const annualIncome = parseFloat(quizAnswers.annualIncome);
    const creditScore = parseInt(quizAnswers.creditScore);
    
    console.log("========== EXTRACTING FROM QUIZ ==========");
    console.log("Raw annualIncome string:", quizAnswers.annualIncome);
    console.log("Parsed annualIncome number:", annualIncome);
    console.log("Raw creditScore string:", quizAnswers.creditScore);
    console.log("Parsed creditScore number:", creditScore);
    console.log("Raw isCollegeGrad:", quizAnswers.isCollegeGrad);
    console.log("Raw isSelfEmployed:", quizAnswers.isSelfEmployed);
    
    if (isNaN(annualIncome) || annualIncome <= 0) {
      throw new Error(`Invalid annual income from quiz: "${quizAnswers.annualIncome}"`);
    }
    
    if (isNaN(creditScore) || creditScore < 300 || creditScore > 850) {
      throw new Error(`Invalid credit score from quiz: "${quizAnswers.creditScore}"`);
    }
    
    // Log the MSRP being sent to the model for verification
    console.log("========== LOAN PREDICTION REQUEST ==========");
    console.log(`[Loan Prediction] Car: ${car.year} ${car.make} ${car.model}`);
    console.log(`[Loan Prediction] Car MSRP (from car.financing.msrp): $${car.financing.msrp.toLocaleString()}`);
    console.log(`[Loan Prediction] Using MSRP as loan amount: $${loanAmount.toLocaleString()}`);
    console.log(`[Loan Prediction] MSRP verification: ${car.financing.msrp === loanAmount ? '✓ MATCH' : '✗ MISMATCH!'}`);
    console.log(`[Loan Prediction] Quiz Data FROM QUIZ - Income: $${annualIncome.toLocaleString()}, Credit: ${creditScore}, College: ${quizAnswers.isCollegeGrad}, Self-Employed: ${quizAnswers.isSelfEmployed}`);
    
    // BUILD PAYLOAD FROM QUIZ ANSWERS - NO HARDCODED VALUES
    const payload = {
      annualIncome: annualIncome, // FROM QUIZ: quizAnswers.annualIncome
      creditScore: creditScore, // FROM QUIZ: quizAnswers.creditScore
      isCollegeGrad: quizAnswers.isCollegeGrad === true, // FROM QUIZ: quizAnswers.isCollegeGrad
      isSelfEmployed: quizAnswers.isSelfEmployed === true, // FROM QUIZ: quizAnswers.isSelfEmployed
      loanAmount: loanAmount, // FROM CAR: car.financing.msrp (NOT HARDCODED)
      loanTerm: loanTerm,
    };
    
    console.log("========== FINAL PAYLOAD (ALL FROM QUIZ + CAR MSRP) ==========");
    console.log(JSON.stringify(payload, null, 2));
    console.log("VERIFICATION:");
    console.log("  - annualIncome comes from quiz:", quizAnswers.annualIncome, "->", annualIncome);
    console.log("  - creditScore comes from quiz:", quizAnswers.creditScore, "->", creditScore);
    console.log("  - isCollegeGrad comes from quiz:", quizAnswers.isCollegeGrad);
    console.log("  - isSelfEmployed comes from quiz:", quizAnswers.isSelfEmployed);
    console.log("  - loanAmount comes from car MSRP:", loanAmount);
    
    const response = await fetch(`${API_BASE_URL}/predict/loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error predicting loan approval:", error);
    // Return a default response on error
    return {
      approved: false,
      probability: 0,
      score: 0,
      reason: "Unable to determine approval status",
    };
  }
}


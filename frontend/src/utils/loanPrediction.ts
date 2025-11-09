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
    const response = await fetch(`${API_BASE_URL}/predict/loan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        annualIncome: parseFloat(quizAnswers.annualIncome) || 0,
        creditScore: parseInt(quizAnswers.creditScore) || 0,
        isCollegeGrad: quizAnswers.isCollegeGrad === true,
        isSelfEmployed: quizAnswers.isSelfEmployed === true,
        loanAmount: car.financing.msrp,
        loanTerm: loanTerm,
      }),
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


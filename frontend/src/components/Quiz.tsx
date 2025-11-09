import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

export interface QuizAnswers {
  annualIncome: string;
  creditScore: string;
  isCollegeGrad: boolean | null;
  isSelfEmployed: boolean | null;
  city: string;
  state: string;
  milesPerWeek: string;
}

export function Quiz({ onComplete, onBack }: QuizProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    annualIncome: "",
    creditScore: "",
    isCollegeGrad: null,
    isSelfEmployed: null,
    city: "",
    state: "",
    milesPerWeek: "",
  });

  // Reset quiz state when component mounts (for retaking quiz)
  useEffect(() => {
    setStep(1);
    setAnswers({
      annualIncome: "",
      creditScore: "",
      isCollegeGrad: null,
      isSelfEmployed: null,
      city: "",
      state: "",
      milesPerWeek: "",
    });
  }, []);

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      // Normalize city and state to lowercase before completing
      const normalizedAnswers = {
        ...answers,
        city: answers.city.trim().toLowerCase(),
        state: answers.state.trim().toLowerCase(),
      };
      console.log("Quiz completed with answers:", normalizedAnswers);
      onComplete(normalizedAnswers);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const updateAnswer = (field: keyof QuizAnswers, value: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return answers.annualIncome !== "";
      case 2:
        return answers.creditScore !== "";
      case 3:
        return answers.isCollegeGrad !== null;
      case 4:
        return answers.isSelfEmployed !== null;
      case 5:
        return answers.city !== "";
      case 6:
        return answers.state !== "";
      case 7:
        return answers.milesPerWeek !== "";
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0 bg-gradient-to-br from-black via-gray-900 to-black">
      {/* animated background */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,21,56,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      <div className="relative z-10 h-full flex items-center justify-center px-4">
        {/* CARD WRAPPER */}
        <div className="w-full max-w-xs min-h-[800px] flex flex-col justify-center">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2 italic text-center">
              <span>Step {step} of 7</span>
              <span>{Math.round((step / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 7) * 100}%` }}
              />
            </div>
          </div>

          {/* QUIZ CARD */}
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            // ⭐ taller + more padding
            className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-sm rounded-2xl p-10 md:p-12 border border-gray-800/50 shadow-2xl flex flex-col justify-between min-h-[700px]"
          >
            {/* ==== STEP CONTENT ==== */}
            <div className="flex flex-col justify-center text-center flex-1">
              {/* Step 1 */}
              {step === 1 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    What's your annual income?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">
                    This helps us recommend cars within your budget.
                  </p>
                  <Label htmlFor="income" className="text-white italic block mb-2">
                    Annual Income ($)
                  </Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 75000"
                    value={answers.annualIncome}
                    onChange={(e) => updateAnswer("annualIncome", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white italic text-center"
                  />
                </>
              )}

              {/* Step 2: Credit Score */}
              {step === 2 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    What's your credit score?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">This affects your financing options.</p>
                  <Label htmlFor="credit" className="text-white italic block mb-2">Credit Score (300-850)</Label>
                  <Input
                    id="credit"
                    type="number"
                    placeholder="e.g., 720"
                    min="300"
                    max="850"
                    value={answers.creditScore}
                    onChange={(e) => updateAnswer("creditScore", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white italic text-center"
                  />
                </>
              )}

              {/* Step 3: College Graduate */}
              {step === 3 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    Are you a college graduate?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">This helps us understand your profile better.</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => updateAnswer("isCollegeGrad", true)}
                      className={`w-full p-4 text-base italic rounded-xl ${
                        answers.isCollegeGrad === true
                          ? "bg-primary text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      Yes, I'm a college graduate
                    </Button>
                    <Button
                      onClick={() => updateAnswer("isCollegeGrad", false)}
                      className={`w-full p-4 text-base italic rounded-xl ${
                        answers.isCollegeGrad === false
                          ? "bg-primary text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      No, I'm not a college graduate
                    </Button>
                  </div>
                </>
              )}

              {/* Step 4: Self Employed */}
              {step === 4 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    Are you self-employed?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">This affects financing documentation requirements.</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => updateAnswer("isSelfEmployed", true)}
                      className={`w-full p-4 text-base italic rounded-xl ${
                        answers.isSelfEmployed === true
                          ? "bg-primary text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      Yes, I'm self-employed
                    </Button>
                    <Button
                      onClick={() => updateAnswer("isSelfEmployed", false)}
                      className={`w-full p-4 text-base italic rounded-xl ${
                        answers.isSelfEmployed === false
                          ? "bg-primary text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      No, I'm not self-employed
                    </Button>
                  </div>
                </>
              )}

              {/* Step 5: City */}
              {step === 5 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    What city do you live in?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">This helps us find local dealers and pricing.</p>
                  <Label htmlFor="city" className="text-white italic block mb-2">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Dallas"
                    value={answers.city}
                    onChange={(e) => updateAnswer("city", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white italic text-center"
                  />
                </>
              )}

              {/* Step 6: State */}
              {step === 6 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    What state do you live in?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">This helps us find local dealers and pricing.</p>
                  <Label htmlFor="state" className="text-white italic block mb-2">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="e.g., Texas"
                    value={answers.state}
                    onChange={(e) => updateAnswer("state", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white italic text-center"
                  />
                </>
              )}

              {/* Step 7: Miles Per Week */}
              {step === 7 && (
                <>
                  <h2 className="text-2xl font-bold text-white mb-2 italic" style={{ fontFamily: "Saira, sans-serif" }}>
                    How many miles do you drive per week?
                  </h2>
                  <p className="text-gray-400 mb-6 text-sm italic">This helps us recommend cars with appropriate fuel efficiency.</p>
                  <Label htmlFor="miles" className="text-white italic block mb-2">Miles per Week</Label>
                  <Input
                    id="miles"
                    type="number"
                    placeholder="e.g., 200"
                    value={answers.milesPerWeek}
                    onChange={(e) => updateAnswer("milesPerWeek", e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-white italic text-center"
                  />
                </>
              )}
            </div>

            {/* ====== NAVIGATION ====== */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 p-4 text-base italic rounded-xl border-gray-700 text-white hover:bg-gray-800/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? "Back" : "Previous"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 p-4 text-base bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary/70 italic rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 7 ? "Complete" : "Next"}
                {step < 7 && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

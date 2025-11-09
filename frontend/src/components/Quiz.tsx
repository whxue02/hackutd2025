import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useNavigate } from "react-router-dom";
import Background from "./background3.png";

interface QuizProps {
  onComplete?: (answers: QuizAnswers) => void;
  onBack?: () => void;
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
  const navigate = useNavigate();
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

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      const normalizedAnswers = {
        ...answers,
        city: answers.city.trim().toLowerCase(),
        state: answers.state.trim().toLowerCase(),
      };

      (window as any).quizAnswers = normalizedAnswers;

      if (onComplete) {
        try {
          onComplete(normalizedAnswers);
        } catch (error) {
          console.error(error);
        }
      }

      setTimeout(() => navigate("/"), 100);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBack) {
      onBack();
    } else {
      navigate("/landing");
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
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0">

      {/* === PAGE BACKGROUND IMAGE === */}
      <div
        className="absolute inset-0 bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* === MAIN CONTENT WRAPPER === */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">

        {/* ✅ ✅ UNDERLAY added — blocks ALL background image bleed */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="
            w-full
            max-w-[180px]
            min-h-[95vh]
            rounded-3xl
            bg-white
            shadow-2xl
          " />
        </div>

        {/* ✅ ✅ END UNDERLAY */}

        {/* === QUIZ COLUMN === */}
        <div className="w-full max-w-[380px] min-h-[800px] flex flex-col justify-center relative z-20">


          {/* Progress Bar */}
          <div className="mb-6 rounded-lg p-3 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
            <div className="flex justify-between text-sm text-gray-700 mb-2 font-medium">
              <span>Step {step} of 7</span>
              <span>{Math.round((step / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
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
            className="rounded-2xl p-10 md:p-12 border-2 border-gray-300 shadow-2xl flex flex-col justify-between min-h-[700px] relative z-20"
            style={{ backgroundColor: "#ffffff", opacity: 1 }}
          >
            {/* STEP CONTENT */}
            <div className="flex flex-col justify-center text-center flex-1">

              {step === 1 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      What's your annual income?
                    </h2>
                  </div>

                  <p className="text-gray-600 mb-6 text-sm">This helps us recommend cars within your budget.</p>

                  <Label htmlFor="income" className="text-primary block mb-2">Annual Income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="e.g., 75000"
                    value={answers.annualIncome}
                    onChange={(e) => updateAnswer("annualIncome", e.target.value)}
                    className="bg-white border-gray-300 text-primary text-center placeholder:text-gray-600"
                  />
                </>
              )}

              {/* ✅ Other steps unchanged – just solid text now */}
              {/* Step 2: Credit Score */}
              {step === 2 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      What's your credit score?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">This affects your financing options.</p>
                  <Label htmlFor="credit" className="text-primary block mb-2">Credit Score (300-850)</Label>
                  <Input
                    id="credit"
                    type="number"
                    placeholder="e.g., 720"
                    min="300"
                    max="850"
                    value={answers.creditScore}
                    onChange={(e) => updateAnswer("creditScore", e.target.value)}
                    className="bg-white border-gray-300 text-primary text-center placeholder:text-gray-600"
                  />
                </>
              )}

              {/* Step 3: College Graduate */}
              {step === 3 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      Are you a college graduate?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">This helps us understand your profile better.</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => updateAnswer("isCollegeGrad", true)}
                      className={`w-full p-4 text-base rounded-full ${
                        answers.isCollegeGrad === true
                          ? "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white shadow-lg shadow-primary/30 border border-primary/50"
                          : "bg-white border-2 border-gray-300 text-black hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Yes, I'm a college graduate
                    </Button>
                    <Button
                      onClick={() => updateAnswer("isCollegeGrad", false)}
                      className={`w-full p-4 text-base rounded-full ${
                        answers.isCollegeGrad === false
                          ? "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white shadow-lg shadow-primary/30 border border-primary/50"
                          : "bg-white border-2 border-gray-300 text-black hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      No, I'm not a college graduate
                    </Button>
                  </div>
                </>
              )}

              {/* Step 4: Self Employed */}
              {step === 4 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      Are you self-employed?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">This affects financing documentation requirements.</p>
                  <div className="space-y-3">
                    <Button
                      onClick={() => updateAnswer("isSelfEmployed", true)}
                      className={`w-full p-4 text-base rounded-full ${
                        answers.isSelfEmployed === true
                          ? "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white shadow-lg shadow-primary/30 border border-primary/50"
                          : "bg-white border-2 border-gray-300 text-black hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      Yes, I'm self-employed
                    </Button>
                    <Button
                      onClick={() => updateAnswer("isSelfEmployed", false)}
                      className={`w-full p-4 text-base rounded-full ${
                        answers.isSelfEmployed === false
                          ? "bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-white shadow-lg shadow-primary/30 border border-primary/50"
                          : "bg-white border-2 border-gray-300 text-black hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      No, I'm not self-employed
                    </Button>
                  </div>
                </>
              )}

              {/* Step 5: City */}
              {step === 5 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      What city do you live in?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">This helps us find local dealers and pricing.</p>
                  <Label htmlFor="city" className="text-primary block mb-2">City</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Dallas"
                    value={answers.city}
                    onChange={(e) => updateAnswer("city", e.target.value)}
                    className="bg-white border-gray-300 text-primary text-center placeholder:text-gray-600"
                  />
                </>
              )}

              {/* Step 6: State */}
              {step === 6 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      What state do you live in?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">This helps us find local dealers and pricing.</p>
                  <Label htmlFor="state" className="text-primary block mb-2">State</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="e.g., Texas"
                    value={answers.state}
                    onChange={(e) => updateAnswer("state", e.target.value)}
                    className="bg-white border-gray-300 text-primary text-center placeholder:text-gray-600"
                  />
                </>
              )}

              {/* Step 7: Miles Per Week */}
              {step === 7 && (
                <>
                  <div className="rounded-lg p-4 mb-4 shadow-lg" style={{ backgroundColor: "#ffffff", opacity: 1 }}>
                    <h2
                      className="text-3xl md:text-4xl font-bold text-primary"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 900 }}
                    >
                      How many miles do you drive per week?
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">This helps us recommend cars with appropriate fuel efficiency.</p>
                  <Label htmlFor="miles" className="text-primary block mb-2">Miles per Week</Label>
                  <Input
                    id="miles"
                    type="number"
                    placeholder="e.g., 200"
                    value={answers.milesPerWeek}
                    onChange={(e) => updateAnswer("milesPerWeek", e.target.value)}
                    className="bg-white border-gray-300 text-primary text-center placeholder:text-gray-600"
                  />
                </>
              )}
            </div>

            {/* ====== NAVIGATION ====== */}
            <div className="flex gap-4 mt-8">
              <Button
                onClick={handleBack}
                className="flex-1 p-4 text-base rounded-full bg-white border-2 border-gray-300 text-gray-800 hover:bg-gray-50"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {step === 1 ? "Back" : "Previous"}
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 p-4 text-base bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full text-white shadow-lg shadow-primary/30 border border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: "Inter, sans-serif" }}
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
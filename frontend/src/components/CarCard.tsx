import { useState, useEffect } from "react";
import { Car } from "../types/car";
import { Gauge, Fuel, DollarSign, Star, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { QuizAnswers } from "./Quiz";
import { predictLoanApproval, LoanPrediction } from "../utils/loanPrediction";

interface CarCardProps {
  car: Car;
  quizAnswers?: QuizAnswers | null;
}

export function CarCard({ car, quizAnswers }: CarCardProps) {
  const [loanPrediction, setLoanPrediction] = useState<LoanPrediction | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (quizAnswers) {
      setLoading(true);
      predictLoanApproval(quizAnswers, car)
        .then((prediction) => {
          setLoanPrediction(prediction);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching loan prediction:", error);
          setLoading(false);
        });
    }
  }, [quizAnswers, car]);

  return (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl shadow-2xl overflow-hidden border border-primary/40 shadow-primary/20 flex flex-col">
      {/* Tron-style glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 pointer-events-none" />
      
      <div className="relative h-[45%] flex-shrink-0">
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute top-6 right-6">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-4 py-1.5 shadow-lg shadow-primary/50 italic">
            {car.category}
          </Badge>
        </div>
      </div>
      
      <div className="relative p-6 flex-1 overflow-y-auto min-h-0">
        <div className="mb-4">
          <h2 className="text-white mb-2 italic tracking-wide" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
            {car.year} {car.make} {car.model}
          </h2>
          <div className="flex items-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < car.safetyRating
                      ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.8)]"
                      : "text-gray-600"
                  }`}
                />
              ))}
            </div>
            <span className="text-gray-400 italic">Safety Rating</span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-primary/20">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <Gauge className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.6)] flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 mb-1 italic">Engine</p>
                <p className="text-white truncate italic">{car.specs.engine}</p>
                <p className="text-gray-400 italic">{car.specs.horsepower} HP</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-primary/20">
              <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <Fuel className="w-5 h-5 text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.6)] flex-shrink-0" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-400 mb-1 italic">MPG</p>
                <p className="text-white italic">
                  {car.gasMileage.city} city
                </p>
                <p className="text-gray-400 italic">
                  {car.gasMileage.highway} hwy
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 rounded-2xl p-6 text-white border border-primary/50 shadow-lg shadow-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg border border-white/30">
                <DollarSign className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              </div>
              <p className="text-white/90 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>Financing Options</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-white/70 mb-1 italic">MSRP</p>
                <p className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                  ${car.financing.msrp.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-white/70 mb-1 italic">Monthly</p>
                <p className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                  ${car.financing.monthlyPayment}/mo
                </p>
              </div>
            </div>
            <p className="text-white/70 italic">
              {car.financing.apr}% APR
            </p>
            
            {/* Loan Approval Status */}
            {quizAnswers && (
              <div className="mt-4 pt-4 border-t border-white/20">
                {loading ? (
                  <p className="text-white/70 italic text-sm">Checking approval...</p>
                ) : loanPrediction ? (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    loanPrediction.approved 
                      ? "bg-green-500/20 border border-green-500/50" 
                      : "bg-red-500/20 border border-red-500/50"
                  }`}>
                    {loanPrediction.approved ? (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400" />
                    )}
                    <div className="flex-1">
                      <p className={`text-sm font-semibold italic ${
                        loanPrediction.approved ? "text-green-300" : "text-red-300"
                      }`}>
                        {loanPrediction.approved ? "Loan Approved" : "Loan Not Approved"}
                      </p>
                      <p className="text-white/70 italic text-xs mt-1">
                        {Math.round(loanPrediction.probability * 100)}% probability • {loanPrediction.reason}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary/20">
            <div>
              <p className="text-gray-400 mb-1 italic">Transmission</p>
              <p className="text-white italic">{car.specs.transmission}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1 italic">Drivetrain</p>
              <p className="text-white italic">{car.specs.drivetrain}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
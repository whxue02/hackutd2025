import React, { useState, useEffect } from "react";
import { Car } from "../types/car";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { QuizAnswers } from "./Quiz";
import { predictLoanApproval, LoanPrediction } from "../utils/loanPrediction";
import { CheckCircle, XCircle, DollarSign, Loader2, PhoneCall } from "lucide-react";

interface AllGridViewProps {
  selectedIds?: string[];
  onToggleSelect?: (id: string, car?: Car) => void;
  onCompare?: () => void;
  quizAnswers?: QuizAnswers | null;
}

interface ApiCar {
  hack_id: string;
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  msrp: number;
  epa_city_mpg: number;
  epa_highway_mpg: number;
  horsepower_hp: number;
  type: string;
  img_path: string;
}

interface ApiResponse {
  cars: ApiCar[];
  pagination: {
    page: number;
    page_size: number;
    total_pages: number;
    total_cars: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export function AllGridView({ selectedIds = [], onToggleSelect, onCompare, quizAnswers }: AllGridViewProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);
  const [selectedCarForLoan, setSelectedCarForLoan] = useState<Car | null>(null);
  const [loanPrediction, setLoanPrediction] = useState<LoanPrediction | null>(null);
  const [loanLoading, setLoanLoading] = useState(false);
  const [callLoading, setCallLoading] = useState<{[id: string]: boolean}>({}); // track per-car call loading if desired
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedCarForLoan) {
      console.log("[AllGridView] Modal opened for:", selectedCarForLoan.make, selectedCarForLoan.model, "MSRP:", selectedCarForLoan.financing.msrp);
      // Clear any existing prediction when car changes
      setLoanPrediction(null);
    }
  }, [selectedCarForLoan]);

  const handleCheckLoanApproval = async (car: Car) => {
    console.log("========== NEW CAR CLICKED ==========");
    console.log("[AllGridView] Check Loan Approval clicked for:", car.make, car.model, car.year);
    console.log("[AllGridView] Car MSRP (from car object):", car.financing?.msrp);
    
    if (!quizAnswers) {
      console.warn("[AllGridView] No quiz answers available");
      alert("Please complete the quiz first to check loan approval!");
      return;
    }

    // Clear previous prediction and set new car FIRST
    setLoanPrediction(null);
    setSelectedCarForLoan(car);
    setLoanLoading(true);

    try {
      // Verify MSRP is correct before making the call
      const carMsrp = car.financing?.msrp;
      if (!carMsrp || carMsrp <= 0) {
        throw new Error(`Invalid MSRP for ${car.make} ${car.model}: ${carMsrp}`);
      }
      
      console.log("[AllGridView] Calling predictLoanApproval with MSRP:", carMsrp);
      const prediction = await predictLoanApproval(quizAnswers, car);
      console.log("[AllGridView] Prediction received:", prediction);
      console.log("[AllGridView] Prediction was for MSRP:", carMsrp);
      setLoanPrediction(prediction);
    } catch (error) {
      console.error("[AllGridView] Error checking loan approval:", error);
      alert(`Failed to check loan approval: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setLoanPrediction(null);
    } finally {
      setLoanLoading(false);
    }
  };

  const closeLoanModal = () => {
    setSelectedCarForLoan(null);
    setLoanPrediction(null);
  };

  const fetchCars = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://127.0.0.1:5000/data/cars?page=${page}`);
      if (!response.ok) throw new Error('Failed to fetch cars');
      
      const data: ApiResponse = await response.json();
      
      // Transform API data to match Car interface
      const transformedCars: Car[] = data.cars.map(apiCar => ({
        id: apiCar.id.toString(),
        hack_id: apiCar.hack_id,
        year: apiCar.year,
        make: apiCar.make,
        model: apiCar.model,
        trim: apiCar.trim,
        category: apiCar.type,
        image: apiCar.img_path ? `http://127.0.0.1:5000/images/${apiCar.img_path}` : '/placeholder-car.jpg',
        safetyRating: 5, // Default safety rating
        financing: {
          msrp: apiCar.msrp,
          invoice: 0,
          estimatedPayment: Math.round((apiCar.msrp * 0.02) * 100) / 100,
          monthlyPayment: Math.round((apiCar.msrp * 0.02) * 100) / 100,
          apr: 5.49
        },
        gasMileage: {
          city: apiCar.epa_city_mpg || 0,
          highway: apiCar.epa_highway_mpg || 0,
          combined: Math.round(((apiCar.epa_city_mpg || 0) + (apiCar.epa_highway_mpg || 0)) / 2)
        },
        specs: {
          horsepower: apiCar.horsepower_hp || 0,
          torque: 0,
          engine: '',
          transmission: '',
          drivetrain: ''
        }
      }));
      
      setCars(transformedCars);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // handler to POST to dealer-call with no data
  const handleDealerCall = async (carId?: string) => {
    try {
      if (carId) setCallLoading(prev => ({ ...prev, [carId]: true }));
      else {} // no-op if no id given

      const res = await fetch("http://127.0.0.1:5001/dealer-call", {
        method: "POST",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Dealer call failed:", res.status, text);
      } else {
        console.log("Dealer call triggered");
      }
    } catch (err) {
      console.error("Error calling dealer:", err);
    } finally {
      if (carId) setCallLoading(prev => ({ ...prev, [carId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-white text-xl italic">Loading cars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-xl italic">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 relative pb-32">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
          All Cars {pagination && `(${pagination.total_cars} total)`}
        </h3>
        <div className="text-gray-400 text-sm italic">
          Page {pagination?.page} of {pagination?.total_pages}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cars.map((car) => {
          const selected = selectedIds.includes(car.id);
          const isCalling = !!callLoading[car.id];

          return (
            <div key={car.id} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selected ? 'ring-2 ring-primary/70 border-primary/60' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:border-primary/50 hover:shadow-md hover:shadow-primary/20'}`}>
              <div
                className="block cursor-pointer"
                onClick={() => navigate(`/car/${car.hack_id}`)}
              >
                <div className="relative h-40">
                  <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-3 py-1 shadow-lg shadow-primary/50 italic text-xs">
                      {car.category}
                    </Badge>
                  </div>

                  {/* phone call button positioned bottom-right of the image */}
                  <div className="absolute bottom-3 right-3">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDealerCall(car.id); }}
                      disabled={isCalling}
                      aria-label="Call dealer"
                      className={`flex items-center justify-center w-10 h-10 rounded-full bg-primary/95 text-white shadow-lg hover:scale-105 transition-transform ${
                        isCalling ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-white mb-2 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                    {car.year} {car.make} {car.model}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 italic">MSRP:</span>
                      <span className="text-white italic">${car.financing.msrp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 italic">MPG:</span>
                      <span className="text-white italic">{car.gasMileage.city}/{car.gasMileage.highway}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 italic">Power:</span>
                      <span className="text-white italic">{car.specs.horsepower} HP</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Approval Button */}
              <div className="p-4 pt-0 border-t border-gray-700/50">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    handleCheckLoanApproval(car);
                  }}
                  disabled={!quizAnswers}
                  className="w-full italic bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  size="sm"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  {quizAnswers ? "Check Loan Approval" : "Complete Quiz First"}
                </Button>
              </div>

              {/* select button */}
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggleSelect && onToggleSelect(car.id, car); }}
                className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center ${selected ? 'bg-primary text-black' : 'bg-white/6 text-white'} shadow-md`}
                title={selected ? 'Deselect' : 'Select for compare'}
              >
                {selected ? '✓' : '+'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Loan Approval Modal */}
      {selectedCarForLoan && (
        <div 
          key={`loan-modal-${selectedCarForLoan.id}-${selectedCarForLoan.financing.msrp}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" 
          onClick={closeLoanModal}
        >
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-8 max-w-md w-full mx-4 border border-primary/40 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-2xl italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                Loan Approval Check
              </h3>
              <button
                onClick={closeLoanModal}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-white mb-2 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                {selectedCarForLoan.year} {selectedCarForLoan.make} {selectedCarForLoan.model}
              </h4>
              <p className="text-gray-400 italic">MSRP: ${selectedCarForLoan.financing.msrp.toLocaleString()}</p>
            </div>

            {loanLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <span className="ml-3 text-white italic">Checking approval...</span>
              </div>
            ) : loanPrediction ? (
              <div className={`p-6 rounded-xl border-2 ${
                loanPrediction.approved
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-red-500/10 border-red-500/50"
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {loanPrediction.approved ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <p className={`text-xl font-bold italic ${
                      loanPrediction.approved ? "text-green-300" : "text-red-300"
                    }`} style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                      {loanPrediction.approved ? "Loan Approved!" : "Loan Not Approved"}
                    </p>
                    <p className="text-gray-400 italic text-sm mt-1">
                      {Math.round(loanPrediction.probability * 100)}% probability
                    </p>
                  </div>
                </div>
                <p className="text-white/80 italic text-sm">
                  {loanPrediction.reason}
                </p>
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 italic">Score</p>
                      <p className="text-white italic font-semibold">{loanPrediction.score}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 italic">Probability</p>
                      <p className="text-white italic font-semibold">{Math.round(loanPrediction.probability * 100)}%</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-gray-500 italic text-xs">
                      Loan Amount: ${selectedCarForLoan.financing.msrp.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="mt-6">
              <Button
                onClick={closeLoanModal}
                className="w-full italic bg-gray-800 hover:bg-gray-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-8 flex justify-center items-center gap-4">
        <Button
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={!pagination?.has_prev}
          className={`italic px-6 py-2 ${pagination?.has_prev ? 'bg-gradient-to-r from-primary to-primary/80 text-white' : 'bg-white/6 text-white/40 cursor-not-allowed'}`}
        >
          Previous
        </Button>
        <div className="text-white italic">
          Page {pagination?.page} of {pagination?.total_pages}
        </div>
        <Button
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={!pagination?.has_next}
          className={`italic px-6 py-2 ${pagination?.has_next ? 'bg-gradient-to-r from-primary to-primary/80 text-white' : 'bg-white/6 text-white/40 cursor-not-allowed'}`}
        >
          Next
        </Button>
      </div>

      {/* Inline compare bar (always visible in content) - easier to notice */}
      <div className="mt-6">
        <div className="sticky bottom-0 left-0 right-0 z-40 flex justify-center items-center py-4 bg-gradient-to-t from-black/60 via-transparent to-transparent">
          <Button
            onClick={() => onCompare && onCompare()}
            className={`italic px-6 py-3 ${selectedIds.length >= 2 ? 'bg-gradient-to-r from-primary to-primary/80 text-white' : 'bg-white/6 text-white/40 cursor-not-allowed'}`}
            disabled={selectedIds.length < 2}
          >
            {selectedIds.length >= 2 ? `Compare (${selectedIds.length})` : 'Select 2 cars to Compare'}
          </Button>
        </div>
      </div>

      {/* Floating compare button when two selected */}
      {selectedIds.length >= 2 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3">
          <div className="flex items-center bg-black/40 rounded-full px-3 py-2 text-sm text-white/90 shadow-md">
            Selected: <span className="ml-2 font-bold">{selectedIds.length}</span>
          </div>
          <Button onClick={() => onCompare && onCompare()} className="italic px-6 py-3 bg-gradient-to-r from-primary to-primary/80">
            Compare ({selectedIds.length})
          </Button>
        </div>
      )}
    </div>
  );
}
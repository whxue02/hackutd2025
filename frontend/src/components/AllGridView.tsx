import React, { useState, useEffect } from "react";
import { Car } from "../types/car";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { QuizAnswers } from "./Quiz";
import { predictLoanApproval, LoanPrediction } from "../utils/loanPrediction";
import { CheckCircle, XCircle, DollarSign, Loader2, PhoneCall } from "lucide-react";
import { transform } from "motion/react";

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
  estimated_current_cost: number;
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
  const [callLoading, setCallLoading] = useState<{[id: string]: boolean}>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedCarForLoan) {
      setLoanPrediction(null);
    }
  }, [selectedCarForLoan]);

  const handleCheckLoanApproval = async (car: Car) => {
    if (!quizAnswers) {
      alert("Please complete the quiz first to check loan approval!");
      return;
    }

    setLoanPrediction(null);
    setSelectedCarForLoan(car);
    setLoanLoading(true);

    try {
      const carMsrp = car.financing?.msrp;
      if (!carMsrp || carMsrp <= 0) {
        throw new Error(`Invalid MSRP for ${car.make} ${car.model}: ${carMsrp}`);
      }
      
      const prediction = await predictLoanApproval(quizAnswers, car);
      setLoanPrediction(prediction);
    } catch (error) {
      console.error("Error checking loan approval:", error);
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
      
      const transformedCars: Car[] = data.cars.map(apiCar => ({
        id: apiCar.id.toString(),
        hack_id: apiCar.hack_id,
        year: apiCar.year,
        make: apiCar.make,
        model: apiCar.model,
        trim: apiCar.trim,
        category: apiCar.type,
        image: apiCar.img_path ? `http://127.0.0.1:5000/images/${apiCar.img_path}` : '/placeholder-car.jpg',
        safetyRating: 5,
        financing: {
          msrp: apiCar.msrp,
          invoice: 0,
          estimated_current_cost: apiCar.estimated_current_cost,
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

  const handleDealerCall = async (carId?: string) => {
    try {
      if (carId) setCallLoading(prev => ({ ...prev, [carId]: true }));

      const res = await fetch("http://127.0.0.1:5001/dealer-call", {
        method: "POST",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Dealer call failed:", res.status, text);
      }
    } catch (err) {
      console.error("Error calling dealer:", err);
    } finally {
      if (carId) setCallLoading(prev => ({ ...prev, [carId]: false }));
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#1a1a1a', fontSize: '20px', fontWeight: '500' }}>Loading cars...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <div style={{ color: '#8b1538', fontSize: '20px', fontWeight: '500' }}>Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      {/* Background Image */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100vh',
        backgroundImage: 'url(/images/image.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: 0.15,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px', position: 'relative', zIndex: 1, paddingBottom: '128px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: '600', margin: 0 }}>
            All Cars {pagination && `(${pagination.total_cars} total)`}
          </h3>
          <div style={{ color: '#666', fontSize: '14px' }}>
            Page {pagination?.page} of {pagination?.total_pages}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {cars.map((car) => {
            const selected = selectedIds.includes(car.id);
            const isCalling = !!callLoading[car.id];

            return (
              <div 
                key={car.id} 
                style={{
                  position: 'relative',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#fdfdfd',
                  boxShadow: selected ? '0 4px 20px rgba(139, 21, 56, 0.3)' : '0 2px 12px rgba(0,0,0,0.1)',
                  border: selected ? '2px solid #8b1538' : '1px solid rgba(0,0,0,0.04)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
              >
                <div onClick={() => navigate(`/car/${car.hack_id}`)}>
                  <div style={{ position: 'relative', height: '160px' }}>
                    <img 
                      src={car.image} 
                      alt={`${car.make} ${car.model}`} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#e3000d',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                      {car.category}
                    </div>

                    {/* Phone call button */}
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleDealerCall(car.id); }}
                        disabled={isCalling}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: '#e3000d',
                          color: '#fff',
                          border: 'none',
                          cursor: isCalling ? 'not-allowed' : 'pointer',
                          opacity: isCalling ? 0.6 : 1,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                          transition: 'transform 0.2s ease'
                        }}
                        onMouseEnter={(e) => !isCalling && (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                      >
                        <PhoneCall style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '16px' }}>
                    <h4 style={{ color: '#1a1a1a', marginBottom: '8px', fontSize: '16px', fontWeight: '600', margin: '0 0 12px 0' }}>
                      {car.year} {car.make} {car.model}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#666' }}>Estimated Cost:</span>
                        <span style={{ color: '#1a1a1a', fontWeight: '500' }}>${car.financing.estimated_current_cost.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#666' }}>MPG:</span>
                        <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.gasMileage.city}/{car.gasMileage.highway}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                        <span style={{ color: '#666' }}>Power:</span>
                        <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.specs.horsepower} HP</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Loan Approval Button */}
                <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      handleCheckLoanApproval(car);
                    }}
                    disabled={!quizAnswers}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: quizAnswers ? '#e3000d' : '#e0e0e0',
                      color: quizAnswers ? '#fff' : '#999',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: '500',
                      cursor: quizAnswers ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      marginTop: '12px',
                      boxShadow: quizAnswers ? '0 2px 8px rgba(139, 21, 56, 0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <DollarSign style={{ width: '16px', height: '16px' }} />
                    {quizAnswers ? "Check Loan Approval" : "Complete Quiz First"}
                  </button>
                </div>

                {/* Select button */}
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    e.preventDefault(); 
                    onToggleSelect && onToggleSelect(car.id, car); 
                  }}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: selected ? '#8b1538' : '#fdfdfd',
                    color: selected ? '#fff' : '#1a1a1a',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}
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
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 50,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              marginTop: "70px"
            }}
            onClick={closeLoanModal}
          >
            <div 
              style={{
                background: '#fdfdfd',
                borderRadius: '24px',
                padding: '32px',
                maxWidth: '480px',
                width: '90%',
                margin: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ color: '#1a1a1a', fontSize: '24px', fontWeight: '600', margin: 0 }}>
                  Loan Approval Check
                </h3>
                <button
                  onClick={closeLoanModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    fontSize: '32px',
                    cursor: 'pointer',
                    lineHeight: '1'
                  }}
                >
                  ×
                </button>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#1a1a1a', marginBottom: '8px', fontSize: '18px', fontWeight: '600' }}>
                  {selectedCarForLoan.year} {selectedCarForLoan.make} {selectedCarForLoan.model}
                </h4>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                  MSRP: ${selectedCarForLoan.financing.msrp.toLocaleString()}
                </p>
              </div>

              {loanLoading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
                  <Loader2 style={{ width: '32px', height: '32px', color: '#8b1538', animation: 'spin 1s linear infinite' }} />
                  <span style={{ marginLeft: '12px', color: '#1a1a1a' }}>Checking approval...</span>
                </div>
              ) : loanPrediction ? (
                <div style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: `2px solid ${loanPrediction.approved ? '#22c55e' : '#ef4444'}`,
                  background: loanPrediction.approved ? 'rgba(34, 197, 94, 0.05)' : 'rgba(239, 68, 68, 0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    {loanPrediction.approved ? (
                      <CheckCircle style={{ width: '32px', height: '32px', color: '#22c55e' }} />
                    ) : (
                      <XCircle style={{ width: '32px', height: '32px', color: '#ef4444' }} />
                    )}
                    <div>
                      <p style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: loanPrediction.approved ? '#16a34a' : '#dc2626',
                        margin: 0
                      }}>
                        {loanPrediction.approved ? "Loan Approved!" : "Loan Not Approved"}
                      </p>
                      <p style={{ color: '#666', fontSize: '13px', marginTop: '4px', margin: '4px 0 0 0' }}>
                        {Math.round(loanPrediction.probability * 100)}% probability
                      </p>
                    </div>
                  </div>
                  <p style={{ color: '#1a1a1a', fontSize: '14px', marginBottom: '16px' }}>
                    {loanPrediction.reason}
                  </p>
                  <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '13px' }}>
                      <div>
                        <p style={{ color: '#666', margin: '0 0 4px 0' }}>Score</p>
                        <p style={{ color: '#1a1a1a', fontWeight: '600', margin: 0 }}>{loanPrediction.score}</p>
                      </div>
                      <div>
                        <p style={{ color: '#666', margin: '0 0 4px 0' }}>Probability</p>
                        <p style={{ color: '#1a1a1a', fontWeight: '600', margin: 0 }}>{Math.round(loanPrediction.probability * 100)}%</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                      <p style={{ color: '#999', fontSize: '12px', margin: 0 }}>
                        Loan Amount: ${selectedCarForLoan.financing.msrp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: '24px' }}>
                <button
                  onClick={closeLoanModal}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#e8e8e8',
                    color: '#1a1a1a',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#d8d8d8')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#e8e8e8')}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={!pagination?.has_prev}
            style={{
              padding: '10px 24px',
              background: pagination?.has_prev ? '#e3000d' : '#e8e8e8',
              color: pagination?.has_prev ? '#fff' : '#999',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: pagination?.has_prev ? 'pointer' : 'not-allowed',
              boxShadow: pagination?.has_prev ? '0 2px 8px rgba(139, 21, 56, 0.2)' : 'none'
            }}
          >
            Previous
          </button>
          <div style={{ color: '#1a1a1a', fontSize: '14px' }}>
            Page {pagination?.page} of {pagination?.total_pages}
          </div>
          <button
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!pagination?.has_next}
            style={{
              padding: '10px 24px',
              background: pagination?.has_next ? '#e3000d' : '#e8e8e8',
              color: pagination?.has_next ? '#fff' : '#999',
              border: 'none',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: pagination?.has_next ? 'pointer' : 'not-allowed',
              boxShadow: pagination?.has_next ? '0 2px 8px rgba(139, 21, 56, 0.2)' : 'none'
            }}
          >
            Next
          </button>
        </div>

        {/* Floating compare button */}
        {selectedIds.length >= 2 && (
          <div style={{
            position: 'fixed',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#fdfdfd',
              borderRadius: '24px',
              padding: '8px 16px',
              fontSize: '14px',
              color: '#1a1a1a',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
              fontWeight: '500'
            }}>
              Selected: <span style={{ marginLeft: '8px', fontWeight: '700', color: '#8b1538' }}>{selectedIds.length}</span>
            </div>
            <button
              onClick={() => onCompare && onCompare()}
              style={{
                padding: '12px 24px',
                background: '#e3000d',
                color: '#fff',
                border: 'none',
                borderRadius: '24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(139, 21, 56, 0.3)',
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              Compare ({selectedIds.length})
            </button>
          </div>
        )}
      </div>
    </>
  );
}
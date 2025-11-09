import { useState, useEffect } from "react";
import { Car } from "../types/car";
import { Gauge, Fuel, DollarSign, Star, CheckCircle, XCircle } from "lucide-react";
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
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      background: '#fdfdfd',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
      overflow: 'hidden',
      border: '1px solid rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      {/* Hero Image */}
      <div style={{
        position: 'relative',
        height: '45%',
        flexShrink: 0
      }}>
        <img 
          src={car.image} 
          alt={`${car.make} ${car.model}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'contrast(1.05) saturate(1.1)'
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)'
        }} />
        <div style={{
          position: 'absolute',
          top: '24px',
          right: '24px'
        }}>
          <div style={{
            background: '#fdfdfd',
            padding: '8px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '600',
            color: '#1a1a1a',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}>
            {car.category}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div style={{
        position: 'relative',
        padding: '24px',
        flex: 1,
        overflowY: 'auto',
        minHeight: 0
      }}>
        {/* Title & Rating */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            margin: '0 0 12px 0',
            fontSize: '24px',
            fontWeight: '800',
            color: '#1a1a1a'
          }}>
            {car.year} {car.make} {car.model}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: '16px',
                    color: i < car.safetyRating ? '#8b1538' : '#ddd'
                  }}
                >
                  ★
                </span>
              ))}
            </div>
            <span style={{ fontSize: '13px', color: '#666' }}>Safety Rating</span>
          </div>
        </div>

        {/* Specs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* Engine */}
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                padding: '8px',
                background: 'rgba(139,21,56,0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(139,21,56,0.2)',
                flexShrink: 0
              }}>
                <Gauge style={{
                  width: '20px',
                  height: '20px',
                  color: '#8b1538'
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  Engine
                </p>
                <p style={{
                  margin: '0 0 2px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {car.specs.engine}
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {car.specs.horsepower} HP
                </p>
              </div>
            </div>
          </div>
          
          {/* MPG */}
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <div style={{
                padding: '8px',
                background: 'rgba(139,21,56,0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(139,21,56,0.2)',
                flexShrink: 0
              }}>
                <Fuel style={{
                  width: '20px',
                  height: '20px',
                  color: '#8b1538'
                }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  margin: '0 0 4px 0',
                  fontSize: '12px',
                  color: '#666',
                  fontWeight: '500'
                }}>
                  MPG
                </p>
                <p style={{
                  margin: '0 0 2px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1a1a1a'
                }}>
                  {car.gasMileage.city} city
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '12px',
                  color: '#666'
                }}>
                  {car.gasMileage.highway} hwy
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Financing Card */}
        <div style={{
          background: 'rgba(139,21,56,0.05)',
          borderRadius: '20px',
          padding: '20px',
          border: '1px solid rgba(139,21,56,0.2)',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{
              padding: '8px',
              background: 'rgba(139,21,56,0.15)',
              borderRadius: '10px',
              border: '1px solid rgba(139,21,56,0.3)'
            }}>
              <DollarSign style={{
                width: '20px',
                height: '20px',
                color: '#8b1538'
              }} />
            </div>
            <p style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: '700',
              color: '#1a1a1a'
            }}>
              Financing Options
            </p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '12px'
          }}>
            <div>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                color: '#666',
                fontWeight: '500'
              }}>
                MSRP
              </p>
              <p style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '800',
                color: '#1a1a1a'
              }}>
                ${car.financing.msrp.toLocaleString()}
              </p>
            </div>
            <div>
              <p style={{
                margin: '0 0 4px 0',
                fontSize: '12px',
                color: '#666',
                fontWeight: '500'
              }}>
                Monthly
              </p>
              <p style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '800',
                color: '#1a1a1a'
              }}>
                ${car.financing.monthlyPayment}/mo
              </p>
            </div>
          </div>
          
          <p style={{
            margin: 0,
            fontSize: '13px',
            color: '#666'
          }}>
            {car.financing.apr}% APR
          </p>
          
          {/* Loan Approval Status */}
          {quizAnswers && (
            <div style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
              {loading ? (
                <p style={{
                  margin: 0,
                  fontSize: '13px',
                  color: '#666'
                }}>
                  Checking approval...
                </p>
              ) : loanPrediction ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  borderRadius: '12px',
                  background: loanPrediction.approved 
                    ? 'rgba(34,197,94,0.1)' 
                    : 'rgba(239,68,68,0.1)',
                  border: loanPrediction.approved
                    ? '1px solid rgba(34,197,94,0.3)'
                    : '1px solid rgba(239,68,68,0.3)'
                }}>
                  {loanPrediction.approved ? (
                    <CheckCircle style={{
                      width: '20px',
                      height: '20px',
                      color: '#22c55e',
                      flexShrink: 0
                    }} />
                  ) : (
                    <XCircle style={{
                      width: '20px',
                      height: '20px',
                      color: '#ef4444',
                      flexShrink: 0
                    }} />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: '0 0 4px 0',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: loanPrediction.approved ? '#16a34a' : '#dc2626'
                    }}>
                      {loanPrediction.approved ? "Loan Approved" : "Loan Not Approved"}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      {Math.round(loanPrediction.probability * 100)}% probability • {loanPrediction.reason}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Transmission & Drivetrain */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(0,0,0,0.06)'
        }}>
          <div>
            <p style={{
              margin: '0 0 4px 0',
              fontSize: '12px',
              color: '#666',
              fontWeight: '500'
            }}>
              Transmission
            </p>
            <p style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              {car.specs.transmission}
            </p>
          </div>
          <div>
            <p style={{
              margin: '0 0 4px 0',
              fontSize: '12px',
              color: '#666',
              fontWeight: '500'
            }}>
              Drivetrain
            </p>
            <p style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: '600',
              color: '#1a1a1a'
            }}>
              {car.specs.drivetrain}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
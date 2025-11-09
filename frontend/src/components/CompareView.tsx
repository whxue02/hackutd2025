import React, { useState, useEffect } from "react";
import { Car } from "../types/car";
import { QuizAnswers } from "./Quiz";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CompareViewProps {
  likedCars: Car[];
  selectedCars: string[];
  onToggleSelection: (carId: string, car?: Car) => void;
  onBack: () => void;
  allCars?: Car[];
  quizAnswers?: QuizAnswers | null;
}

export function CompareView({ likedCars, selectedCars, onToggleSelection, onBack, allCars = [], quizAnswers }: CompareViewProps) {
  const lookup: Record<string, Car> = {};
  [...likedCars, ...allCars].forEach(c => { lookup[c.id] = c; });
  const carsToCompare = selectedCars.map(id => lookup[id]).filter(Boolean) as Car[];
  
  const allAvailableCars: Car[] = [];
  const seenIds = new Set<string>();
  
  likedCars.forEach(car => {
    if (!seenIds.has(car.id)) {
      allAvailableCars.push(car);
      seenIds.add(car.id);
    }
  });
  
  allCars.forEach(car => {
    if (!seenIds.has(car.id)) {
      allAvailableCars.push(car);
      seenIds.add(car.id);
    }
  });
  
  const handleTileClick = (car: Car) => {
    if (selectedCars.includes(car.id)) {
      onToggleSelection(car.id, car);
    } else if (selectedCars.length < 2) {
      onToggleSelection(car.id, car);
    } else {
      const firstCar = lookup[selectedCars[0]];
      if (firstCar) {
        onToggleSelection(selectedCars[0], firstCar);
      }
      onToggleSelection(car.id, car);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#fdfdfd',
      color: '#1a1a1a',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '40px 28px'
      }}>
        {/* Header */}
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ margin: "0 0 8px 0", fontSize: '32px', color: '#1a1a1a', fontWeight: '800' }}>
              Compare Cars
            </h1>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              {selectedCars.length === 0 && "Select two cars to compare side by side"}
              {selectedCars.length === 1 && "Select one more car to compare"}
              {selectedCars.length === 2 && `Comparing 2 of ${allAvailableCars.length} available cars`}
            </p>
          </div>

          <button 
            onClick={onBack}
            style={{
              background: '#fdfdfd',
              border: '1px solid rgba(0,0,0,0.06)',
              padding: '12px 24px',
              borderRadius: '24px',
              color: '#1a1a1a',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            ← Back to Swiping
          </button>
        </div>

        {/* Side-by-Side Comparison */}
        {carsToCompare.length === 2 && (
          <div style={{ marginBottom: '48px' }}>
            <h3 style={{ margin: '0 0 24px 0', color: '#1a1a1a', fontSize: '25px', fontWeight: '800' }}>
              Side-by-Side Comparison
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {carsToCompare.map((car) => (
                <DetailedCarCard key={car.id} car={car} />
              ))}
            </div>
            
            {quizAnswers && quizAnswers.city && quizAnswers.state && quizAnswers.milesPerWeek && (
              <CommutingCostComparison 
                cars={carsToCompare}
                city={quizAnswers.city}
                state={quizAnswers.state}
                milesPerWeek={parseFloat(quizAnswers.milesPerWeek) || 0}
              />
            )}
          </div>
        )}

        {/* Car Selection Grid */}
        <div>
          <h3 style={{ margin: '0 0 24px 0', color: '#1a1a1a', fontSize: '25px', fontWeight: '800' }}>
            {carsToCompare.length === 2 ? "All Available Cars" : "Select 2 Cars to Compare"}
          </h3>
          {allAvailableCars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: '#666', fontSize: '16px' }}>No cars available to compare. Select cars from the All view first.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '18px'
            }}>
              {allAvailableCars.map((car) => (
                <CarTile
                  key={car.id}
                  car={car}
                  isSelected={selectedCars.includes(car.id)}
                  onClick={() => handleTileClick(car)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CarTileProps {
  car: Car;
  isSelected: boolean;
  onClick: () => void;
}

function CarTile({ car, isSelected, onClick }: CarTileProps) {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        background: '#fdfdfd',
        borderRadius: '20px',
        border: isSelected ? '2px solid #8b1538' : '1px solid rgba(0,0,0,0.06)',
        overflow: 'hidden',
        boxShadow: isSelected ? '0 4px 20px rgba(139,21,56,0.2)' : '0 2px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
    >
      <div style={{ position: 'relative', height: '180px' }}>
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
        {isSelected && (
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#8b1538',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(139,21,56,0.4)'
          }}>
            ✓
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: '#fdfdfd',
          padding: '6px 12px',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600',
          color: '#1a1a1a',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}>
          {car.category}
        </div>
      </div>
      
      <div style={{ padding: '18px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '18px', fontWeight: '700', color: '#1a1a1a' }}>
          {car.year} {car.make} {car.model}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
            <span style={{ color: '#666' }}>MSRP:</span>
            <span style={{ color: '#1a1a1a', fontWeight: '600' }}>
              ${car.financing.msrp.toLocaleString()}
            </span>
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
  );
}

interface DetailedCarCardProps {
  car: Car;
}

function DetailedCarCard({ car }: DetailedCarCardProps) {
  return (
    <div style={{
      background: '#fdfdfd',
      borderRadius: '24px',
      border: '1px solid rgba(0,0,0,0.06)',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <div style={{ position: 'relative', height: '240px' }}>
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
      </div>
      
      <div style={{ padding: '24px' }}>
        <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 4px 0', fontSize: '24px', fontWeight: '800', color: '#1a1a1a' }}>
            {car.year} {car.make} {car.model}
          </h3>
          <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{car.category}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Safety Rating */}
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>
              Safety Rating
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ 
                  fontSize: '18px',
                  color: i < car.safetyRating ? '#8b1538' : '#ddd'
                }}>
                  ★
                </span>
              ))}
            </div>
          </div>

          {/* Engine & Performance */}
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
              Engine & Performance
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>Engine:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.specs.engine}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>Horsepower:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.specs.horsepower} HP</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>Transmission:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.specs.transmission}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>Drivetrain:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.specs.drivetrain}</span>
              </div>
            </div>
          </div>

          {/* Fuel Economy */}
          <div style={{ paddingBottom: '20px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
              Fuel Economy
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>City:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.gasMileage.city} MPG</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>Highway:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.gasMileage.highway} MPG</span>
              </div>
            </div>
          </div>

          {/* Financing */}
          <div>
            <div style={{ color: '#666', fontSize: '12px', fontWeight: '600', marginBottom: '12px' }}>
              Financing
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>MSRP:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '600' }}>
                  ${car.financing.msrp.toLocaleString()}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>Monthly:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '600' }}>
                  ${car.financing.monthlyPayment}/mo
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: '#666' }}>APR:</span>
                <span style={{ color: '#1a1a1a', fontWeight: '500' }}>{car.financing.apr}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CommutingCostComparisonProps {
  cars: Car[];
  city: string;
  state: string;
  milesPerWeek: number;
}

function CommutingCostComparison({ cars, city, state, milesPerWeek }: CommutingCostComparisonProps) {
  const [gasPrice, setGasPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGasPrice = async () => {
      try {
        setLoading(true);
        const url = `http://localhost:5001/gas-price?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch gas price');
        }
        const data = await response.json();
        setGasPrice(data.price);
        setError(null);
      } catch (err) {
        console.error("Error fetching gas price:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch gas price');
        setGasPrice(3.50);
      } finally {
        setLoading(false);
      }
    };

    if (city && state) {
      fetchGasPrice();
    }
  }, [city, state, milesPerWeek]);

  const calculateWeeklyCost = (car: Car, gasPricePerGallon: number): number => {
    const mpg = (car.gasMileage.city + car.gasMileage.highway) / 2;
    if (mpg <= 0) return 0;
    const gallonsPerWeek = milesPerWeek / mpg;
    return gallonsPerWeek * gasPricePerGallon;
  };

  if (loading) {
    return (
      <div style={{
        marginTop: '48px',
        background: '#fdfdfd',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
          Weekly Commuting Cost Comparison
        </h4>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Loading gas price data...</p>
      </div>
    );
  }

  if (!gasPrice || cars.length !== 2) {
    return null;
  }

  const chartData = cars.map(car => {
    const weeklyCost = calculateWeeklyCost(car, gasPrice);
    const mpg = (car.gasMileage.city + car.gasMileage.highway) / 2;
    return {
      name: `${car.year} ${car.make} ${car.model}`,
      weeklyCost: Math.round(weeklyCost * 100) / 100,
      mpg: Math.round(mpg),
      savings: 0
    };
  });

  const costDifference = Math.abs(chartData[0].weeklyCost - chartData[1].weeklyCost);
  const cheaperCar = chartData[0].weeklyCost < chartData[1].weeklyCost ? 0 : 1;
  chartData[cheaperCar].savings = costDifference;
  const totalSavings = costDifference * 52;

  return (
    <div style={{
      marginTop: '48px',
      background: '#fdfdfd',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(0,0,0,0.06)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '22px', fontWeight: '800', color: '#1a1a1a' }}>
        Weekly Commuting Cost Comparison
      </h4>
      <p style={{ margin: '0 0 24px 0', color: '#666', fontSize: '13px' }}>
        Based on {milesPerWeek} miles/week in {city}, {state} • Gas: ${gasPrice.toFixed(2)}/gallon
      </p>

      {error && (
        <p style={{ margin: '0 0 24px 0', color: '#8b1538', fontSize: '13px' }}>
          ⚠️ Using estimated gas price. {error}
        </p>
      )}

      <div style={{
        background: 'rgba(0,0,0,0.02)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#666"
              tick={{ fill: '#666', fontSize: 12 }}
              label={{ value: 'Weekly Cost ($)', angle: -90, position: 'insideLeft', fill: '#666' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fdfdfd', 
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '12px',
                color: '#1a1a1a',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Weekly Cost']}
            />
            <Legend wrapperStyle={{ color: '#666' }} />
            <Bar 
              dataKey="weeklyCost" 
              fill="#8b1538"
              radius={[8, 8, 0, 0]}
              name="Weekly Cost"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '24px' }}>
        {chartData.map((data, index) => (
          <div key={index} style={{
            background: 'rgba(0,0,0,0.02)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '12px', fontWeight: '500' }}>{data.name}</p>
            <p style={{ margin: '0 0 6px 0', fontSize: '28px', fontWeight: '800', color: '#1a1a1a' }}>
              ${data.weeklyCost.toFixed(2)}<span style={{ fontSize: '14px', fontWeight: '500', color: '#666' }}>/week</span>
            </p>
            <p style={{ margin: 0, color: '#999', fontSize: '11px' }}>
              {data.mpg} MPG • ${(data.weeklyCost * 52).toFixed(2)}/year
            </p>
          </div>
        ))}
      </div>

      {totalSavings > 0 && (
        <div style={{
          padding: '20px',
          background: 'rgba(139,21,56,0.05)',
          border: '1px solid rgba(139,21,56,0.2)',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#8b1538', fontSize: '15px', fontWeight: '600' }}>
            💰 You could save <span style={{ fontWeight: '800' }}>${totalSavings.toFixed(2)}/year</span> by choosing the more fuel-efficient option!
          </p>
        </div>
      )}
    </div>
  );
}
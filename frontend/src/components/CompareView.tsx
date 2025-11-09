import React, { useState, useEffect } from "react";
import { Car } from "../types/car";
import { Gauge, Fuel, DollarSign, Star, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
  // Resolve selected ids against likedCars first, then fallback to allCars so selections
  // made from the All grid (which may not be in likedCars) are still shown.
  const lookup: Record<string, Car> = {};
  [...likedCars, ...allCars].forEach(c => { lookup[c.id] = c; });
  const carsToCompare = selectedCars.map(id => lookup[id]).filter(Boolean) as Car[];
  
  // Combine all cars for display, avoiding duplicates (prefer likedCars if duplicate)
  const allAvailableCars: Car[] = [];
  const seenIds = new Set<string>();
  
  // Add liked cars first
  likedCars.forEach(car => {
    if (!seenIds.has(car.id)) {
      allAvailableCars.push(car);
      seenIds.add(car.id);
    }
  });
  
  // Add cars from allCars that aren't already in likedCars
  allCars.forEach(car => {
    if (!seenIds.has(car.id)) {
      allAvailableCars.push(car);
      seenIds.add(car.id);
    }
  });
  
  const handleTileClick = (car: Car) => {
    if (selectedCars.includes(car.id)) {
      // Deselect if already selected
      onToggleSelection(car.id, car);
    } else if (selectedCars.length < 2) {
      // Select if less than 2 are selected
      onToggleSelection(car.id, car);
    } else {
      // Replace the first selected car if 2 are already selected
      const firstCar = lookup[selectedCars[0]];
      if (firstCar) {
        onToggleSelection(selectedCars[0], firstCar);
      }
      onToggleSelection(car.id, car);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-primary/30 bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 shadow-lg shadow-primary/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={onBack} className="hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 hover:border-primary/50 italic">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Swiping
            </Button>
            <h2 className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
              Compare Cars ({allAvailableCars.length} available)
            </h2>
          </div>
          <p className="text-gray-400 italic text-center">
            {selectedCars.length === 0 && "Select two cars to compare"}
            {selectedCars.length === 1 && "Select one more car to compare"}
            {selectedCars.length === 2 && "Comparing 2 cars"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto p-6">
          {/* Detailed Comparison - Shows when 2 cars selected */}
          {carsToCompare.length === 2 && (
            <div className="mb-8">
              <h3 className="text-white mb-6 italic text-center" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                Side-by-Side Comparison
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {carsToCompare.map((car) => (
                  <DetailedCarCard key={car.id} car={car} />
                ))}
              </div>
              
              {/* Weekly Commuting Cost Comparison */}
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

          {/* Car Tiles Grid */}
          <div>
            <h3 className="text-white mb-4 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
              {carsToCompare.length === 2 ? "All Available Cars" : "Select 2 Cars to Compare"}
            </h3>
            {allAvailableCars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 italic">No cars available to compare. Select cars from the All view first.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all bg-gradient-to-br from-gray-900 via-gray-800 to-black ${
        isSelected
          ? "border-primary shadow-lg shadow-primary/30 ring-2 ring-primary/50"
          : "border-gray-700 hover:border-primary/50 hover:shadow-md hover:shadow-primary/20"
      }`}
    >
      <div className="relative h-40">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute top-3 right-3">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-3 py-1 shadow-lg shadow-primary/50 italic text-xs">
            {car.category}
          </Badge>
        </div>
        {isSelected && (
          <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary border-2 border-white flex items-center justify-center shadow-lg">
            <span className="text-white">✓</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h4 className="text-white mb-2 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
          {car.year} {car.make} {car.model}
        </h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400 italic">MSRP:</span>
            <span className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
              ${car.financing.msrp.toLocaleString()}
            </span>
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
  );
}

interface DetailedCarCardProps {
  car: Car;
}

function DetailedCarCard({ car }: DetailedCarCardProps) {
  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden border border-primary/40 shadow-primary/20">
      <div className="relative">
        <img
          src={car.image}
          alt={`${car.make} ${car.model}`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>
      
      <div className="p-6 space-y-4">
        <div className="pb-4 border-b border-primary/30">
          <h3 className="text-white mb-1 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
            {car.year} {car.make} {car.model}
          </h3>
          <p className="text-gray-400 italic">{car.category}</p>
        </div>

        <div className="space-y-4">
          <div className="pb-4 border-b border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <Star className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.6)]" />
              </div>
              <span className="text-white italic text-sm">Safety Rating</span>
            </div>
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < car.safetyRating
                      ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.8)]"
                      : "text-gray-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pb-4 border-b border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <Gauge className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.6)]" />
              </div>
              <span className="text-white italic text-sm">Engine & Performance</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 italic">Engine:</span>
                <span className="text-white italic">{car.specs.engine}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 italic">Horsepower:</span>
                <span className="text-white italic">{car.specs.horsepower} HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 italic">Transmission:</span>
                <span className="text-white italic">{car.specs.transmission}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 italic">Drivetrain:</span>
                <span className="text-white italic">{car.specs.drivetrain}</span>
              </div>
            </div>
          </div>

          <div className="pb-4 border-b border-primary/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <Fuel className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.6)]" />
              </div>
              <span className="text-white italic text-sm">Fuel Economy</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 italic">City:</span>
                <span className="text-white italic">{car.gasMileage.city} MPG</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 italic">Highway:</span>
                <span className="text-white italic">{car.gasMileage.highway} MPG</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg border border-primary/30">
                <DollarSign className="w-4 h-4 text-primary drop-shadow-[0_0_8px_rgba(139,21,56,0.6)]" />
              </div>
              <span className="text-white italic text-sm">Financing</span>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400 italic">MSRP:</span>
                <span className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                  ${car.financing.msrp.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 italic">Monthly:</span>
                <span className="text-white italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
                  ${car.financing.monthlyPayment}/mo
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 italic">APR:</span>
                <span className="text-white italic">{car.financing.apr}%</span>
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
        console.log("========== GAS PRICE REQUEST ==========");
        console.log("[CommutingCostComparison] City from quiz:", city);
        console.log("[CommutingCostComparison] State from quiz:", state);
        console.log("[CommutingCostComparison] Miles per week:", milesPerWeek);
        
        // Use sai.py endpoint on localhost:5001
        const url = `http://localhost:5001/gas-price?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}`;
        console.log("[CommutingCostComparison] Fetching gas price from sai.py:", url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch gas price');
        }
        const data = await response.json();
        console.log("[CommutingCostComparison] Gas price received from sai.py:", data.price);
        setGasPrice(data.price);
        setError(null);
      } catch (err) {
        console.error("[CommutingCostComparison] Error fetching gas price from sai.py:", err);
        setError(err instanceof Error ? err.message : 'Failed to fetch gas price');
        // Use a default gas price if API fails (national average ~$3.50)
        setGasPrice(3.50);
      } finally {
        setLoading(false);
      }
    };

    if (city && state) {
      fetchGasPrice();
    } else {
      console.warn("[CommutingCostComparison] Missing city or state:", { city, state });
    }
  }, [city, state, milesPerWeek]);

  // Calculate weekly commuting cost for each car
  const calculateWeeklyCost = (car: Car, gasPricePerGallon: number): number => {
    // Average city and highway MPG for combined estimate
    const mpg = (car.gasMileage.city + car.gasMileage.highway) / 2;
    if (mpg <= 0) return 0;
    const gallonsPerWeek = milesPerWeek / mpg;
    return gallonsPerWeek * gasPricePerGallon;
  };

  if (loading) {
    return (
      <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 border border-primary/40">
        <h4 className="text-white mb-4 italic text-xl" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
          Weekly Commuting Cost Comparison
        </h4>
        <p className="text-gray-400 italic">Loading gas price data...</p>
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
      savings: 0 // Will calculate below
    };
  });

  // Calculate savings (difference between the two cars)
  const costDifference = Math.abs(chartData[0].weeklyCost - chartData[1].weeklyCost);
  const cheaperCar = chartData[0].weeklyCost < chartData[1].weeklyCost ? 0 : 1;
  chartData[cheaperCar].savings = costDifference;

  const totalSavings = costDifference * 52; // Annual savings

  return (
    <div className="mt-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-6 border border-primary/40">
      <h4 className="text-white mb-2 italic text-xl" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
        Weekly Commuting Cost Comparison
      </h4>
      <p className="text-gray-400 italic text-sm mb-4">
        Based on {milesPerWeek} miles/week in {city}, {state} • Gas: ${gasPrice.toFixed(2)}/gallon
      </p>

      {error && (
        <p className="text-yellow-400 italic text-sm mb-4">
          ⚠️ Using estimated gas price. {error}
        </p>
      )}

      <div className="bg-gray-900/50 rounded-xl p-4 mb-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              label={{ value: 'Weekly Cost ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1F2937', 
                border: '1px solid #8B1F3D',
                borderRadius: '8px',
                color: '#fff'
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Weekly Cost']}
            />
            <Legend 
              wrapperStyle={{ color: '#9CA3AF' }}
            />
            <Bar 
              dataKey="weeklyCost" 
              fill="#8B1F3D"
              radius={[8, 8, 0, 0]}
              name="Weekly Cost"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {chartData.map((data, index) => (
          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 italic text-sm mb-1">{data.name}</p>
            <p className="text-white italic text-2xl font-bold" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
              ${data.weeklyCost.toFixed(2)}/week
            </p>
            <p className="text-gray-500 italic text-xs mt-1">
              {data.mpg} MPG • ${(data.weeklyCost * 52).toFixed(2)}/year
            </p>
          </div>
        ))}
      </div>

      {totalSavings > 0 && (
        <div className="mt-4 p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-primary italic text-center">
            💰 You could save <span className="font-bold">${totalSavings.toFixed(2)}/year</span> by choosing the more fuel-efficient option!
          </p>
        </div>
      )}
    </div>
  );
}
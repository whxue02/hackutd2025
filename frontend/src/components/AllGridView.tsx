import { Car } from "../types/car";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";

interface AllGridViewProps {
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onCompare?: () => void;
}

interface ApiCar {
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

export function AllGridView({ selectedIds = [], onToggleSelect, onCompare }: AllGridViewProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<ApiResponse['pagination'] | null>(null);

  useEffect(() => {
    fetchCars(currentPage);
  }, [currentPage]);

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
        year: apiCar.year,
        make: apiCar.make,
        model: apiCar.model,
        trim: apiCar.trim,
        category: apiCar.type,
        image: apiCar.img_path ? `http://127.0.0.1:5000/images/${apiCar.img_path}` : '/placeholder-car.jpg',        financing: {
          msrp: apiCar.msrp,
          invoice: 0,
          estimatedPayment: Math.round((apiCar.msrp * 0.02) * 100) / 100
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
          transmission: ''
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
          return (
            <div key={car.id} className={`relative rounded-xl overflow-hidden border-2 transition-all ${selected ? 'ring-2 ring-primary/70 border-primary/60' : 'bg-gradient-to-br from-gray-900 via-gray-800 to-black hover:border-primary/50 hover:shadow-md hover:shadow-primary/20'}`}>
              <a
                href={`./detail.html?model=${encodeURIComponent(car.model)}`}
                className="block cursor-pointer"
                onClick={() => { /* link navigation only */ }}
              >
                <div className="relative h-40">
                  <img src={car.image} alt={`${car.make} ${car.model}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white border-0 px-3 py-1 shadow-lg shadow-primary/50 italic text-xs">
                      {car.category}
                    </Badge>
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
              </a>

              {/* select button */}
              <button
                onClick={(e) => { e.stopPropagation(); e.preventDefault(); onToggleSelect && onToggleSelect(car.id); }}
                className={`absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center ${selected ? 'bg-primary text-black' : 'bg-white/6 text-white'} shadow-md`}
                title={selected ? 'Deselect' : 'Select for compare'}
              >
                {selected ? '✓' : '+'}
              </button>
            </div>
          );
        })}
      </div>

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
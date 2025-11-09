import { Car } from "../types/car";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

interface AllGridViewProps {
  cars: Car[];
  selectedIds?: string[];
  onToggleSelect?: (id: string) => void;
  onCompare?: () => void;
}

export function AllGridView({ cars, selectedIds = [], onToggleSelect, onCompare }: AllGridViewProps) {
  return (
  <div className="max-w-7xl mx-auto p-6 relative pb-32">
      <h3 className="text-white mb-4 italic" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>
        All Cars
      </h3>
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

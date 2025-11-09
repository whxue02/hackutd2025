import React, { useState, useMemo } from "react";
import { Car } from "./types/car";
import { carData } from "./data/cars";
import { SwipeView } from "./components/SwipeView";
import { CompareView } from "./components/CompareView";
import { AllGridView } from "./components/AllGridView";
import { LandingPage } from "./components/LandingPage";
import { Quiz, QuizAnswers } from "./components/Quiz";
import { Button } from "./components/ui/button";
import { Car as CarIcon } from "lucide-react";

type ViewMode = "swipe" | "compare";

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedCars, setLikedCars] = useState<Car[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [displayMode, setDisplayMode] = useState<"swipe" | "all">("swipe");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  const handleNavigateFromLanding = (mode: "swipe" | "all" | "quiz") => {
    if (mode === "quiz") {
      setShowQuiz(true);
      setShowLanding(false);
    } else {
      setDisplayMode(mode);
      setShowLanding(false);
    }
  };

  const handleQuizComplete = (answers: QuizAnswers) => {
    setQuizAnswers(answers);
    setShowQuiz(false);
    setDisplayMode("swipe");
    // You can use the quiz answers here to filter/recommend cars
    console.log("Quiz answers:", answers);
  };

  const handleQuizBack = () => {
    setShowQuiz(false);
    setShowLanding(true);
  };

  const filteredCars = useMemo(() => {
    if (selectedCategory === "All") {
      return carData;
    }
    return carData.filter((car) => car.category === selectedCategory);
  }, [selectedCategory]);

  const handleLike = (car: Car) => {
    setLikedCars((prev) => [...prev, car]);
  };

  const handleDislike = (car: Car) => {
    // Just move to next car
  };

  const handleFinish = () => {
    setViewMode("compare");
    // Auto-select all liked cars for comparison
    setSelectedForComparison(likedCars.map(car => car.id));
  };

  const handleToggleSelection = (carId: string) => {
    setSelectedForComparison((prev) =>
      prev.includes(carId)
        ? prev.filter((id) => id !== carId)
        : [...prev, carId]
    );
  };

  const handleBackToSwipe = () => {
    setViewMode("swipe");
  };

  if (showLanding) {
    return <LandingPage onNavigate={handleNavigateFromLanding} />;
  }

  if (showQuiz) {
    return <Quiz onComplete={handleQuizComplete} onBack={handleQuizBack} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Animated background grid effect */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(139,21,56,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,21,56,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      
      <header className="relative bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-black/95 backdrop-blur-sm shadow-lg shadow-primary/10 border-b border-primary/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-3 rounded-xl shadow-lg shadow-primary/40 border border-primary/50">
                <CarIcon className="w-7 h-7 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
              </div>
              <div>
                <h1 className="text-white italic tracking-wide" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>CAR MATCH</h1>
                <p className="text-gray-400 italic">Find your perfect ride</p>
              </div>
            </div>
            
            {viewMode === "swipe" && likedCars.length > 0 && (
              <Button 
                onClick={handleFinish} 
                className="px-6 bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 border border-primary/50 italic"
              >
                View Liked Cars ({likedCars.length})
              </Button>
            )}
          </div>

          {/* View toggle: Swipe or All (grid) */}
          <div className="flex items-center gap-3 justify-center">
            <button
              className={`px-5 py-2.5 italic rounded-md ${displayMode === 'swipe' ? 'bg-gradient-to-r from-primary to-primary/80 text-white' : 'bg-transparent text-gray-300 border border-gray-700'}`}
              onClick={() => setDisplayMode('swipe')}
            >
              Swipe
            </button>
            <button
              className={`px-5 py-2.5 italic rounded-md ${displayMode === 'all' ? 'bg-gradient-to-r from-primary to-primary/80 text-white' : 'bg-transparent text-gray-300 border border-gray-700'}`}
              onClick={() => setDisplayMode('all')}
            >
              All
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-6 h-[calc(100vh-140px)]">
        {viewMode === 'compare' ? (
          <CompareView
            likedCars={likedCars}
            selectedCars={selectedForComparison}
            onToggleSelection={handleToggleSelection}
            onBack={handleBackToSwipe}
            allCars={carData}
          />
        ) : displayMode === 'swipe' ? (
          <SwipeView
            cars={carData}
            onLike={handleLike}
            onDislike={handleDislike}
            onFinish={handleFinish}
            quizAnswers={quizAnswers}
          />
        ) : (
          <AllGridView
            cars={carData}
            selectedIds={selectedForComparison}
            onToggleSelect={handleToggleSelection}
            onCompare={() => setViewMode('compare')}
          />
        )}
      </main>
    </div>
  );
}
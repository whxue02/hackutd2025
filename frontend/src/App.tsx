import React, { useState, useMemo } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Car } from "./types/car";
import { carData } from "./data/cars";
import { SwipeView } from "./components/SwipeView";
import { CompareView } from "./components/CompareView";
import { AllGridView } from "./components/AllGridView";
import { LandingPage } from "./components/LandingPage";
import { Quiz, QuizAnswers } from "./components/Quiz";
import { CarDetail } from "./components/CarDetail";
import { Button } from "./components/ui/button";
import Logo from "./components/Logo1.svg";
//import { Car as CarIcon } from "lucide-react";

type ViewMode = "swipe" | "compare";

function MainApp() {
  const navigate = useNavigate();
  const [showLanding, setShowLanding] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedCars, setLikedCars] = useState<Car[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("swipe");
  const [displayMode, setDisplayMode] = useState<"swipe" | "all">("swipe");
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [selectedCarsForComparison, setSelectedCarsForComparison] = useState<Car[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  // ===== Added: states for chat/trade button activations =====
  const [chatRequested, setChatRequested] = useState(false);
  const [tradeInRequested, setTradeInRequested] = useState(false);

  // ===== Added: handlers for the two floating buttons (no modal implementation) =====
  const handleOpenChatbot = () => {
    console.log("Chatbot button clicked");
    setChatRequested(true);
    // Placeholder: open chatbot modal here
  };

  const handleOpenTradeIn = () => {
    console.log("Trade-in button clicked");
    setTradeInRequested(true);
    // Placeholder: open trade-in modal here
  };

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

  const handleToggleSelection = (carId: string, car?: Car) => {
    setSelectedForComparison((prev) => {
      const isSelected = prev.includes(carId);
      if (isSelected) {
        // Deselect
        setSelectedCarsForComparison((cars) => cars.filter(c => c.id !== carId));
        return prev.filter((id) => id !== carId);
      } else {
        // Select
        if (car) {
          setSelectedCarsForComparison((cars) => {
            // Avoid duplicates
            if (cars.find(c => c.id === car.id)) {
              return cars;
            }
            return [...cars, car];
          });
        }
        return [...prev, carId];
      }
    });
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
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer w-[52px] h-[52px] flex items-center justify-center hover:opacity-90 transition"
        >
          <img
            src={Logo}
            alt="AutoMatch Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div>
          <h1 className="text-white italic tracking-wide" style={{ fontFamily: 'Saira, sans-serif', fontStyle: 'italic' }}>AutoMatch</h1>
          <p className="text-gray-400 italic">Find YOUR Ride-or-Die</p>
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

    {/* View toggle */}
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
            onToggleSelection={(id: string, car?: Car) => handleToggleSelection(id, car)}
            onBack={handleBackToSwipe}
            allCars={[...carData, ...selectedCarsForComparison]}
            quizAnswers={quizAnswers}
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
            selectedIds={selectedForComparison}
            onToggleSelect={(id, car) => handleToggleSelection(id, car)}
            onCompare={() => setViewMode('compare')}
            quizAnswers={quizAnswers}
          />
        )}
      </main>

      {/* ===== Updated: Bottom-right vertical rounded rectangle with larger buttons & icons ===== */}
      <div
        // Fixed to viewport bottom-right; use safe-area inset for mobile devices
        className="fixed z-50 rounded-3xl border border-primary/30 shadow-xl"
        style={{
          right: '1.5rem',
          bottom: '1.5rem',
          backgroundColor: 'rgb(139,21,56)',
          padding: 'calc(var(--spacing) * 1.5)',
        }}
        role="group"
        aria-label="Support and Trade-in"
      >
        <div className="flex flex-col items-center gap-0" style={{ padding: 'calc(var(--spacing) * 1.5)' }}>
          {/* Top: Trade-in (larger two arrows in a circle) */}
          <button
            onClick={handleOpenTradeIn}
            aria-label="Open trade-in"
            title="Trade-in"
            className="w-14 h-14 rounded-xl flex items-center justify-center bg-transparent hover:bg-white/6 transition text-white"
          >
            {/* trade-in icon: two arrows in a circle */}
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
              <path d="M7 7h10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 4l-3 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 10l-3-3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 17H7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 20l3-3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 14l3 3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* one-line spacer between icons */}
          <div aria-hidden style={{ height: '1em' }} />

          {/* Bottom: Chatbot (larger chat bubble) */}
          <button
            onClick={handleOpenChatbot}
            aria-label="Open chatbot"
            title="Chat"
            className="w-14 h-14 rounded-xl flex items-center justify-center bg-transparent hover:bg-white/6 transition text-white"
          >
            {/* chat bubble icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/car/:hackId" element={<CarDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
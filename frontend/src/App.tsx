import React, { useState, useMemo } from "react";
import { ChatbotPopup } from "./components/Chatbot";
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

  const [isChatOpen, setIsChatOpen] = useState(false);

  // ===== Added: states for chat/trade button activations =====
  const [chatRequested, setChatRequested] = useState(false);
  const [tradeInRequested, setTradeInRequested] = useState(false);

  // ===== Added: modal state & inputs for trade-in =====
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeYear, setTradeYear] = useState("");
  const [tradeMake, setTradeMake] = useState("");
  const [tradeModel, setTradeModel] = useState("");
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeResult, setTradeResult] = useState<any>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);

  // ===== New: optional location inputs shown when quiz/location missing =====
  const [needLocationInputs, setNeedLocationInputs] = useState(false);
  const [tradeCityInput, setTradeCityInput] = useState("");
  const [tradeStateInput, setTradeStateInput] = useState("");

  // ===== Updated: handlers for the two floating buttons (modal implementation) =====
  const handleOpenChatbot = () => {
    setIsChatOpen(true);
  };

  const handleOpenTradeIn = () => {
    console.log("Trade-in button clicked (open modal)");
    setTradeInRequested(true);
    // reset modal state
    setTradeYear("");
    setTradeMake("");
    setTradeModel("");
    setTradeResult(null);
    setTradeError(null);
    // reset location inputs/flag
    setTradeCityInput("");
    setTradeStateInput("");
    setNeedLocationInputs(false);
    setShowTradeModal(true);
  };

  // New: submit handler for the trade modal (replaces prompt flow)
  const handleSubmitTrade = async () => {
    setTradeError(null);
    setTradeResult(null);

    if (!tradeYear.trim() || !tradeMake.trim() || !tradeModel.trim()) {
      setTradeError("Please fill year, make and model.");
      return;
    }

    // Use quizAnswers for city/state if available; otherwise fall back to modal inputs when enabled
    const qa: any = quizAnswers;
    let city = qa?.city || qa?.cityName || qa?.location?.city;
    let stateAc = qa?.['state-ac'] || qa?.state || qa?.stateAc || qa?.stateAbbr;

    // If quiz is missing location, enable inline inputs and require them
    if (!city || !stateAc) {
      setNeedLocationInputs(true);
      setTradeError("");
      // If user already provided inline inputs, use them
      if (tradeCityInput.trim()) city = tradeCityInput.trim();
      if (tradeStateInput.trim()) stateAc = tradeStateInput.trim();
      // If still missing after checking inputs, stop here and show inputs to user
      if (!city || !stateAc) {
        return;
      }
    }

    const payload = {
      year: tradeYear.trim(),
      make: tradeMake.trim(),
      model: tradeModel.trim(),
      city: String(city).toLowerCase(),
      ['state-ac']: String(stateAc).toLowerCase(),
    };

    setTradeLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:5001/trade-in-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Trade-in API error:", res.status, text);
        setTradeError(`Trade-in service returned ${res.status}`);
        setTradeLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Trade-in response:", data);

      const extractResult = (d: any) => {
        if (d == null) return "No result";
        if (typeof d === "string" || typeof d === "number" || typeof d === "boolean") return d;
        if (typeof d === "object") {
          const keysToCheck = ["trade-in-value", "tradeInValue", "trade_in_value", "value", "tradeIn", "amount"];
          for (const k of keysToCheck) {
            if (k in d) return d[k];
          }
          const objKeys = Object.keys(d);
          if (objKeys.length === 1) return d[objKeys[0]];
          for (const wrapper of ["result", "data", "payload"]) {
            if (wrapper in d) {
              const inner = d[wrapper];
              if (inner == null) return inner;
              if (typeof inner === "object") {
                const innerKeys = Object.keys(inner);
                if (innerKeys.length === 1) return inner[innerKeys[0]];
              } else return inner;
            }
          }
          return JSON.stringify(d, null, 2);
        }
        return String(d);
      };

      const resultValue = extractResult(data);
      setTradeResult(resultValue);
      setTradeLoading(false);
      // close location inputs after success
      setNeedLocationInputs(false);
    } catch (err) {
      console.error("Trade-in request failed:", err);
      setTradeError("Failed to contact trade-in service.");
      setTradeLoading(false);
    }
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

  // Helper: format trade result as USD if numeric, otherwise return null + raw string
  const formatTradeValue = (val: any): { isCurrency: boolean; formatted: string } => {
    if (val == null) return { isCurrency: false, formatted: "" };
    // If it's already a number
    if (typeof val === "number" && Number.isFinite(val)) {
      return { isCurrency: true, formatted: val.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) };
    }
    // If it's a string that contains a number (e.g., "12345" or "$12,345" or "12345.67")
    if (typeof val === "string") {
      // find first numeric-like substring
      const match = val.match(/-?\d[\d,\.]*/);
      if (match) {
        const num = Number(match[0].replace(/,/g, ""));
        if (!Number.isNaN(num) && Number.isFinite(num)) {
          return { isCurrency: true, formatted: num.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }) };
        }
      }
    }
    // If it's an object that may contain a numeric field we already tried extracting earlier; fallback to stringified
    if (typeof val === "object") {
      try {
        const s = JSON.stringify(val);
        return { isCurrency: false, formatted: s };
      } catch {
        return { isCurrency: false, formatted: String(val) };
      }
    }
    // last resort
    return { isCurrency: false, formatted: String(val) };
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

          {/* Chatbot Popup Component */}
          <ChatbotPopup isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
        </div>
      </div>

      {/* ===== New: Trade-in Modal + overlay ===== */}
      {showTradeModal && (
        <>
          {/* overlay that blurs background */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowTradeModal(false)}
            aria-hidden
          />

          {/* centered modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Constrain modal width so it doesn't span full viewport.
                - mx-4 gives a small side margin on very small screens.
                - max-w-[640px] keeps modal reasonably narrow on large screens.
                - w-full removed so it won't stretch; instead use min-w-0 to allow proper shrinking.
            */}
            <div
              className="mx-4 min-w-0 max-w-[640px] bg-white/95 dark:bg-gray-900/95 rounded-2xl shadow-2xl p-6 relative"
              role="dialog"
              aria-modal="true"
            >
               {/* close X */}
               <button
                 onClick={() => setShowTradeModal(false)}
                 aria-label="Close trade modal"
                 className="absolute right-3 top-3 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
               >
                 <span className="text-xl font-semibold">✕</span>
               </button>

               <h3 className="text-lg font-semibold mb-3 text-white-900 dark:text-white-100">Get Trade-in Value</h3>
               <p className="text-sm text-white-600 dark:text-white-300 mb-4">Enter your car details to estimate trade-in value.</p>

               <div className="space-y-4">
                 <input
                   value={tradeYear}
                   onChange={(e) => setTradeYear(e.target.value)}
                   placeholder="Year (e.g., 2023)"
                   className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 />
                 <input
                   value={tradeMake}
                   onChange={(e) => setTradeMake(e.target.value)}
                   placeholder="Make (e.g., Toyota)"
                   className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 />
                 <input
                   value={tradeModel}
                   onChange={(e) => setTradeModel(e.target.value)}
                   placeholder="Model (e.g., Corolla)"
                   className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                 />

                 {/* New: city/state inline inputs when quiz/location is missing */}
                 {needLocationInputs && (
                   <>
                     <input
                       value={tradeCityInput}
                       onChange={(e) => setTradeCityInput(e.target.value)}
                       placeholder="City (e.g., Austin)"
                       className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                     <input
                       value={tradeStateInput}
                       onChange={(e) => setTradeStateInput(e.target.value)}
                       placeholder="State (abbrev., e.g., TX)"
                       className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                     />
                     <p className="text-xs text-gray-500">Quiz location was not available — please provide city and state.</p>
                   </>
                 )}
               </div>

               {/* feedback area */}
               <div className="mt-4">
                 {tradeError && <div className="text-sm text-red-600 mb-2">{tradeError}</div>}
                 {tradeResult != null && (() => {
                   const formatted = formatTradeValue(tradeResult);
                   if (formatted.isCurrency) {
                     return (
                       <div className="bg-green-50 p-4 rounded-md mb-2 text-left">
                         <div className="text-sm text-white-700">Estimated Trade‑In Value</div>
                         <div className="mt-2 text-4xl md:text-10xl font-extrabold text-white-800">
                           {formatted.formatted}
                         </div>
                       </div>
                     );
                   }
                   // fallback for non-numeric results
                   return (
                     <div className="text-sm text-green-700 bg-green-50 p-5 rounded-md mb-2 text-left">
                       <strong>Result:</strong>
                       <div className="whitespace-pre-wrap">{formatted.formatted}</div>
                     </div>
                   );
                 })()}
               </div>

               {/* add extra top margin so buttons sit further below inputs/feedback */}
               <div className="mt-6 flex items-center gap-3">
                 <button
                   onClick={handleSubmitTrade}
                   disabled={tradeLoading}
                   className="flex-1 inline-flex justify-center items-center bg-primary text-white px-4 py-2 rounded-lg hover:opacity-95 disabled:opacity-50"
                 >
                   {tradeLoading ? "Getting value..." : "Get Value"}
                 </button>
                 <button
                   onClick={() => setShowTradeModal(false)}
                   className="px-4 py-2 rounded-lg border border-white-200 bg-transparent text-white-700"
                 >
                   Close
                 </button>
               </div>
             </div>
           </div>
         </>
       )}

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
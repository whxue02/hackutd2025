import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Grid3x3 } from "lucide-react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import Background from "./landing.png"; // new import


interface LandingPageProps {
  onNavigate: (mode: "swipe" | "all" | "quiz") => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0">
      {/* Urban Background Image with Dark Overlay */}
      <div
        // changed: use absolute (not fixed) and make image contained & not repeated
        className="absolute inset-0 bg-center bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content - Absolutely centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-7xl mx-auto text-center text-black">

          {/* Supporting Subhead */}
          <motion.p
            initial={{ y: 350, opacity: 0 }}
            animate={{ y: 250, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-black mb-12 max-w-5xl mx-auto italic"
            style={{ color: "#000" }}
          >
            Personalized recommendations based on your lifestyle, budget, and preferences.
          </motion.p>

          {/* Two Pill CTAs */}
          <motion.div
            initial={{ y: 370, opacity: 0 }}
            animate={{ y: 270, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => navigate("/quiz")}
              size="lg"
              className="px-10 py-6 text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 border border-primary/50 group rounded-full text-white"
              style={{ backgroundColor: "#e4000d", cursor: "pointer" }}
            >
              Start Interactive Quiz
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={() => navigate("/")}
              size="lg"
              className="px-10 py-6 text-lg !bg-white hover:!bg-black/20 shadow-lg group rounded-full border-2 border-gray-200 !text-black"
              style={{ backgroundColor: "#ffffff", color: "#000000", borderColor: "#eeeeee", cursor: "pointer" }}
            >
              <Grid3x3 className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
              Explore Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

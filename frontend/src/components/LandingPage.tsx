import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Grid3x3 } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onNavigate: (mode: "swipe" | "all" | "quiz") => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden m-0 p-0">
      {/* Urban Background Image with Dark Overlay */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80"
          alt="Urban cityscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Content - Absolutely centered */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6">
        <div className="w-full max-w-7xl mx-auto text-center">
          {/* Massive Headline */}
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="font-bold text-white mb-8 leading-[0.9] italic"
            style={{ 
              fontFamily: "Saira, sans-serif", 
              fontStyle: "italic",
              fontSize: "clamp(3rem, 8vw, 10rem)"
            }}
          >
            Find your perfect <span className="text-primary">Toyota</span>
          </motion.h1>

          {/* Supporting Subhead */}
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white mb-12 max-w-5xl mx-auto italic"
          >
            Personalized recommendations based on your lifestyle, budget, and preferences.
          </motion.p>

          {/* Two Pill CTAs */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => onNavigate("quiz")}
              size="lg"
              className="px-10 py-6 text-lg bg-gradient-to-r from-primary via-primary/90 to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 border border-primary/50 italic group rounded-full text-white"
            >
              Start Interactive Quiz
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>

            <Button
              onClick={() => onNavigate("all")}
              size="lg"
              className="px-10 py-6 text-lg bg-transparent hover:bg-black/20 shadow-lg italic group rounded-full border-2 border-white text-white"
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

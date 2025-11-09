import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { Car } from "../types/car";
import { CarCard } from "./CarCard";
import { Heart, X } from "lucide-react";
import { Button } from "./ui/button";

import { QuizAnswers } from "./Quiz";

interface SwipeViewProps {
  cars: Car[];
  onLike: (car: Car) => void;
  onDislike: (car: Car) => void;
  onFinish: () => void;
  quizAnswers?: QuizAnswers | null;
}

export function SwipeView({ cars, onLike, onDislike, onFinish, quizAnswers }: SwipeViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCar = cars[currentIndex];

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      onLike(currentCar);
    } else {
      onDislike(currentCar);
    }

    if (currentIndex === cars.length - 1) {
      setTimeout(onFinish, 300);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (!currentCar) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-8">
        <div className="text-center">
          <h2 className="text-white mb-3 italic" style={{ fontFamily: 'Orbitron, sans-serif' }}>No more cars to show!</h2>
          <p className="text-gray-400 italic">Check out your liked cars below</p>
        </div>
        <Button onClick={onFinish} size="lg" className="px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30 border border-primary/50 italic">
          View Liked Cars
        </Button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col py-4">
      <div className="flex-1 relative max-w-xl mx-auto w-full px-4 flex items-center justify-center min-h-0">
        <div className="relative w-full h-full max-h-[700px]" style={{ aspectRatio: '3/4' }}>
          {currentIndex < cars.length && (
            <SwipeCard
              car={currentCar}
              onSwipe={handleSwipe}
              quizAnswers={quizAnswers}
              key={currentCar.id}
            />
          )}
        </div>
      </div>

      <div className="text-center py-4 flex-shrink-0">
        <p className="text-gray-400 italic" style={{ fontFamily: 'Orbitron, sans-serif' }}>
          {currentIndex + 1} of {cars.length}
        </p>
      </div>
    </div>
  );
}

interface SwipeCardProps {
  car: Car;
  onSwipe: (direction: "left" | "right") => void;
  quizAnswers?: QuizAnswers | null;
}

function SwipeCard({ car, onSwipe, quizAnswers }: SwipeCardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Opacity for like/dislike indicators - only show when swiping in that direction
  const likeOpacity = useTransform(x, [-50, 0, 50, 150], [0, 0, 0.5, 1]);
  const dislikeOpacity = useTransform(x, [-150, -50, 0, 50], [1, 0.5, 0, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <CarCard car={car} quizAnswers={quizAnswers} />
      
      {/* Like indicator - only shows when swiping right */}
      <motion.div
        className="absolute top-12 right-12 pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <div className="bg-primary border-4 border-white rounded-2xl px-8 py-4 rotate-12 shadow-2xl">
          <Heart className="w-16 h-16 text-white fill-white" />
        </div>
      </motion.div>
      
      {/* Dislike indicator - only shows when swiping left */}
      <motion.div
        className="absolute top-12 left-12 pointer-events-none"
        style={{ opacity: dislikeOpacity }}
      >
        <div className="bg-gray-700 border-4 border-white rounded-2xl px-8 py-4 -rotate-12 shadow-2xl">
          <X className="w-16 h-16 text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
}
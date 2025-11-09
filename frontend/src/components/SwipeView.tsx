import { useState } from "react";
import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import { Car } from "../types/car";
import { CarCard } from "./CarCard";
import { Heart, X } from "lucide-react";
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
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: '32px',
        background: '#fdfdfd00',
        fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '32px', 
            fontWeight: '800', 
            color: '#1a1a1a' 
          }}>
            No more cars to show!
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>
            Check out your liked cars below
          </p>
        </div>
        <button 
          onClick={onFinish}
          style={{
            background: '#fdfdfd',
            border: '1px solid rgba(0,0,0,0.06)',
            padding: '14px 32px',
            borderRadius: '24px',
            color: '#1a1a1a',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '600',
            boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.2s ease'
          }}
        >
          View Liked Cars
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'relative',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 0',
      background: '#fdfdfd00',
      fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial'
    }}>
      <div style={{
        flex: 1,
        position: 'relative',
        maxWidth: '600px',
        margin: '0 auto',
        width: '100%',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 0
      }}>
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          maxHeight: '700px',
          aspectRatio: '3/4'
        }}>
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

      <div style={{
        textAlign: 'center',
        padding: '16px 0',
        flexShrink: 0
      }}>
        <p style={{
          margin: 0,
          color: '#666',
          fontSize: '14px',
          fontWeight: '500'
        }}>
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
  
  const likeOpacity = useTransform(x, [-50, 0, 50, 150], [0, 0, 0.5, 1]);
  const dislikeOpacity = useTransform(x, [-150, -50, 0, 50], [1, 0.5, 0, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? "right" : "left");
    }
  };

  return (
    <>
    <motion.div
      style={{ 
        position: 'absolute',
        inset: 0,
        x, 
        rotate, 
        opacity 
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: "grabbing" }}
    >
      <CarCard car={car} quizAnswers={quizAnswers} />
      
      <motion.div
        style={{ 
          position: 'absolute',
          top: '48px',
          right: '48px',
          pointerEvents: 'none',
          opacity: likeOpacity 
        }}
      >
        <div style={{
          background: '#8b1538',
          border: '3px solid white',
          borderRadius: '20px',
          padding: '16px 24px',
          transform: 'rotate(12deg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <Heart style={{ 
            width: '48px', 
            height: '48px', 
            color: 'white',
            fill: 'white'
          }} />
        </div>
      </motion.div>
      
      <motion.div
        style={{ 
          position: 'absolute',
          top: '48px',
          left: '48px',
          pointerEvents: 'none',
          opacity: dislikeOpacity 
        }}
      >
        <div style={{
          background: '#6b7280',
          border: '3px solid white',
          borderRadius: '20px',
          padding: '16px 24px',
          transform: 'rotate(-12deg)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
        }}>
          <X style={{ 
            width: '48px', 
            height: '48px', 
            color: 'white'
          }} />
        </div>
      </motion.div>
    </motion.div>
    </>
  );
}
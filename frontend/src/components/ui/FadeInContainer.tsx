import React, { useState, useEffect } from "react";

interface FadeInContainerProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export default function FadeInContainer({
  children,
  delay = 0,
  duration = 600,
  className = "",
  staggerDelay = 100,
  direction = "up",
}: FadeInContainerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransformClass = () => {
    switch (direction) {
      case "up":
        return "translate-y-4";
      case "down":
        return "-translate-y-4";
      case "left":
        return "translate-x-4";
      case "right":
        return "-translate-x-4";
      default:
        return "translate-y-4";
    }
  };

  return (
    <div
      className={`
        transition-all ease-out
        ${
          isVisible
            ? "opacity-100 transform translate-y-0 translate-x-0"
            : `opacity-0 transform ${getTransformClass()}`
        }
        ${className}
      `}
      style={{
        transitionDelay: `${staggerDelay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

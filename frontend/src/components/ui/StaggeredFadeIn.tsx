import React from "react";
import FadeInContainer from "./FadeInContainer";

interface StaggeredFadeInProps {
  children: React.ReactNode;
  staggerDelay?: number;
  baseDelay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export default function StaggeredFadeIn({
  children,
  staggerDelay = 150,
  baseDelay = 200,
  duration = 600,
  direction = "up",
  className = "",
}: StaggeredFadeInProps) {
  // Convert children to array if it's not already
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <FadeInContainer
          key={index}
          delay={baseDelay + index * staggerDelay}
          duration={duration}
          direction={direction}
        >
          {child}
        </FadeInContainer>
      ))}
    </div>
  );
}

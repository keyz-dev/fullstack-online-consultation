import React from "react";
import StatCard from "./StatCard";
import StaggeredFadeIn from "./StaggeredFadeIn";

interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: number;
  colorTheme?: string;
}

interface StatRendererProps {
  statCards: StatCard[];
  className?: string;
  isLoading?: boolean;
}

const StatRenderer: React.FC<StatRendererProps> = ({
  statCards,
  className,
  isLoading = false,
}) => {
  return (
    <StaggeredFadeIn
      staggerDelay={120}
      baseDelay={300}
      duration={700}
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4`}
    >
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          {...card}
          className={className}
          isLoading={isLoading}
        />
      ))}
    </StaggeredFadeIn>
  );
};

export default StatRenderer;

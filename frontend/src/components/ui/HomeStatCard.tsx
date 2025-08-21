import React from "react";

interface HomeStatCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export default function HomeStatCard({
  value,
  label,
  className = "",
}: HomeStatCardProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
        {typeof value === "number" ? value.toLocaleString() : value}
      </div>
      <div className="text-sm md:text-base text-secondary font-medium">
        {label}
      </div>
    </div>
  );
}

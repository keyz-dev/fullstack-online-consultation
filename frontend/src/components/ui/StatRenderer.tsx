import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardData {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: number;
  colorTheme?: string;
  className?: string;
}

interface StatRendererProps {
  statCards: StatCardData[];
  className?: string;
  isLoading?: boolean;
}

export default function StatRenderer({
  statCards,
  className,
  isLoading = false,
}: StatRendererProps) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mb-4`}
    >
      {statCards.map((card, index) => (
        <div
          key={index}
          className="animate-fade-in"
          style={{
            animationDelay: `${300 + index * 120}ms`,
            animationDuration: "700ms",
            animationFillMode: "both",
          }}
        >
          <div
            className={`bg-white rounded-sm p-3 border border-gray-200 hover:shadow-xs transition-shadow duration-200 mb-3 flex flex-col ${
              className || ""
            }`}
          >
            {/* Header with Icon */}
            <div className="flex items-center gap-4 mb-3 sm:mb-4">
              <div className="bg-gray-100 p-2 sm:p-3 rounded-xl flex-shrink-0">
                <card.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </div>

              {/* Title */}
              <h3 className="text-sm sm:text-lg font-medium text-primary mb-1 sm:mb-2 leading-tight">
                {card.title}
              </h3>
            </div>

            {/* Value */}
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-2 sm:mb-3">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
              ) : typeof card.value === "number" ? (
                card.value.toLocaleString()
              ) : (
                card.value
              )}
            </div>

            {/* Bottom section with consistent height */}
            <div className="flex items-center gap-2 min-h-[24px] sm:min-h-[28px] mt-auto">
              {card.trendValue && (
                <div
                  className={`border px-2 py-1 rounded-sm flex items-center gap-1 flex-shrink-0 ${
                    card.trend === "up"
                      ? "bg-green-100 border-green-500"
                      : "bg-red-100 border-red-500"
                  }`}
                >
                  <span
                    className={`w-3 h-3 sm:w-4 sm:h-4 ${
                      card.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {card.trend === "up" ? "↗" : "↘"}
                  </span>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      card.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {card.trendValue}%
                  </span>
                </div>
              )}
              {/* Description */}
              {card.description && (
                <p
                  className="text-xs sm:text-sm text-placeholder leading-relaxed w-fit truncate"
                  style={{ maxWidth: "150px" }}
                >
                  {card.description}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

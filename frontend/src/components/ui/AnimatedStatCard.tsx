import React from "react";
import CountUp from "react-countup";
import { LucideIcon } from "lucide-react";

interface AnimatedStatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down";
  trendValue?: number;
  colorTheme?: string;
  className?: string;
  isLoading?: boolean;
  duration?: number;
}

export default function AnimatedStatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  colorTheme = "white",
  className = "w-[180px] lg:w-[250px]",
  isLoading = false,
  duration = 2,
  ...props
}: AnimatedStatCardProps) {
  const isNumeric =
    typeof value === "number" || !isNaN(parseFloat(String(value)));

  const renderValue = () => {
    if (isLoading) {
      return <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>;
    }

    if (isNumeric && typeof value === "number") {
      return (
        <CountUp
          end={value}
          duration={duration}
          separator=","
          decimals={0}
          className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary"
        />
      );
    }

    return (
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">
        {value}
      </div>
    );
  };

  // Since we're not importing StatCard directly, let's create a simplified version
  const theme = {
    white: {
      background: "bg-white",
      border: "border-gray-200",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    blue: {
      background: "bg-blue-50",
      border: "border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    green: {
      background: "bg-green-50",
      border: "border-green-200",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  };

  const selectedTheme = theme[colorTheme as keyof typeof theme] || theme.white;
  const TrendIcon = trend === "up" ? "↗" : "↘";
  const trendColor = trend === "up" ? "text-green-500" : "text-red-500";
  const trendBgColor = trend === "up" ? "bg-green-100" : "bg-red-100";
  const trendBorderColor =
    trend === "up" ? "border-green-500" : "border-red-500";

  return (
    <div
      className={`${selectedTheme.background} rounded-sm p-3 border ${selectedTheme.border} hover:shadow-xs transition-shadow duration-200 mb-3 ${className} flex flex-col`}
      {...props}
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-4 mb-3 sm:mb-4">
        <div
          className={`${selectedTheme.iconBg} p-2 sm:p-3 rounded-xl flex-shrink-0`}
        >
          <icon
            className={`w-5 h-5 sm:w-6 sm:h-6 ${selectedTheme.iconColor}`}
          />
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-lg font-medium text-primary mb-1 sm:mb-2 leading-tight">
          {title}
        </h3>
      </div>

      {/* Value */}
      <div className="mb-2 sm:mb-3">{renderValue()}</div>

      {/* Bottom section with consistent height */}
      <div className="flex items-center gap-2 min-h-[24px] sm:min-h-[28px] mt-auto">
        {trendValue && (
          <div
            className={`border ${trendBgColor} ${trendBorderColor} px-2 py-1 rounded-sm flex items-center gap-1 flex-shrink-0`}
          >
            <span className={`w-3 h-3 sm:w-4 sm:h-4 ${trendColor}`}>
              {TrendIcon}
            </span>
            <span className={`text-xs sm:text-sm font-medium ${trendColor}`}>
              {trendValue}%
            </span>
          </div>
        )}
        {/* Description */}
        {description && (
          <p
            className="text-xs sm:text-sm text-placeholder leading-relaxed w-fit truncate"
            style={{ maxWidth: "150px" }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";
import { colorThemes } from "@/constants/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: "up" | "down";
  trendValue?: number;
  colorTheme?: keyof typeof colorThemes;
  className?: string;
  isLoading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  colorTheme = "white",
  className = "w-[180px] lg:w-[250px]",
  isLoading = false,
  ...props
}) => {
  const theme = colorThemes[colorTheme];
  const TrendIcon = trend === "up" ? ArrowUp : ArrowDown;
  const trendColor =
    trend === "up"
      ? "text-green-500 dark:text-green-400"
      : "text-red-500 dark:text-red-400";
  const trendBgColor =
    trend === "up"
      ? "bg-green-100 dark:bg-green-900/20"
      : "bg-red-100 dark:bg-red-900/20";
  const trendBorderColor =
    trend === "up"
      ? "border-green-500 dark:border-green-400"
      : "border-red-500 dark:border-red-400";

  return (
    <div
      className={`${theme.background} rounded-sm p-3 border ${theme.border} hover:shadow-xs transition-shadow duration-200 mb-3 ${className} flex flex-col`}
      {...props}
    >
      {/* Header with Icon */}
      <div className="flex items-center gap-4 mb-3 sm:mb-4">
        <div className={`${theme.iconBg} p-2 sm:p-3 rounded-xl flex-shrink-0`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${theme.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="text-sm sm:text-lg font-medium text-primary dark:text-white mb-1 sm:mb-2 leading-tight">
          {title}
        </h3>
      </div>

      {/* Value */}
      <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary dark:text-white mb-2 sm:mb-3">
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-600 h-8 w-16 rounded"></div>
        ) : typeof value === "number" ? (
          value.toLocaleString()
        ) : (
          value
        )}
      </div>

      {/* Bottom section with consistent height */}
      <div className="flex items-center gap-2 min-h-[24px] sm:min-h-[28px] mt-auto">
        {trendValue && (
          <div
            className={`border ${trendBgColor} ${trendBorderColor} px-2 py-1 rounded-sm flex items-center gap-1 flex-shrink-0`}
          >
            <TrendIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${trendColor}`} />
            <span className={`text-xs sm:text-sm font-medium ${trendColor}`}>
              {trendValue}%
            </span>
          </div>
        )}
        {/* Description */}
        {description && (
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed w-fit truncate max-w-[150px] lg:max-w-[180px]">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;

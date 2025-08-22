import React from "react";
import { Construction, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { colorThemes, ColorTheme } from "../../constants/theme";
import { cn } from "@/lib/utils";

interface UpcomingProps {
  title?: string;
  description?: string;
  expectedDate?: string | null;
  features?: string[];
  colorTheme?: keyof typeof colorThemes;
  className?: string;
  showProgress?: boolean;
  progressPercentage?: number;
  onGoBack?: () => void;
  onGoHome?: () => void;
  additionalInfo?: string;
}

const Upcoming: React.FC<UpcomingProps> = ({
  title = "Coming Soon",
  description = "This feature is currently under development and will be available soon.",
  expectedDate = null,
  features = [],
  colorTheme = "blue",
  className = "",
  showProgress = true,
  progressPercentage = 65,
  onGoBack,
  onGoHome,
  additionalInfo = "Stay tuned for updates! Follow us on social media for the latest news.",
  ...props
}) => {
  const theme: ColorTheme = colorThemes[colorTheme] || colorThemes.blue;

  const defaultFeatures = [
    "Enhanced user experience",
    "Advanced functionality",
    "Improved performance",
    "Better accessibility",
  ];

  const displayFeatures = features.length > 0 ? features : defaultFeatures;

  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    } else {
      window.history.back();
    }
  };

  const handleGoHome = () => {
    if (onGoHome) {
      onGoHome();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div
      className={cn(
        "min-h-[60vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900",
        className
      )}
      {...props}
    >
      <div className="max-w-2xl mx-auto text-center">
        {/* Main Icon */}
        <div
          className={cn(
            "w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6",
            theme.iconBg,
            "dark:bg-opacity-20"
          )}
        >
          <Construction className={cn("w-10 h-10", theme.iconColor)} />
        </div>

        {/* Title */}
        <h1
          className={cn(
            "text-3xl lg:text-4xl font-bold mb-4 text-gray-900 dark:text-white",
            theme.iconColor
          )}
        >
          {title}
        </h1>

        {/* Description */}
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto">
          {description}
        </p>

        {/* Expected Date */}
        {expectedDate && (
          <div className="flex items-center justify-center gap-2 mb-8">
            <Calendar className={cn("w-5 h-5", theme.iconColor)} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Expected: {expectedDate}
            </span>
          </div>
        )}

        {/* Progress Indicator */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className={cn("w-4 h-4", theme.iconColor)} />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Development Progress
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 max-w-md mx-auto">
              <div
                className={cn(
                  "h-2 rounded-full animate-pulse",
                  theme.iconBg,
                  "dark:bg-opacity-60"
                )}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {progressPercentage}% Complete
            </p>
          </div>
        )}

        {/* Features List */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            What to Expect
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
            {displayFeatures.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    theme.iconBg,
                    "dark:bg-opacity-60"
                  )}
                ></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="flex flex-row gap-4 justify-between sm:justify-center items-center">
          <button
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
              theme.iconBg,
              theme.iconColor,
              "hover:opacity-80 dark:bg-opacity-20 dark:hover:bg-opacity-30"
            )}
            onClick={handleGoBack}
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Go Back
          </button>
          <button
            className={cn(
              "px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2",
              "border border-gray-300 dark:border-gray-600",
              "text-gray-700 dark:text-gray-300",
              "hover:bg-gray-50 dark:hover:bg-gray-700",
              "bg-white dark:bg-gray-800"
            )}
            onClick={handleGoHome}
          >
            <ArrowRight className="w-4 h-4" />
            Go Home
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {additionalInfo}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;

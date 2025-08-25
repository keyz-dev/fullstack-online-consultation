import React, { useEffect, useState } from "react";
import { Button } from "../ui";
import { Save } from "lucide-react";

interface PaymentMethodContainerProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isEnabled: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  onSave: () => void;
  canSave?: boolean;
  isSaved?: boolean;
}

const PaymentMethodContainer: React.FC<PaymentMethodContainerProps> = ({
  icon,
  title,
  description,
  isEnabled,
  onToggle,
  children,
  onSave,
  canSave = false,
  isSaved = false,
}) => {
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Show success animation when payment method is saved
  useEffect(() => {
    if (isSaved && !showSuccessAnimation) {
      setShowSuccessAnimation(true);
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setShowSuccessAnimation(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved, showSuccessAnimation]);
  return (
    <div
      className={`border rounded-md overflow-hidden shadow-sm transition-all duration-300 ${
        isSaved
          ? "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
          : "border-gray-200 dark:border-gray-600"
      } ${showSuccessAnimation ? "ring-2 ring-green-400 ring-opacity-50" : ""}`}
    >
      {/* Header */}
      <div
        className={`p-4 flex items-center justify-between relative ${
          isSaved ? "bg-green-50 dark:bg-green-900/5" : ""
        }`}
      >
        {showSuccessAnimation && (
          <div className="absolute inset-0 bg-green-100 dark:bg-green-900/20 flex items-center justify-center rounded-t-md animate-pulse">
            <div className="flex items-center text-green-700 dark:text-green-300 text-sm font-medium">
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Payment method saved successfully!
            </div>
          </div>
        )}
        <div className="flex items-center space-x-4">
          {icon}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {isSaved && (
            <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-medium">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Saved
            </div>
          )}
          <button
            onClick={onToggle}
            className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
              isEnabled ? "bg-yellow-400" : "bg-gray-200 dark:bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-md transform transition-transform duration-300 ${
                isEnabled ? "translate-x-7" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dropdown Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isEnabled ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-6 border-t border-gray-100 dark:border-gray-600">
          <div className="pt-6 space-y-4">
            {children}
            {isEnabled && (
              <div className="flex justify-end pt-2">
                {isSaved ? (
                  <div className="flex items-center text-green-600 dark:text-green-400 text-sm animate-pulse">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Saved
                  </div>
                ) : (
                  <Button
                    onClickHandler={onSave}
                    isDisabled={!canSave}
                    text="Save"
                    additionalClasses={`flex items-center rounded-md min-w-fit min-h-fit px-4 py-2 ${
                      canSave
                        ? "bg-green-600 hover:bg-green-700 text-white shadow-sm"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodContainer;

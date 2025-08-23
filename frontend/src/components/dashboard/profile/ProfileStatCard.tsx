import React from "react";
import { LucideIcon } from "lucide-react";

interface ProfileStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  colorTheme?: "blue" | "green" | "purple" | "orange" | "red" | "yellow" | "indigo";
  description?: string;
}

const ProfileStatCard: React.FC<ProfileStatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorTheme = "blue",
  description,
}) => {
  const getColorClasses = (theme: string) => {
    switch (theme) {
      case "blue":
        return {
          bg: "bg-blue-50 dark:bg-blue-900/20",
          border: "border-blue-200 dark:border-blue-700",
          icon: "text-blue-600 dark:text-blue-400",
          text: "text-blue-900 dark:text-blue-100",
        };
      case "green":
        return {
          bg: "bg-green-50 dark:bg-green-900/20",
          border: "border-green-200 dark:border-green-700",
          icon: "text-green-600 dark:text-green-400",
          text: "text-green-900 dark:text-green-100",
        };
      case "purple":
        return {
          bg: "bg-purple-50 dark:bg-purple-900/20",
          border: "border-purple-200 dark:border-purple-700",
          icon: "text-purple-600 dark:text-purple-400",
          text: "text-purple-900 dark:text-purple-100",
        };
      case "orange":
        return {
          bg: "bg-orange-50 dark:bg-orange-900/20",
          border: "border-orange-200 dark:border-orange-700",
          icon: "text-orange-600 dark:text-orange-400",
          text: "text-orange-900 dark:text-orange-100",
        };
      case "red":
        return {
          bg: "bg-red-50 dark:bg-red-900/20",
          border: "border-red-200 dark:border-red-700",
          icon: "text-red-600 dark:text-red-400",
          text: "text-red-900 dark:text-red-100",
        };
      case "yellow":
        return {
          bg: "bg-yellow-50 dark:bg-yellow-900/20",
          border: "border-yellow-200 dark:border-yellow-700",
          icon: "text-yellow-600 dark:text-yellow-400",
          text: "text-yellow-900 dark:text-yellow-100",
        };
      case "indigo":
        return {
          bg: "bg-indigo-50 dark:bg-indigo-900/20",
          border: "border-indigo-200 dark:border-indigo-700",
          icon: "text-indigo-600 dark:text-indigo-400",
          text: "text-indigo-900 dark:text-indigo-100",
        };
      default:
        return {
          bg: "bg-gray-50 dark:bg-gray-900/20",
          border: "border-gray-200 dark:border-gray-700",
          icon: "text-gray-600 dark:text-gray-400",
          text: "text-gray-900 dark:text-gray-100",
        };
    }
  };

  const colors = getColorClasses(colorTheme);

  return (
    <div className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {description}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-white dark:bg-gray-800 ${colors.icon}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default ProfileStatCard;

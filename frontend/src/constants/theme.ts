export interface ColorTheme {
  background: string;
  iconColor: string;
  iconBg: string;
  border: string;
}

export const colorThemes: Record<string, ColorTheme> = {
  blue: {
    background: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-600 dark:text-blue-400",
    iconBg: "bg-blue-100 dark:bg-blue-800/40",
    border: "border-blue-200 dark:border-blue-700",
  },
  green: {
    background: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-600 dark:text-green-400",
    iconBg: "bg-green-100 dark:bg-green-800/40",
    border: "border-green-200 dark:border-green-700",
  },
  purple: {
    background: "bg-purple-50 dark:bg-purple-900/20",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBg: "bg-purple-100 dark:bg-purple-800/40",
    border: "border-purple-200 dark:border-purple-700",
  },
  red: {
    background: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-600 dark:text-red-400",
    iconBg: "bg-red-100 dark:bg-red-800/40",
    border: "border-red-200 dark:border-red-700",
  },
  orange: {
    background: "bg-orange-50 dark:bg-orange-900/20",
    iconColor: "text-orange-600 dark:text-orange-400",
    iconBg: "bg-orange-100 dark:bg-orange-800/40",
    border: "border-orange-200 dark:border-orange-700",
  },
  indigo: {
    background: "bg-indigo-50 dark:bg-indigo-900/20",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-800/40",
    border: "border-indigo-200 dark:border-indigo-700",
  },
  pink: {
    background: "bg-pink-50 dark:bg-pink-900/20",
    iconColor: "text-pink-600 dark:text-pink-400",
    iconBg: "bg-pink-100 dark:bg-pink-800/40",
    border: "border-pink-200 dark:border-pink-700",
  },
  teal: {
    background: "bg-teal-50 dark:bg-teal-900/20",
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-800/40",
    border: "border-teal-200 dark:border-teal-700",
  },
  yellow: {
    background: "bg-yellow-50 dark:bg-yellow-900/20",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    iconBg: "bg-yellow-100 dark:bg-yellow-800/40",
    border: "border-yellow-200 dark:border-yellow-700",
  },
  white: {
    background: "bg-white dark:bg-gray-800",
    iconColor: "text-gray-600 dark:text-gray-400",
    iconBg: "bg-gray-100 dark:bg-gray-700",
    border: "border-gray-200 dark:border-gray-600",
  },
};

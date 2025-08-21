import React from "react";
import { ChevronDown } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  label: string;
  options?: FilterOption[];
  selected?: string;
  setSelected?: (value: string) => void;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export default function FilterDropdown({
  label,
  options,
  selected,
  setSelected,
  value,
  onChange,
  placeholder,
}: FilterDropdownProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (setSelected) {
      setSelected(newValue);
    }
    if (onChange) {
      onChange(newValue);
    }
  };

  const currentValue = value || selected || "";
  const currentOptions = options || [];
  const currentPlaceholder = placeholder || `All ${label}s`;

  return (
    <div className="relative">
      <select
        value={currentValue}
        onChange={handleChange}
        className="appearance-none w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xs py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-secondary dark:text-gray-300"
      >
        <option value="">{currentPlaceholder}</option>
        {currentOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
        <ChevronDown size={16} />
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { TagInputProps } from "@/types";

interface EnhancedTagInputProps extends TagInputProps {
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  onInputChange?: (value: string) => void;
}

const TagInput: React.FC<EnhancedTagInputProps> = ({
  label,
  value = [],
  onChangeHandler,
  placeholder = "Add tags...",
  maxTags = 10,
  className = "",
  suggestions = [],
  onSuggestionSelect,
  showSuggestions = false,
  maxSuggestions = 8,
  onInputChange,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value and exclude already selected tags
  const filteredSuggestions = suggestions
    .filter(
      (suggestion) =>
        suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(suggestion)
    )
    .slice(0, maxSuggestions);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        // Select highlighted suggestion
        const selectedSuggestion = filteredSuggestions[highlightedIndex];
        if (onSuggestionSelect) {
          onSuggestionSelect(selectedSuggestion);
        } else {
          addTag(selectedSuggestion);
        }
        setInputValue("");
        setHighlightedIndex(-1);
        setIsDropdownOpen(false);
      } else {
        // Add current input as tag (if it's a valid suggestion)
        addTag();
      }
    } else if (e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && inputValue === "" && value.length > 0) {
      removeTag(value.length - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const addTag = (tagValue?: string) => {
    const tag = tagValue || inputValue.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      // Only add if it's a valid suggestion or if no suggestions are provided
      if (suggestions.length === 0 || suggestions.includes(tag)) {
        onChangeHandler([...value, tag]);
        setInputValue("");
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    }
  };

  const removeTag = (index: number) => {
    const newTags = value.filter((_, i) => i !== index);
    onChangeHandler(newTags);
  };

  const handleBlur = () => {
    // Delay closing dropdown to allow for clicks on suggestions
    setTimeout(() => {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  };

  const handleFocus = () => {
    if (showSuggestions && inputValue.trim()) {
      setIsDropdownOpen(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Notify parent component of input change
    if (onInputChange) {
      onInputChange(newValue);
    }

    if (showSuggestions) {
      setIsDropdownOpen(newValue.trim().length > 0);
      setHighlightedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    } else {
      addTag(suggestion);
    }
    setInputValue("");
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 dark:border-gray-600 rounded-xs focus-within:ring focus-within:ring-accent focus-within:border-accent bg-white dark:bg-gray-800">
          {value.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-xs"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 cursor-pointer transition-colors"
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={
              value.length >= maxTags ? `Maximum ${maxTags} tags` : placeholder
            }
            disabled={value.length >= maxTags}
            className="flex-1 min-w-0 outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-transparent"
          />
          {showSuggestions && (
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {isDropdownOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions &&
          isDropdownOpen &&
          filteredSuggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              {filteredSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    index === highlightedIndex
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

        {/* No suggestions message */}
        {showSuggestions &&
          isDropdownOpen &&
          inputValue.trim() &&
          filteredSuggestions.length === 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                No matching suggestions found
              </div>
            </div>
          )}
      </div>
      {value.length >= maxTags && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Maximum {maxTags} tags allowed
        </p>
      )}
    </div>
  );
};

export default TagInput;

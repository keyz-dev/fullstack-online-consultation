"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useLanguage, type LanguageOption } from "../../contexts";
import { useIsMobile } from "../../hooks";

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = "",
}) => {
  const { language, setLanguage, languageOptions } = useLanguage();
  const [open, setOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const currentLanguage = languageOptions.find((opt) => opt.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLanguageSelect = (selectedLanguage: LanguageOption) => {
    setLanguage(selectedLanguage.code);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={languageRef}>
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-accent-light dark:hover:bg-gray-800 dark:text-white"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe size={isMobile ? 16 : 18} />
        {isMobile && (
          <span className="capitalize">{language.toUpperCase()}</span>
        )}
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-24 bg-white dark:bg-gray-800 border border-line_clr rounded shadow-sm z-20">
          {languageOptions.map((option) => (
            <li key={option.code}>
              <button
                className="w-full text-left px-3 py-2 hover:bg-accent-light dark:hover:bg-gray-700 dark:text-white"
                onClick={() => handleLanguageSelect(option)}
              >
                {option.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LanguageSelector;

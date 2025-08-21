"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type Language = "en" | "fr";

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  languageOptions: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

const languageOptions: LanguageOption[] = [
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "fr",
    name: "Français",
    flag: "🇫🇷",
  },
];

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    // Check for saved language preference or default to English
    const savedLanguage = localStorage.getItem("language") as Language;
    if (
      savedLanguage &&
      languageOptions.some((opt) => opt.code === savedLanguage)
    ) {
      setLanguageState(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem("language", language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const value: LanguageContextType = {
    language,
    setLanguage,
    languageOptions,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

"use client";

import React, { useEffect, useState, useRef } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme, useIsMobile } from "../../hooks";

interface ThemeToggleProps {
  className?: string;
}

const themes = [
  { key: "light", label: "Light", icon: <Sun size={16} /> },
  { key: "dark", label: "Dark", icon: <Moon size={16} /> },
  { key: "system", label: "System", icon: <Monitor size={16} /> },
];

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = "" }) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        themeRef.current &&
        !themeRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={themeRef}>
      <button
        type="button"
        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-yellow-100 dark:hover:bg-gray-800 dark:text-white"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {themes.find((t) => t.key === theme)?.icon}
        {isMobile && <span className="capitalize">{theme}</span>}
      </button>
      {open && (
        <ul className="absolute right-0 mt-1 w-28 bg-white dark:bg-gray-800 border border-line_clr rounded shadow-sm z-20">
          {themes.map((t) => (
            <li key={t.key}>
              <button
                className="w-full flex items-center gap-2 text-left px-3 py-2 hover:bg-yellow-100 dark:hover:bg-gray-700 dark:text-white"
                onClick={() => {
                  setTheme(t.key as "light" | "dark" | "system");
                  setOpen(false);
                }}
              >
                {t.icon}
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThemeToggle;

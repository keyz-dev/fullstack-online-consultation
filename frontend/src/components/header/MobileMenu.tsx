"use client";

import React from "react";
import { NavLinks, ProfileInfo, LanguageSelector, ThemeToggle } from ".";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ open, onClose }) => {
  return (
    <div
      className={`fixed inset-0 z-30 bg-black/40 transition-opacity duration-300 ${
        open
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
      aria-hidden={!open}
    >
      <nav
        className={`absolute left-0 top-0 w-64 h-full bg-white dark:bg-gray-900 shadow-lg p-6 flex flex-col gap-6 transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
        aria-label="Mobile menu"
      >
        <NavLinks mobile={true} />
        <div className="flex flex-col gap-6 mt-0">
          <LanguageSelector />
          <ThemeToggle />
          <ProfileInfo mobile />
        </div>
      </nav>
    </div>
  );
};

export default MobileMenu;

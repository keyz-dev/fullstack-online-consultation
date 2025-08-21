"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "../ui";
import {
  NavLinks,
  ProfileInfo,
  MobileMenu,
  ThemeToggle,
  LanguageSelector,
} from "../header";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Main navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Logo size={110} />
            </div>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <NavLinks />
            </div>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSelector />
              <ProfileInfo />
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 dark:text-gray-300 hover:text-accent"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default Header;

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
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  beSticky?: boolean;
}

const Header = ({ beSticky = true }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const getDestination = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "doctor") return "/doctor";
    if (user?.role === "patient") return "/patient";
    if (user?.role === "pharmacy") return "/pharmacy";
    if (user?.role === "pending_doctor") return "/pending-doctor";
    if (user?.role === "pending_pharmacy") return "/pending-pharmacy";
    return "/";
  };

  return (
    <header className={`w-full ${beSticky ? "sticky top-0 z-50" : ""}`}>
      {/* Main navigation */}
      <nav className="bg-white dark:bg-gray-900 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Logo size={110} destination={getDestination()} />
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

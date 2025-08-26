"use client";

import React, { useEffect, useState, useRef } from "react";
import { useBaseDashboard, useAuth } from "../../contexts";
import {
  Menu,
  Search,
  ChevronsLeft,
  ChevronDown,
  ChevronsRight,
  X,
  User,
  Settings,
  LogOut,
  Store,
} from "lucide-react";
import { Logo, Button } from "../ui";
import { useRouter } from "next/navigation";
import { ThemeToggle, LanguageSelector } from "../header";
import { NotificationBell } from "../notifications";

const DashboardHeader = () => {
  const { pageTitle, sidebarCollapsed, setSidebarCollapsed, roleConfig } =
    useBaseDashboard();

  const { logout, user } = useAuth();
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleProfileClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (showMobileSearch && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isSearchOpen, showMobileSearch]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getDestination = () => {
    if (user?.role === "admin") return "/admin";
    if (user?.role === "doctor") return "/doctor";
    if (user?.role === "patient") return "/patient";
    if (user?.role === "pharmacy") return "/pharmacy";
    if (user?.role === "pending_doctor") return "/pending-doctor";
    if (user?.role === "pending_pharmacy") return "/pending-pharmacy";
    return "/";
  };

  if (!roleConfig) return null;

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 relative z-40">
        {/* Main Header */}
        <div className="flex items-center justify-between px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
          {/* Left Side */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Logo - Hidden on very small screens when title is long */}
            <div className="hidden xs:block sm:block">
              <Logo destination={getDestination()} />
            </div>

            {/* Desktop Sidebar Toggle */}
            <Button
              onClickHandler={() => setSidebarCollapsed(!sidebarCollapsed)}
              additionalClasses="hidden lg:flex text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 min-h-[35px] min-w-[35px] h-[40px] w-[40px] p-0 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              aria-label={
                sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
              }
            >
              {sidebarCollapsed ? (
                <ChevronsRight
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              ) : (
                <ChevronsLeft
                  size={20}
                  className="text-gray-600 dark:text-gray-300"
                />
              )}
            </Button>

            {/* Page Title */}
            <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary dark:text-white truncate">
              {pageTitle}
            </h1>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Desktop Search */}
            <div className="hidden lg:flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                onBlur={() => setSearchOpen(false)}
                className={`
                  transition-all duration-300 ease-in-out outline-none
                  rounded-md border focus:border-accent border-gray-200 dark:border-gray-600 
                  px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  ${isSearchOpen ? "w-52 opacity-100" : "w-0 opacity-0"}
                `}
              />
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={handleMobileSearch}
              className="lg:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <NotificationBell />

            {/* Desktop only: Language and Theme selectors */}
            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>

            {/* User Profile */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 lg:gap-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 px-2 lg:px-3 py-2 cursor-pointer transition-colors"
                aria-label="User menu"
              >
                <img
                  src={user?.avatar || imagePlaceholder}
                  alt="User Avatar"
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-full object-cover"
                />
                <div className="hidden xl:block text-left">
                  <p className="font-semibold text-gray-800 dark:text-white text-sm truncate max-w-24">
                    {user?.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs truncate max-w-24">
                    {user?.role}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className="hidden sm:block text-gray-600 dark:text-gray-400"
                />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                  {/* Mobile-only language and theme options */}
                  <div className="md:hidden border-b border-gray-100 dark:border-gray-700 pb-2 mb-2">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Preferences
                    </div>
                    <div className="px-4 py-2 flex flex-col gap-2">
                      <LanguageSelector />
                      <ThemeToggle />
                    </div>
                  </div>

                  {user?.role === "patient" && (
                    <button
                      onClick={() => {
                        router.push("/register/doctor");
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Store size={16} />
                      Become a Doctor
                    </button>
                  )}

                  <button
                    onClick={() => {
                      router.push(roleConfig.basePath + "/profile");
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User size={16} />
                    My Profile
                  </button>
                  <button
                    onClick={() => {
                      router.push(roleConfig.basePath + "/settings");
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="lg:hidden border-t border-gray-200 dark:border-gray-700 px-3 sm:px-4 py-3 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center gap-3">
              <input
                ref={mobileSearchRef}
                type="text"
                placeholder="Search..."
                className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              />
              <button
                onClick={() => setShowMobileSearch(false)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default DashboardHeader;

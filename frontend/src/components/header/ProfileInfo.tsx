"use client";

import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../../hooks";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Store,
  LayoutDashboard,
  Package,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "../ui";
import Link from "next/link";

const ProfileInfo: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const { user, logout, loading } = useAuth();
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleProfileClick = () => {
    setShowUserDropdown(!showUserDropdown);
  };

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

  // Show loading state to prevent hydration mismatch
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        <div className="hidden lg:block">
          <div className="w-20 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={handleProfileClick}
          className="flex items-center gap-3 rounded-sm hover:bg-light_bg px-4 py-2 cursor-pointer"
        >
          <img
            src={user.avatar || imagePlaceholder}
            alt="User Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden lg:block">
            <p className="font-semibold text-gray-800 dark:text-white text-sm">
              {user.name}
            </p>
            <p className="text-gray-500 dark:text-gray-300 text-xs">
              {user.role}
            </p>
          </div>
          <ChevronDown size={20} />
        </button>

        {showUserDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-sm shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
            <button
              onClick={() => {
                setShowUserDropdown(false);
                switch (user.role) {
                  case "admin":
                    router.push("/admin");
                    break;
                  case "doctor":
                    router.push("/doctor");
                    break;
                  case "patient":
                    router.push("/patient");
                    break;
                  case "pharmacy":
                    router.push("/pharmacy");
                    break;
                  default:
                    router.push("/");
                }
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <LayoutDashboard size={16} />
              Dashboard
            </button>
            <button
              onClick={() => router.push("/orders")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <Package size={16} />
              Orders
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <User size={16} />
              My Profile
            </button>
            {user.role === "patient" && (
              <>
                <hr className="my-2 text-line_clr" />
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    router.push("/register/doctor");
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-accent hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Store size={16} />
                  Become a Doctor
                </button>
              </>
            )}
            <hr className="my-2 text-line_clr" />
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex ${
        mobile ? "items-start gap-3 flex-col" : "items-center gap-2"
      }`}
    >
      <Link href="/login">
        <button
          className={`bg-transparent text-black dark:text-white min-w-fit hover:bg-accent-light dark:hover:bg-gray-800 w-[90px] rounded px-2 py-1 ${
            mobile && "text-left"
          }`}
        >
          Login
        </button>
      </Link>
      <hr className="w-0 lg:w-[2px] lg:h-8 border-none bg-slate-200 dark:bg-accent"></hr>
      <Link href="/register">
        <button
          className={`bg-transparent text-black dark:text-white min-w-fit hover:bg-accent-light dark:hover:bg-gray-800 w-[90px] rounded px-2 py-1 ${
            mobile && "text-left"
          }`}
        >
          Join Us
        </button>
      </Link>
      <hr className="w-0 lg:w-[2px] lg:h-8 border-none bg-slate-200 dark:bg-accent"></hr>
      <Button
        onClickHandler={() => router.push("/register/pharmacy")}
        additionalClasses={`primarybtn min-h-fit ${
          mobile ? "text-left justify-start" : "justify-center"
        }`}
        text="Add Pharmacy"
        leadingIcon={<Store size={16} />}
      />
    </div>
  );
};

export default ProfileInfo;

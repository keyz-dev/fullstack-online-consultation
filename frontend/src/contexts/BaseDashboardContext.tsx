"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { ROLE_CONFIGS } from "../config/userRoles";

interface BaseDashboardContextType {
  roleConfig: any;
  pageTitle: string;
  activeNavItem: string;
  sidebarCollapsed: boolean;
  setPageTitle: (title: string) => void;
  setActiveNavItem: (item: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  updateActiveNavFromPath: (currentPath: string) => void;
}

const BaseDashboardContext = createContext<
  BaseDashboardContextType | undefined
>(undefined);

// This handles only UI-related dashboard state
export const BaseDashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [activeNavItem, setActiveNavItem] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [pageTitle, setPageTitle] = useState("Dashboard");

  const roleConfig = user ? ROLE_CONFIGS[user.role] : null;

  const updateActiveNavFromPath = (currentPath: string) => {
    if (!roleConfig) return;

    const relativePath = currentPath
      .replace(roleConfig.basePath, "")
      .replace(/^\//, "");
    const navItem = roleConfig.navItems.find(
      (item: any) => item.path === relativePath
    );

    if (navItem) {
      setActiveNavItem(relativePath);
      setPageTitle(navItem.label);
    }
  };

  const value: BaseDashboardContextType = {
    roleConfig,
    pageTitle,
    activeNavItem,
    sidebarCollapsed,
    setPageTitle,
    setActiveNavItem,
    setSidebarCollapsed,
    updateActiveNavFromPath,
  };

  return (
    <BaseDashboardContext.Provider value={value}>
      {children}
    </BaseDashboardContext.Provider>
  );
};

export const useBaseDashboard = () => {
  const context = useContext(BaseDashboardContext);
  if (!context) {
    throw new Error(
      "useBaseDashboard must be used within a BaseDashboardProvider"
    );
  }
  return context;
};

"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useBaseDashboard } from "../../contexts/BaseDashboardContext";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const {
    user,
    roleConfig,
    updateActiveNavFromPath,
    sidebarCollapsed,
    setSidebarCollapsed,
  } = useBaseDashboard();
  const pathname = usePathname();

  useEffect(() => {
    updateActiveNavFromPath(pathname);
  }, [pathname, updateActiveNavFromPath]);

  // Show loading state until client-side hydration is complete
  if (!user || !roleConfig) {
    return (
      <div className="h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <DashboardHeader />
      <div className="flex-1 flex overflow-hidden relative">
        <DashboardSidebar />

        {/* Mobile Overlay */}
        {!sidebarCollapsed && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={() => {
              setSidebarCollapsed(true);
            }}
          />
        )}

        {/* Main Content */}
        <main
          className={`
          flex-1 overflow-y-auto transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "md:ml-0" : "md:ml-0"}
          p-3 overflow-auto h-full w-full [&::-webkit-scrollbar]:hidden
          bg-gray-50 dark:bg-gray-900
        `}
        >
          <div className="max-w-full mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

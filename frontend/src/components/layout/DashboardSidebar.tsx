"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBaseDashboard } from "../../contexts/BaseDashboardContext";
import * as Icons from "lucide-react";

const DashboardSidebar = () => {
  const { roleConfig, sidebarCollapsed, setSidebarCollapsed } =
    useBaseDashboard();
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Track window size for responsive behavior
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const isMobile = windowWidth < 1024;
  const isCollapsedDesktop = sidebarCollapsed && !isMobile;

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Debounce resize handler for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      window.removeEventListener("resize", debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const isActive = useCallback(
    (path: string) => {
      const fullPath = path
        ? `${roleConfig?.basePath}/${path}`
        : roleConfig?.basePath;
      return pathname === fullPath;
    },
    [pathname, roleConfig?.basePath]
  );

  // Handle navigation click on mobile (auto-close sidebar)
  const handleNavClick = useCallback(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, setSidebarCollapsed]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !sidebarCollapsed && isMobile) {
        setSidebarCollapsed(true);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [sidebarCollapsed, setSidebarCollapsed, isMobile]);

  // Handle swipe gestures on mobile
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;

      // Swipe left to close sidebar
      if (swipeDistance > minSwipeDistance && !sidebarCollapsed) {
        setSidebarCollapsed(true);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      sidebar.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener("touchstart", handleTouchStart);
        sidebar.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed]);

  // Handle overlay click on mobile
  const handleOverlayClick = useCallback(() => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
  }, [isMobile, sidebarCollapsed, setSidebarCollapsed]);

  if (!roleConfig) return null;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        role="navigation"
        aria-label="Main navigation"
        className={`
          bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out z-40
          overflow-hidden
          
          /* Scrollbar styles */
          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
          
          /* Mobile: Fixed overlay sidebar */
          lg:relative lg:translate-x-0
          ${
            sidebarCollapsed
              ? "fixed -translate-x-full lg:w-20"
              : "fixed translate-x-0 lg:w-64"
          }
          
          /* Mobile dimensions */
          lg:h-auto h-full w-64 lg:border-r lg:border-gray-200 dark:lg:border-gray-700
          
          /* Mobile positioning */
          top-0 left-0 lg:top-auto lg:left-auto
        `}
      >
        {/* Mobile Header - Only show on mobile when sidebar is open */}
        {isMobile && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                Menu
              </h2>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                aria-label="Close menu"
                type="button"
              >
                <Icons.X size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav
          className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2 overflow-y-auto"
          role="list"
        >
          {roleConfig.navItems.map((item: unknown) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.Circle;
            const isExternalLink = item.external || item.path === "home";
            const fullPath = isExternalLink
              ? item.path === "home"
                ? "/"
                : item.path
              : item.path
              ? `${roleConfig.basePath}/${item.path}`
              : roleConfig.basePath;
            const active = isExternalLink ? false : isActive(item.path);

            return (
              <Link
                key={item.path || "dashboard"}
                href={fullPath}
                onClick={handleNavClick}
                role="listitem"
                className={`
                  group relative flex items-center transition-all duration-200 p-3
                  ${isCollapsedDesktop ? "justify-center" : "gap-3"}
                  rounded-sm
                  ${
                    active
                      ? `bg-accent-light dark:bg-accent/20 text-accent ${
                          !isCollapsedDesktop ? "border-r-4 border-accent" : ""
                        }`
                      : "text-secondary dark:text-gray-300 hover:bg-accent-light dark:hover:bg-accent/10 hover:text-primary dark:hover:text-white"
                  }
                `}
                aria-current={active ? "page" : undefined}
                {...(isExternalLink && { target: "_self" })}
              >
                {/* Icon */}
                <IconComponent
                  className={`
                    w-5 h-5 lg:w-6 lg:h-6 flex-shrink-0 transition-colors
                    ${
                      active
                        ? "text-accent"
                        : "text-secondary dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }
                  `}
                  aria-hidden="true"
                />

                {/* Label - Hidden when collapsed on desktop */}
                <span
                  className={`
                    font-medium text-sm lg:text-base transition-all duration-200 whitespace-nowrap
                    ${
                      isCollapsedDesktop
                        ? "lg:opacity-0 lg:w-0 lg:overflow-hidden"
                        : "opacity-100"
                    }
                  `}
                >
                  {item.label}
                  {isExternalLink && (
                    <Icons.ExternalLink className="inline-block ml-1 w-3 h-3 text-gray-400" />
                  )}
                </span>

                {/* Tooltip for collapsed desktop sidebar */}
                {isCollapsedDesktop && (
                  <div
                    className="invisible group-hover:visible absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 text-sm rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-gray-700 dark:border-gray-600"
                    role="tooltip"
                  >
                    <div className="flex items-center gap-1">
                      {item.label}
                      {isExternalLink && (
                        <Icons.ExternalLink className="w-3 h-3 text-gray-300" />
                      )}
                    </div>
                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 w-0 h-0 border-r-2 border-r-gray-900 dark:border-r-gray-800 border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
                  </div>
                )}

                {/* Active indicator dot for collapsed sidebar */}
                {active && isCollapsedDesktop && (
                  <div
                    className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-accent rounded-full"
                    aria-hidden="true"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Only on desktop when expanded */}
        {!isMobile && !isCollapsedDesktop && (
          <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              <p>Version 2.1.0</p>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default DashboardSidebar;

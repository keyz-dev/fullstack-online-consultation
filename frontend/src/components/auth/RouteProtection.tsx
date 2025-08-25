"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface RouteProtectionProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  restrictedRoles?: string[];
  redirectTo?: string;
  showLoading?: boolean;
}

const RouteProtection: React.FC<RouteProtectionProps> = ({
  children,
  allowedRoles = [],
  restrictedRoles = [],
  redirectTo = "/",
  showLoading = true,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Check if user has restricted role
      if (
        restrictedRoles.length > 0 &&
        user &&
        restrictedRoles.includes(user.role)
      ) {
        router.push(redirectTo);
        return;
      }

      // Check if user has allowed role (if specified)
      if (
        allowedRoles.length > 0 &&
        user &&
        !allowedRoles.includes(user.role)
      ) {
        router.push(redirectTo);
        return;
      }
    }
  }, [user, loading, allowedRoles, restrictedRoles, redirectTo, router]);

  // Show loading state
  if (loading && showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If still loading, don't render children yet
  if (loading) {
    return null;
  }

  // Check restrictions
  if (
    restrictedRoles.length > 0 &&
    user &&
    restrictedRoles.includes(user.role)
  ) {
    return null;
  }

  // Check allowed roles
  if (allowedRoles.length > 0 && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
};
export default RouteProtection;

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Logo } from "../../components/ui";
import { LanguageSelector, ThemeToggle } from "../../components/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if we're on the doctor application page
  const isDoctorApplication = pathname === "/doctor-application";

  return (
    <section className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 min-h-[10vh] bg-white dark:bg-gray-900 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Logo destination="/" size={80} />
            {isDoctorApplication && (
              <div className="ml-6 pl-6 border-l border-gray-200 dark:border-gray-700">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Doctor Application
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Complete your application to join our platform
                </p>
              </div>
            )}
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow bg-white dark:bg-gray-900 max-h-[90vh] overflow-y-auto">
        <div className="mx-auto px-4">{children}</div>
      </main>
    </section>
  );
}

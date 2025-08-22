"use client";

import React from "react";
import { Logo } from "../../components/ui";
import { LanguageSelector, ThemeToggle } from "../../components/header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 min-h-[70px] bg-white dark:bg-gray-900 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Logo destination="/" size={80} />
          </div>
          <div className="hidden lg:flex items-center gap-6">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-grow bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">{children}</div>
      </main>
    </section>
  );
}

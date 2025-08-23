"use client";

import { SpecialtyProvider } from "@/contexts/SpecialtyContext";
import { SymptomProvider } from "@/contexts/SymptomContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SpecialtyProvider>
      <SymptomProvider>{children}</SymptomProvider>
    </SpecialtyProvider>
  );
}

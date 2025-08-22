"use client";

import { SpecialtyProvider } from "@/contexts/SpecialtyContext";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SpecialtyProvider>{children}</SpecialtyProvider>;
}

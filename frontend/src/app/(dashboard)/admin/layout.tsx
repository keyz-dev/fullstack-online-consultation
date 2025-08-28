"use client";

import { SpecialtyProvider } from "@/contexts/SpecialtyContext";
import { SymptomProvider } from "@/contexts/SymptomContext";
import RouteProtection from "@/components/auth/RouteProtection";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtection
      allowedRoles={["admin"]}
      restrictedRoles={[
        "pending_doctor",
        "pending_pharmacy",
        "incomplete_doctor",
        "incomplete_pharmacy",
        "doctor",
        "pharmacy",
        "patient",
      ]}
      redirectTo="/login"
    >
      <SpecialtyProvider>
        <SymptomProvider>{children}</SymptomProvider>
      </SpecialtyProvider>
    </RouteProtection>
  );
}

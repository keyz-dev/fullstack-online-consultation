"use client";

import RouteProtection from "@/components/auth/RouteProtection";

export default function PharmacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtection
      allowedRoles={["pharmacy"]}
      restrictedRoles={[
        "pending_doctor",
        "pending_pharmacy",
        "incomplete_doctor",
        "incomplete_pharmacy",
        "admin",
        "patient",
      ]}
      redirectTo="/home"
    >
      {children}
    </RouteProtection>
  );
}

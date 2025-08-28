"use client";

import { PatientAppointmentProvider } from "@/contexts";
import RouteProtection from "@/components/auth/RouteProtection";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtection
      allowedRoles={["patient"]}
      restrictedRoles={[
        "pending_doctor",
        "pending_pharmacy",
        "incomplete_doctor",
        "incomplete_pharmacy",
        "admin",
        "doctor",
        "pharmacy",
      ]}
      redirectTo="/login"
    >
      <PatientAppointmentProvider>{children}</PatientAppointmentProvider>
    </RouteProtection>
  );
}

"use client";

import { DoctorAppointmentProvider, ConsultationProvider } from "@/contexts";
import RouteProtection from "@/components/auth/RouteProtection";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteProtection
      allowedRoles={["doctor"]}
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
      <DoctorAppointmentProvider>
        <ConsultationProvider>
          {children}
        </ConsultationProvider>
      </DoctorAppointmentProvider>
    </RouteProtection>
  );
}

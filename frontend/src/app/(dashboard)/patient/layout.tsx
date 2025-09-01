"use client";

import { PatientAppointmentProvider } from "@/contexts";
import { PatientConsultationProvider } from "@/contexts/PatientConsultationContext";
import RouteProtection from "@/components/auth/RouteProtection";
import IncomingCallWrapper from "@/components/dashboard/patient/IncomingCallWrapper";

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
      <PatientAppointmentProvider>
        <PatientConsultationProvider>
          <IncomingCallWrapper>
            {children}
          </IncomingCallWrapper>
        </PatientConsultationProvider>
      </PatientAppointmentProvider>
    </RouteProtection>
  );
}

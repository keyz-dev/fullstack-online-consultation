"use client";

import { DoctorAppointmentProvider, ConsultationProvider} from "@/contexts";
import { DoctorConsultationProvider } from "@/contexts/DoctorConsultationContext";
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
        <DoctorConsultationProvider>
          <ConsultationProvider>
            {children}
          </ConsultationProvider>
        </DoctorConsultationProvider>
      </DoctorAppointmentProvider>
    </RouteProtection>
  );
}

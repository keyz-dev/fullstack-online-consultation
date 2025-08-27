"use client";

import { PatientAppointmentProvider } from "@/contexts";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PatientAppointmentProvider>{children}</PatientAppointmentProvider>;
}

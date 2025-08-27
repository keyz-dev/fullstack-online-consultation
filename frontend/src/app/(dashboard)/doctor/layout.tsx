"use client";

import { DoctorAppointmentProvider } from "@/contexts";

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DoctorAppointmentProvider>{children}</DoctorAppointmentProvider>;
}

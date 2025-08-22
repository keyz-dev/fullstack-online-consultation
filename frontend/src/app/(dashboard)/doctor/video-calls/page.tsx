"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorVideoCallsPage() {
  return (
    <Upcoming
      title="Video Calls"
      description="Secure video calling system for doctors to conduct remote consultations with patients in real-time."
      expectedDate="April 2024"
      colorTheme="blue"
      progressPercentage={50}
      features={[
        "HD video calling",
        "Screen sharing",
        "Recording capabilities",
        "Call scheduling",
        "Patient waiting room",
        "Call history tracking",
      ]}
    />
  );
}

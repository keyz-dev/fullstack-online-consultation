"use client";

import { Upcoming } from "@/components/ui";

export default function PatientVideoCallsPage() {
  return (
    <Upcoming
      title="Video Calls"
      description="Secure video calling system for patients to connect with doctors for remote consultations."
      expectedDate="April 2024"
      colorTheme="blue"
      progressPercentage={55}
      features={[
        "HD video calling",
        "Screen sharing",
        "Call scheduling",
        "Waiting room",
        "Call history",
        "Technical support",
      ]}
    />
  );
}

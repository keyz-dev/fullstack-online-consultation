"use client";

import { Upcoming } from "@/components/ui";

export default function PatientChatRoomsPage() {
  return (
    <Upcoming
      title="Chat Rooms"
      description="Secure messaging system for patients to communicate with doctors and healthcare providers."
      expectedDate="April 2024"
      colorTheme="purple"
      progressPercentage={65}
      features={[
        "Real-time messaging",
        "File sharing",
        "Message history",
        "Doctor communication",
        "Notification system",
        "Secure messaging",
      ]}
    />
  );
}

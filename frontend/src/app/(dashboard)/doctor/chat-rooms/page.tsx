"use client";

import { Upcoming } from "@/components/ui";

export default function DoctorChatRoomsPage() {
  return (
    <Upcoming
      title="Chat Rooms"
      description="Secure messaging system for doctors to communicate with patients and colleagues through text-based chat."
      expectedDate="April 2024"
      colorTheme="purple"
      progressPercentage={60}
      features={[
        "Real-time messaging",
        "File sharing",
        "Message history",
        "Chat room management",
        "Notification system",
        "Message encryption",
      ]}
    />
  );
}

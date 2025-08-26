"use client";

import { useState } from "react";
import { AvailabilityManager } from "@/components/dashboard/doctor/schedule/AvailabilityManager";
import { AddSchedulePage } from "@/components/dashboard/doctor/schedule/AddSchedulePage";

export default function SchedulePage() {
  const [view, setView] = useState("main");

  return (
    <div>
      {view === "main" ? (
        <AvailabilityManager setView={setView} />
      ) : (
        <AddSchedulePage setView={setView} />
      )}
    </div>
  );
}

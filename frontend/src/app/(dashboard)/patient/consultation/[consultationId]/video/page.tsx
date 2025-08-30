"use client";

import React, { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import VideoCallRoom from "@/components/video/VideoCallRoom";

export default function PatientVideoCallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const consultationId = params.consultationId as string;
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (!roomId) {
      router.push("/patient/appointments");
    }
  }, [roomId, router]);

  const handleCallEnd = () => {
    router.push("/patient/appointments");
  };

  if (!roomId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Invalid Room
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Redirecting to appointments...
          </p>
        </div>
      </div>
    );
  }

  return (
    <VideoCallRoom
      roomId={roomId}
      consultationId={consultationId}
      userRole="patient"
      onCallEnd={handleCallEnd}
    />
  );
}

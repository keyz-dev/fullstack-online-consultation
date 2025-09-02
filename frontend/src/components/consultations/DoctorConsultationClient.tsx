"use client";

import React, { useState, useEffect } from "react";
import { consultationsAPI } from "@/api/consultations";
import { Button } from "@/components/ui";
import { useAuth } from "@/contexts/AuthContext";
import { Consultation } from "@/types";

export default function DoctorConsultationClient() {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;
      try {
        // Pass user role to get secure consultations - backend now handles filtering
        const response = await consultationsAPI.getConsultations(
          user.role as "doctor"
        );
        setConsultations(response.consultations);
      } catch (err) {
        setError("Failed to fetch consultations.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [user]);

  const handleStartCall = async (consultationId: string) => {
    try {
      const response = await consultationsAPI.initiateCall(consultationId);
      if (response.success) {
        // TODO: Navigate to video call room
        console.log("Call initiated! Room ID:", response.data?.roomId);
        alert(
          `Call initiated for consultation ${consultationId}. Room: ${response.data?.roomId}`
        );
      } else {
        alert(`Failed to start call: ${response.message}`);
      }
    } catch (err) {
      alert("An error occurred while starting the call.");
      console.error(err);
    }
  };

  if (loading) return <div>Loading consultations...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        My Consultations
      </h2>

      {consultations.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No consultations found.
        </p>
      ) : (
        <div className="grid gap-4">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Consultation #{consultation.id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Patient: {consultation.patient?.user?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Status: {consultation.status}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Type: {consultation.type}
                  </p>
                </div>
                <div className="flex space-x-2">
                  {consultation.status === "not_started" && (
                    <Button
                      onClick={() => handleStartCall(consultation.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Start Call
                    </Button>
                  )}
                  {consultation.status === "in_progress" && (
                    <Button
                      onClick={() => handleStartCall(consultation.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Join Call
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

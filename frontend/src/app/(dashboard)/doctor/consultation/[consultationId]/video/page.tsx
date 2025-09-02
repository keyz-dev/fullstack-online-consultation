"use client";

import React, { useEffect, useState } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import SimplePeerVideoCallRoom from "@/components/video/SimplePeerVideoCallRoom";
import { useConsultation } from "@/contexts";
import { consultationsAPI } from "@/api/consultations";
import PrescriptionGenerationModal from "@/components/dashboard/doctor/prescriptions/PrescriptionGenerationModal";
import { Consultation } from "@/types";

export default function DoctorVideoCallPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearConsultationState } = useConsultation();
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState("");
  const [consultationData, setConsultationData] = useState<Consultation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [callEnded, setCallEnded] = useState(false);

  const consultationId = params.consultationId as string;
  const roomId = searchParams.get("roomId");

  useEffect(() => {
    if (!roomId) {
      router.push("/doctor/appointments");
    }
  }, [roomId, router]);

  // Fetch consultation data when component mounts
  useEffect(() => {
    const fetchConsultationData = async () => {
      try {
        setLoading(true);
        const response = await consultationsAPI.getConsultation(
          "doctor",
          consultationId
        );
        setConsultationData(response?.data);
      } catch (error) {
        console.error("Failed to fetch consultation data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (consultationId) {
      fetchConsultationData();
    }
  }, [consultationId]);

  const handleCallEnd = (notes?: string) => {
    setCallEnded(true);
    clearConsultationState();

    // Auto-open prescription modal for doctors after consultation ends
    // Notes are optional - doctors can add them in the prescription modal
    setConsultationNotes(notes || "");
    setShowPrescriptionModal(true);
  };

  const handlePrescriptionModalClose = () => {
    setShowPrescriptionModal(false);
    router.push("/doctor/appointments");
  };

  if (!roomId) {
    return (
      <div className="h-full flex items-center justify-center">
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
    <>
      {!callEnded ? (
        <div className="h-[87vh] overflow-hidden">
          <SimplePeerVideoCallRoom
            roomId={roomId}
            consultationId={consultationId}
            userRole="doctor"
            onCallEnd={handleCallEnd}
          />
        </div>
      ) : (
        <div className="h-[87vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Consultation Ended
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              The video consultation has ended. You can now generate a
              prescription.
            </p>
          </div>
        </div>
      )}

      {/* Prescription Generation Modal */}
      {consultationData && (
        <PrescriptionGenerationModal
          isOpen={showPrescriptionModal}
          onClose={handlePrescriptionModalClose}
          consultationId={parseInt(consultationId)}
          patientInfo={{
            name: consultationData.patient?.user?.name || "",
            age: consultationData.patient?.age || 0,
            gender: consultationData.patient?.gender || "",
            contactNumber: consultationData.patient?.user?.phoneNumber || "",
          }}
          consultationNotes={consultationNotes}
        />
      )}
    </>
  );
}

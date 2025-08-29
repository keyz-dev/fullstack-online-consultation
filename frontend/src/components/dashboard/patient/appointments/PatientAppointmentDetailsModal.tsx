import React, { useState } from "react";
import {
  FadeInContainer,
  DocumentPreview,
  ModalWrapper,
} from "@/components/ui";
import { PatientAppointment } from "@/api/appointments";
import { X, Eye, User, FileText, DollarSign, RefreshCw } from "lucide-react";
import PatientAppointmentOverviewTab from "./PatientAppointmentOverviewTab";
import PatientAppointmentDoctorTab from "./PatientAppointmentDoctorTab";
import PatientAppointmentDocumentsTab from "./PatientAppointmentDocumentsTab";
import PatientAppointmentPaymentTab from "./PatientAppointmentPaymentTab";

interface PatientAppointmentDetailsModalProps {
  appointment: PatientAppointment | null;
  isOpen: boolean;
  onClose: () => void;
  onRetryPayment?: (appointment: PatientAppointment) => void;
}

const PatientAppointmentDetailsModal: React.FC<
  PatientAppointmentDetailsModalProps
> = ({ appointment, isOpen, onClose, onRetryPayment }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewDocument, setPreviewDocument] = useState<{
    id: string;
    url: string;
    name: string;
    documentName: string;
    fileType?: string;
    size?: number;
  } | null>(null);

  if (!appointment || !isOpen) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "doctor", label: "Doctor Info", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "payment", label: "Payment", icon: DollarSign },
  ];

  return (
    <ModalWrapper>
      <div
        className="w-full max-w-4xl mx-auto flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        style={{ height: "85vh", minHeight: "600px" }}
      >
        {/* Fixed Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appointment Details
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Dr. {appointment.doctor.user.name} •{" "}
                  {appointment.consultationType}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Fixed Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0 bg-gray-50 dark:bg-gray-900/50">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Fixed Height Content Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto px-6 py-6">
            <div className="min-h-full">
              {activeTab === "overview" && (
                <FadeInContainer delay={200} duration={600}>
                  <PatientAppointmentOverviewTab appointment={appointment} />
                </FadeInContainer>
              )}

              {activeTab === "doctor" && (
                <FadeInContainer delay={200} duration={600}>
                  <PatientAppointmentDoctorTab appointment={appointment} />
                </FadeInContainer>
              )}

              {activeTab === "documents" && (
                <FadeInContainer delay={200} duration={600}>
                  <PatientAppointmentDocumentsTab
                    appointment={appointment}
                    onPreviewDocument={setPreviewDocument}
                  />
                </FadeInContainer>
              )}

              {activeTab === "payment" && (
                <FadeInContainer delay={200} duration={600}>
                  <PatientAppointmentPaymentTab
                    appointment={appointment}
                    onRetryPayment={onRetryPayment}
                  />
                </FadeInContainer>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Preview Modal */}
      {previewDocument && (
        <DocumentPreview
          document={previewDocument}
          isOpen={!!previewDocument}
          onClose={() => setPreviewDocument(null)}
        />
      )}
    </ModalWrapper>
  );
};

export default PatientAppointmentDetailsModal;

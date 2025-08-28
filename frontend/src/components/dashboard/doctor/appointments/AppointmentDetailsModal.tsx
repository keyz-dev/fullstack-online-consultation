import React, { useState } from "react";
import {
  FadeInContainer,
  DocumentPreview,
  ModalWrapper,
} from "@/components/ui";
import { DoctorAppointment } from "@/api/appointments";
import { X, Eye, User, FileText, DollarSign } from "lucide-react";
import AppointmentOverviewTab from "./AppointmentOverviewTab";
import AppointmentPatientTab from "./AppointmentPatientTab";
import AppointmentDocumentsTab from "./AppointmentDocumentsTab";
import AppointmentPaymentTab from "./AppointmentPaymentTab";

interface AppointmentDetailsModalProps {
  appointment: DoctorAppointment | null;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  appointment,
  isOpen,
  onClose,
}) => {
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
    { id: "patient", label: "Patient Info", icon: User },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "payment", label: "Payment", icon: DollarSign },
  ];

  return (
    <ModalWrapper>
      <div className="w-full max-w-4xl min-w-sm lg:min-w-lg mx-auto max-h-[90vh] flex flex-col p-2 lg:py-4">
        {/* Fixed Header */}
        <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appointment Details
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {appointment.patient?.user.name} •{" "}
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
        <div className="border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {activeTab === "overview" && (
            <FadeInContainer delay={200} duration={600}>
              <AppointmentOverviewTab appointment={appointment} />
            </FadeInContainer>
          )}

          {activeTab === "patient" && (
            <FadeInContainer delay={200} duration={600}>
              <AppointmentPatientTab appointment={appointment} />
            </FadeInContainer>
          )}

          {activeTab === "documents" && (
            <FadeInContainer delay={200} duration={600}>
              <AppointmentDocumentsTab
                appointment={appointment}
                onPreviewDocument={setPreviewDocument}
              />
            </FadeInContainer>
          )}

          {activeTab === "payment" && (
            <FadeInContainer delay={200} duration={600}>
              <AppointmentPaymentTab appointment={appointment} />
            </FadeInContainer>
          )}
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

export default AppointmentDetailsModal;

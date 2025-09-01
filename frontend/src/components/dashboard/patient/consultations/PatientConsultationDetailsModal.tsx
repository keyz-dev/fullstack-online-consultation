import React, { useState } from "react";
import {
  FadeInContainer,
  ModalWrapper,
} from "@/components/ui";
import { Consultation } from "@/types";
import { X, Eye, User, FileText, MessageSquare, Star } from "lucide-react";

interface PatientConsultationDetailsModalProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientConsultationDetailsModal: React.FC<PatientConsultationDetailsModalProps> = ({
  consultation,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!consultation || !isOpen) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "doctor", label: "Doctor Info", icon: User },
    { id: "notes", label: "Notes & Diagnosis", icon: FileText },
    { id: "messages", label: "Chat History", icon: MessageSquare },
    { id: "rating", label: "My Rating", icon: Star },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    if (duration < 60) return `${duration} minutes`;
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <ModalWrapper>
      <div
        className="w-full max-w-4xl mx-auto flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        style={{ height: "85vh", minHeight: "600px" }}
      >
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-t-lg">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Consultation Details
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Dr. {consultation.doctor?.name} • {formatDate(consultation.createdAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <FadeInContainer>
            {activeTab === "overview" && (
              <div className="p-6 space-y-6">
                {/* Consultation Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Consultation Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Status:</span>
                        <span className={`font-medium ${
                          consultation.status === 'completed' ? 'text-green-600' :
                          consultation.status === 'in_progress' ? 'text-blue-600' :
                          'text-gray-600'
                        }`}>
                          {consultation.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium">{consultation.type.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">{formatDuration(consultation.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Started:</span>
                        <span className="font-medium">
                          {consultation.startedAt ? formatDate(consultation.startedAt) : 'Not started'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Ended:</span>
                        <span className="font-medium">
                          {consultation.endedAt ? formatDate(consultation.endedAt) : 'Ongoing'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Doctor Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Name:</span>
                        <span className="font-medium">Dr. {consultation.doctor?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Specialty:</span>
                        <span className="font-medium">{consultation.doctor?.specialty || 'General Practice'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Email:</span>
                        <span className="font-medium">{consultation.doctor?.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Doctor's Notes
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {consultation.notes || 'No notes recorded for this consultation.'}
                    </p>
                  </div>
                </div>

                {consultation.diagnosis && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Diagnosis
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-gray-700 dark:text-gray-300">
                        {consultation.diagnosis}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "rating" && (
              <div className="p-6 space-y-6">
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Rating
                  </h3>
                  
                  {consultation.rating ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 ${
                              i < consultation.rating!
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                        <span className="text-xl font-bold ml-2">{consultation.rating}/5</span>
                      </div>
                      
                      {consultation.review && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-gray-700 dark:text-gray-300 italic">
                            "{consultation.review}"
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">
                      <p>You haven't rated this consultation yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Placeholder for other tabs */}
            {activeTab === "doctor" && (
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400">Doctor information tab - Coming soon</p>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400">Chat history tab - Coming soon</p>
              </div>
            )}
          </FadeInContainer>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default PatientConsultationDetailsModal;

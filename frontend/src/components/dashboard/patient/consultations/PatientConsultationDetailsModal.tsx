import React, { useState, useEffect } from "react";
import { FadeInContainer, ModalWrapper } from "@/components/ui";
import { Consultation } from "@/types";
import {
  X,
  Eye,
  User,
  FileText,
  MessageSquare,
  Star,
  Pill,
} from "lucide-react";
import { usePrescriptions } from "@/hooks/usePrescriptions";
import DocumentPreview from "@/components/ui/DocumentReview/DocumentPreview";

interface PatientConsultationDetailsModalProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
}

const PatientConsultationDetailsModal: React.FC<
  PatientConsultationDetailsModalProps
> = ({ consultation, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [previewDocument, setPreviewDocument] = useState<{
    id: string;
    url: string;
    name: string;
    documentName: string;
    fileType?: string;
    size?: number;
  } | null>(null);
  const {
    prescriptions,
    getPrescriptionsByConsultation,
    loading: prescriptionsLoading,
  } = usePrescriptions();

  // Fetch prescriptions when consultation changes
  useEffect(() => {
    if (consultation && consultation.id) {
      getPrescriptionsByConsultation(parseInt(consultation.id));
    }
  }, [consultation, getPrescriptionsByConsultation]);

  if (!consultation || !isOpen) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "doctor", label: "Doctor", icon: User },
    { id: "notes", label: "Diagnosis", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill },
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
              Dr. {consultation.doctor?.name} •{" "}
              {formatDate(consultation.createdAt)}
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
                        <span className="text-gray-600 dark:text-gray-400">
                          Status:
                        </span>
                        <span
                          className={`font-medium ${
                            consultation.status === "completed"
                              ? "text-green-600"
                              : consultation.status === "in_progress"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {consultation.status.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Type:
                        </span>
                        <span className="font-medium">
                          {consultation.type.replace("_", " ").toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Duration:
                        </span>
                        <span className="font-medium">
                          {formatDuration(consultation.duration || null)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Started:
                        </span>
                        <span className="font-medium">
                          {consultation.startedAt
                            ? formatDate(consultation.startedAt)
                            : "Not started"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Ended:
                        </span>
                        <span className="font-medium">
                          {consultation.endedAt
                            ? formatDate(consultation.endedAt)
                            : "Ongoing"}
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
                        <span className="text-gray-600 dark:text-gray-400">
                          Name:
                        </span>
                        <span className="font-medium">
                          Dr. {consultation.doctor?.user?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Specialty:
                        </span>
                        <span className="font-medium">
                          {consultation.doctor?.specialties?.[0]?.name ||
                            "General Practice"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Email:
                        </span>
                        <span className="font-medium">
                          {consultation.doctor?.user?.email}
                        </span>
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
                    Doctor&apos;s Notes
                  </h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {consultation.notes ||
                        "No notes recorded for this consultation."}
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

            {activeTab === "prescriptions" && (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <span>Prescriptions</span>
                  </h3>

                  {prescriptionsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="text-gray-500 mt-2">
                        Loading prescriptions...
                      </p>
                    </div>
                  ) : prescriptions.length > 0 ? (
                    <div className="space-y-4">
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.id}
                          className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                Prescription #{prescription.id}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Generated on{" "}
                                {formatDate(prescription.createdAt)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Status:{" "}
                                {prescription.fileUrl ? (
                                  <span className="text-green-600 font-medium">
                                    Ready
                                  </span>
                                ) : (
                                  <span className="text-yellow-600 font-medium">
                                    Processing...
                                  </span>
                                )}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              {prescription.fileUrl ? (
                                <>
                                  <button
                                    onClick={() =>
                                      setPreviewDocument({
                                        id: prescription.id.toString(),
                                        url: prescription.fileUrl!,
                                        name: `prescription_${prescription.id}.pdf`,
                                        documentName: `Prescription #${prescription.id}`,
                                        fileType: "application/pdf",
                                        size: 0,
                                      })
                                    }
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center space-x-1 transition-colors"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>View</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      const link = document.createElement("a");
                                      link.href = prescription.fileUrl!;
                                      link.download = `prescription_${prescription.id}.pdf`;
                                      link.click();
                                    }}
                                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 flex items-center space-x-1 transition-colors"
                                  >
                                    <FileText className="w-3 h-3" />
                                    <span>Download</span>
                                  </button>
                                </>
                              ) : (
                                <div className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded flex items-center space-x-1">
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600"></div>
                                  <span>Processing...</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                            <p>
                              <strong>Diagnosis:</strong>{" "}
                              {prescription.diagnosis || "Not specified"}
                            </p>
                            <p>
                              <strong>Medications:</strong>{" "}
                              {prescription.medications?.length || 0} prescribed
                            </p>
                            <p>
                              <strong>Duration:</strong>{" "}
                              {prescription.duration || "As prescribed"} days
                            </p>
                            {prescription.instructions && (
                              <p>
                                <strong>Instructions:</strong>{" "}
                                {prescription.instructions}
                              </p>
                            )}
                          </div>

                          {prescription.medications &&
                            prescription.medications.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                  Medications:
                                </h5>
                                <div className="space-y-2">
                                  {prescription.medications.map(
                                    (med: any, index: number) => (
                                      <div
                                        key={index}
                                        className="bg-white dark:bg-gray-800 p-3 rounded border"
                                      >
                                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                                          {med.name}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                          {med.dosage && (
                                            <span>Dosage: {med.dosage} • </span>
                                          )}
                                          {med.frequency && (
                                            <span>
                                              Frequency: {med.frequency} •{" "}
                                            </span>
                                          )}
                                          {med.duration && (
                                            <span>
                                              Duration: {med.duration}
                                            </span>
                                          )}
                                        </div>
                                        {med.instructions && (
                                          <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                            <strong>Instructions:</strong>{" "}
                                            {med.instructions}
                                          </div>
                                        )}
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Pill className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                      <p>No prescriptions generated yet</p>
                      <p className="text-sm">
                        Prescriptions will appear here once generated by the
                        doctor
                      </p>
                    </div>
                  )}
                </div>
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
                        <span className="text-xl font-bold ml-2">
                          {consultation.rating}/5
                        </span>
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
                <p className="text-gray-500 dark:text-gray-400">
                  Doctor information tab - Coming soon
                </p>
              </div>
            )}

            {activeTab === "messages" && (
              <div className="p-6">
                <p className="text-gray-500 dark:text-gray-400">
                  Chat history tab - Coming soon
                </p>
              </div>
            )}
          </FadeInContainer>
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

export default PatientConsultationDetailsModal;

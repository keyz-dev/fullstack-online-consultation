import React, { useState } from "react";
import {
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
  User,
  Calendar,
  Award,
  GraduationCap,
  Languages,
  DollarSign,
  Clock as TimeIcon,
  Building2,
  Users,
  Star,
  FileCheck,
  AlertTriangle,
} from "lucide-react";
import {
  StatusPill,
  FadeInContainer,
  ModalWrapper,
  DocumentPreview,
} from "@/components/ui";
import { Application } from "@/api/admin";
import { formatDate } from "@/utils/dateUtils";

interface ApplicationDetailModalProps {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onReview: (application: Application, action: "approve" | "reject") => void;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  isOpen,
  onClose,
  onReview,
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

  if (!application || !isOpen) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  const getDocumentStatus = (document: { isApproved?: boolean }) => {
    if (document.isApproved === true) return "approved";
    if (document.isApproved === false) return "rejected";
    return "pending";
  };

  const getBusinessName = () => {
    if (application.applicationType === "doctor") {
      return application.doctor?.licenseNumber || "Doctor Application";
    } else {
      return application.pharmacy?.name || "Pharmacy Application";
    }
  };

  const getLocation = () => {
    if (application.applicationType === "doctor") {
      return (
        application.doctor?.clinicAddress?.city || "Location not specified"
      );
    } else {
      return application.pharmacy?.address?.city || "Location not specified";
    }
  };

  const getTypeIcon = () => {
    return application.applicationType === "doctor" ? (
      <Users className="w-5 h-5" />
    ) : (
      <Building2 className="w-5 h-5" />
    );
  };

  return (
    <ModalWrapper>
      <div
        className="w-full max-w-4xl mx-auto flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-xl"
        style={{ height: "85vh", minHeight: "600px" }}
      >
        {/* Header - Fixed */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Application Details
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getTypeIcon()}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getBusinessName()} • {application.applicationType}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusPill status={application.status} />
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs - Fixed */}
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
                  <div className="space-y-8">
                    {/* Applicant Information */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <User
                          size={20}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        Applicant Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                              <User
                                size={20}
                                className="text-blue-600 dark:text-blue-400"
                              />
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {application.user.name}
                              </h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {application.user.id}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Mail size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {application.user.email}
                              </span>
                            </div>
                            {application.user.phoneNumber && (
                              <div className="flex items-center gap-2">
                                <Phone size={16} className="text-gray-400" />
                                <span className="text-sm text-gray-900 dark:text-white">
                                  {application.user.phoneNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                              {getTypeIcon()}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white capitalize">
                                {application.applicationType} Application
                              </h5>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Version {application.applicationVersion}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <MapPin size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {getLocation()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar size={16} className="text-gray-400" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                Submitted: {formatDate(application.submittedAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Details */}
                    {application.applicationType === "doctor" &&
                      application.doctor && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Award
                              size={20}
                              className="text-purple-600 dark:text-purple-400"
                            />
                            Professional Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                                License & Experience
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    License Number
                                  </label>
                                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                                    {application.doctor.licenseNumber}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Years of Experience
                                  </label>
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {application.doctor.experience} years
                                  </p>
                                </div>
                                {application.doctor.consultationFee && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Consultation Fee
                                    </label>
                                    <p className="text-sm text-gray-900 dark:text-white flex items-center gap-1">
                                      <DollarSign size={14} />
                                      {application.doctor.consultationFee}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                                Specializations
                              </h5>
                              <div className="space-y-3">
                                {application.doctor.specialties &&
                                application.doctor.specialties.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {application.doctor.specialties.map(
                                      (
                                        specialty: { name?: string } | string,
                                        index: number
                                      ) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200"
                                        >
                                          {specialty.name || specialty}
                                        </span>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    No specialties listed
                                  </p>
                                )}

                                {application.doctor.languages &&
                                  application.doctor.languages.length > 0 && (
                                    <div>
                                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Languages
                                      </label>
                                      <div className="flex flex-wrap gap-2">
                                        {application.doctor.languages.map(
                                          (language: string, index: number) => (
                                            <span
                                              key={index}
                                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200"
                                            >
                                              {language}
                                            </span>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>

                          {application.doctor.bio && (
                            <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                                Bio
                              </h5>
                              <p className="text-sm text-gray-700 dark:text-gray-300">
                                {application.doctor.bio}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Pharmacy Details */}
                    {application.applicationType === "pharmacy" &&
                      application.pharmacy && (
                        <div>
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Building2
                              size={20}
                              className="text-green-600 dark:text-green-400"
                            />
                            Pharmacy Details
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                                Business Information
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Pharmacy Name
                                  </label>
                                  <p className="text-sm text-gray-900 dark:text-white">
                                    {application.pharmacy.name}
                                  </p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    License Number
                                  </label>
                                  <p className="text-sm text-gray-900 dark:text-white font-mono">
                                    {application.pharmacy.licenseNumber}
                                  </p>
                                </div>
                                {application.pharmacy.description && (
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Description
                                    </label>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {application.pharmacy.description}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                                Contact & Location
                              </h5>
                              <div className="space-y-3">
                                {application.pharmacy.address && (
                                  <div className="flex items-start gap-2">
                                    <MapPin
                                      size={16}
                                      className="text-gray-400 mt-0.5"
                                    />
                                    <div className="text-sm text-gray-900 dark:text-white">
                                      {
                                        application.pharmacy.address
                                          .streetAddress
                                      }
                                      <br />
                                      {application.pharmacy.address.city},{" "}
                                      {application.pharmacy.address.state}
                                      <br />
                                      {
                                        application.pharmacy.address.country
                                      }{" "}
                                      {application.pharmacy.address.postalCode}
                                    </div>
                                  </div>
                                )}
                                {application.pharmacy.contactInfo && (
                                  <div className="space-y-2">
                                    {application.pharmacy.contactInfo.phone && (
                                      <div className="flex items-center gap-2">
                                        <Phone
                                          size={16}
                                          className="text-gray-400"
                                        />
                                        <span className="text-sm text-gray-900 dark:text-white">
                                          {
                                            application.pharmacy.contactInfo
                                              .phone
                                          }
                                        </span>
                                      </div>
                                    )}
                                    {application.pharmacy.contactInfo.email && (
                                      <div className="flex items-center gap-2">
                                        <Mail
                                          size={16}
                                          className="text-gray-400"
                                        />
                                        <span className="text-sm text-gray-900 dark:text-white">
                                          {
                                            application.pharmacy.contactInfo
                                              .email
                                          }
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* Application Timeline */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Clock
                          size={20}
                          className="text-orange-600 dark:text-orange-400"
                        />
                        Application Timeline
                      </h4>
                      <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
                              <Calendar
                                size={16}
                                className="text-orange-600 dark:text-orange-400"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Submitted
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(application.submittedAt)}
                              </p>
                            </div>
                          </div>

                          {application.updatedAt &&
                            application.updatedAt !==
                              application.submittedAt && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                                  <Clock
                                    size={16}
                                    className="text-blue-600 dark:text-blue-400"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Last Updated
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.updatedAt)}
                                  </p>
                                </div>
                              </div>
                            )}

                          {application.status === "approved" &&
                            application.approvedAt && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                  <CheckCircle
                                    size={16}
                                    className="text-green-600 dark:text-green-400"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Approved
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.approvedAt)}
                                  </p>
                                </div>
                              </div>
                            )}

                          {application.status === "rejected" &&
                            application.rejectedAt && (
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                                  <XCircle
                                    size={16}
                                    className="text-red-600 dark:text-red-400"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    Rejected
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDate(application.rejectedAt)}
                                  </p>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Admin Review History */}
                    {application.adminReview && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <MessageSquare
                            size={20}
                            className="text-indigo-600 dark:text-indigo-400"
                          />
                          Previous Review
                        </h4>
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-3">
                            <MessageSquare
                              size={16}
                              className="text-indigo-600 dark:text-indigo-400"
                            />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Reviewed by:{" "}
                              {application.adminReview.reviewedBy?.name ||
                                "Admin"}
                            </span>
                          </div>
                          {application.adminReview.remarks && (
                            <div className="mb-3">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Remarks
                              </label>
                              <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded p-3">
                                {application.adminReview.remarks}
                              </p>
                            </div>
                          )}
                          {application.adminReview.rejectionReason && (
                            <div>
                              <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-1">
                                Rejection Reason
                              </label>
                              <p className="text-sm text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/10 rounded p-3">
                                {application.adminReview.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {application.status === "pending" && (
                      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => onReview(application, "approve")}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xs transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <CheckCircle size={18} />
                          Approve Application
                        </button>
                        <button
                          onClick={() => onReview(application, "reject")}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xs transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <XCircle size={18} />
                          Reject Application
                        </button>
                      </div>
                    )}
                  </div>
                </FadeInContainer>
              )}

              {activeTab === "documents" && (
                <FadeInContainer delay={200} duration={600}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        Uploaded Documents
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <FileCheck size={16} />
                        {application.documents?.length || 0} documents
                      </div>
                    </div>

                    {application.documents &&
                    application.documents.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {application.documents.map((document, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 dark:border-gray-700 rounded-xs p-4 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer group"
                            onClick={() =>
                              setPreviewDocument({
                                id: document.id.toString(),
                                url: document.fileUrl,
                                name: document.fileName,
                                documentName: document.fileName,
                                fileType: document.mimeType,
                                size: document.fileSize,
                              })
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
                                <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                  {document.fileName}
                                </h5>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {document.documentType}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    •
                                  </span>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {document.fileSize
                                      ? `${(
                                          document.fileSize /
                                          1024 /
                                          1024
                                        ).toFixed(2)} MB`
                                      : "Unknown size"}
                                  </span>
                                </div>
                                {document.expiryDate && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <AlertTriangle
                                      size={12}
                                      className="text-yellow-500"
                                    />
                                    <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                      Expires: {formatDate(document.expiryDate)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <FileText
                          size={64}
                          className="mx-auto mb-4 text-gray-300 dark:text-gray-600"
                        />
                        <p className="text-lg font-medium mb-2">
                          No documents uploaded
                        </p>
                        <p className="text-sm">
                          This application doesn't have any supporting
                          documents.
                        </p>
                      </div>
                    )}
                  </div>
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

export default ApplicationDetailModal;

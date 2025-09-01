"use client";

import React from "react";
import { Consultation } from "@/types";
import PatientConsultationListView from "./PatientConsultationListView";
import PatientConsultationGridView from "./PatientConsultationGridView";
import { List, Grid3X3 } from "lucide-react";

interface PatientConsultationViewToggleProps {
  consultations: Consultation[];
  viewMode: "list" | "grid";
  onViewModeChange: (mode: "list" | "grid") => void;
  onViewConsultation?: (consultation: Consultation) => void;
  onJoinConsultation?: (consultation: Consultation) => void;
  onRateConsultation?: (consultation: Consultation) => void;
}

const PatientConsultationViewToggle: React.FC<PatientConsultationViewToggleProps> = ({
  consultations,
  viewMode,
  onViewModeChange,
  onViewConsultation,
  onJoinConsultation,
  onRateConsultation,
}) => {
  return (
    <div className="space-y-4">
      {/* View Toggle Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            View:
          </span>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("list")}
              className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => onViewModeChange("grid")}
              className={`flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Grid3X3 className="w-4 h-4" />
              Grid
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {consultations.length} consultation{consultations.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* View Content */}
      {viewMode === "list" ? (
        <PatientConsultationListView
          consultations={consultations}
          onViewConsultation={onViewConsultation}
          onJoinConsultation={onJoinConsultation}
          onRateConsultation={onRateConsultation}
        />
      ) : (
        <PatientConsultationGridView
          consultations={consultations}
          onViewConsultation={onViewConsultation}
          onJoinConsultation={onJoinConsultation}
          onRateConsultation={onRateConsultation}
        />
      )}
    </div>
  );
};

export default PatientConsultationViewToggle;

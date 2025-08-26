import React from "react";
import { ModalWrapper, FormHeader } from "@/components/ui";
import { X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TimelineEvent {
  id: number;
  description: string;
  timestamp: string;
}

interface ApplicationTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TimelineEvent[];
}

const ApplicationTimelineModal: React.FC<ApplicationTimelineModalProps> = ({
  isOpen,
  onClose,
  timeline,
}) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-2 lg:p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Application Timeline"
          description="Track the progress of your application"
        />

        <div className="space-y-4 mt-6">
          {timeline.length > 0 ? (
            timeline.map((event) => (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(event.timestamp))} ago
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No timeline events available
            </p>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ApplicationTimelineModal;

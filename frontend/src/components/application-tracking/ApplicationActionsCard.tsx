import React from "react";
import { Eye, Clock, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";

interface ApplicationActionsCardProps {
  onViewApplication: () => void;
  onViewTimeline: () => void;
  canActivate: boolean;
  canReapply: boolean;
  onActivate: () => void;
  onReapply: () => void;
  activating: boolean;
  reapplying: boolean;
}

const ApplicationActionsCard: React.FC<ApplicationActionsCardProps> = ({
  onViewApplication,
  onViewTimeline,
  canActivate,
  canReapply,
  onActivate,
  onReapply,
  activating,
  reapplying,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Button
          onClick={onViewApplication}
          additionalClasses="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Application
        </Button>

        <Button
          onClick={onViewTimeline}
          additionalClasses="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
        >
          <Clock className="h-4 w-4 mr-2" />
          View Timeline
        </Button>

        {canActivate && (
          <Button
            onClick={onActivate}
            disabled={activating}
            additionalClasses="w-full bg-green-600 hover:bg-green-700 text-white transition-colors"
          >
            <Play className="h-4 w-4 mr-2" />
            {activating ? "Activating..." : "Activate Account"}
          </Button>
        )}

        {canReapply && (
          <Button
            onClick={onReapply}
            disabled={reapplying}
            additionalClasses="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            {reapplying ? "Reapplying..." : "Reapply"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ApplicationActionsCard;

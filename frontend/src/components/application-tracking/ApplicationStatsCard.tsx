import React from "react";

interface ApplicationStats {
  totalApplications: number;
  currentStatus: string;
  daysSinceSubmission: number;
  estimatedReviewTime: string;
  lastUpdated: string;
}

interface ApplicationStatsCardProps {
  stats: ApplicationStats;
}

const ApplicationStatsCard: React.FC<ApplicationStatsCardProps> = ({
  stats,
}) => {
  if (!stats) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Statistics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.daysSinceSubmission}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Days Since Submission
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.estimatedReviewTime}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Estimated Review Time
          </p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalApplications}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Applications
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatsCard;

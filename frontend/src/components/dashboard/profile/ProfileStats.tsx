import React from "react";
import { UserStats } from "@/hooks/useProfile";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Progress,
} from "@/components/ui";
import { formatDate } from "@/utils/dateUtils";

interface ProfileStatsProps {
  stats: UserStats | null;
  loading?: boolean;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({
  stats,
  loading = false,
}) => {
  if (loading || !stats) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getActivityLevel = (consultations: number = 0) => {
    if (consultations === 0)
      return {
        level: "New",
        color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
      };
    if (consultations < 5)
      return {
        level: "Beginner",
        color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      };
    if (consultations < 20)
      return {
        level: "Active",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      };
    if (consultations < 50)
      return {
        level: "Experienced",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      };
    return {
      level: "Expert",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    };
  };

  const getProfileCompletion = () => {
    // This would be calculated based on user profile completeness
    // For now, we'll use a placeholder
    return 85; // 85% complete
  };

  const activityLevel = getActivityLevel(stats.totalConsultations);
  const profileCompletion = getProfileCompletion();

  return (
    <div className="space-y-6">
      {/* Activity Overview */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Activity Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalConsultations?.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Consultations
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalOrders?.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Orders
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats.totalReviews?.toLocaleString() || "0"}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Total Reviews
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Status */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Profile Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Completion
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Complete your profile to improve visibility
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {profileCompletion}%
              </div>
              <Badge className={activityLevel.color}>
                {activityLevel.level}
              </Badge>
            </div>
          </div>
          <Progress value={profileCompletion} className="w-full" />
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Member Since
              </h4>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(stats.memberSince)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Login
              </h4>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(stats.lastLogin)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Verification
              </h4>
              <p className="text-sm">
                {stats.emailVerified ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ✗ Not Verified
                  </span>
                )}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile Complete
              </h4>
              <p className="text-sm">
                {stats.profileComplete ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Complete
                  </span>
                ) : (
                  <span className="text-yellow-600 dark:text-yellow-400">
                    ⚠ Incomplete
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Statistics (Admin Only) */}
      {stats.totalUsers && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              System Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalUsers?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Total Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDoctors?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Doctors
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPharmacies?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Pharmacies
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalPatients?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Patients
                </div>
              </div>
            </div>
            {stats.systemUptime && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    System Uptime
                  </span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {stats.systemUptime}%
                  </span>
                </div>
                <Progress value={stats.systemUptime} className="mt-2" />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Profile updated
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(stats.lastLogin)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Last login
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(stats.lastLogin)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  Account created
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(stats.memberSince)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Insights */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-900 dark:text-blue-100">
            Activity Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>
              • You&apos;ve been a member for{" "}
              {Math.floor(
                (Date.now() - new Date(stats.memberSince).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{" "}
              days
            </li>
            <li>
              • Your activity level is: <strong>{activityLevel.level}</strong>
            </li>
            <li>
              • Profile completion: {profileCompletion}% - consider adding more
              information
            </li>
            {stats.totalConsultations && (
              <li>
                • You&apos;ve completed {stats.totalConsultations} consultations
              </li>
            )}
            {stats.totalOrders && (
              <li>• You&apos;ve placed {stats.totalOrders} orders</li>
            )}
            {stats.totalReviews && (
              <li>• You&apos;ve written {stats.totalReviews} reviews</li>
            )}
            <li>• Keep your profile updated to maintain good visibility</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStats;

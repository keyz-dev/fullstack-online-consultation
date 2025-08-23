import React from "react";
import { ProfileStatCard } from "@/components/ui";
import {
  Calendar,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle,
  XCircle,
  Users,
  Stethoscope,
  Building2,
  MessageSquare,
  Activity,
  Clock,
  Award,
} from "lucide-react";

interface AdminProfileOverviewProps {
  user: any;
  stats: any;
}

const AdminProfileOverview: React.FC<AdminProfileOverviewProps> = ({
  user,
  stats,
}) => {
  const imagePlaceholder =
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541";

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProfileCompletionPercentage = () => {
    if (!user) return 0;

    const fields = [
      user.name,
      user.email,
      user.avatar,
      user.gender,
      user.dob,
      user.address?.street,
      user.address?.city,
    ];

    const completedFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  };

  const profileCompletion = getProfileCompletionPercentage();

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
        <div className="relative">
          <img
            src={user?.avatar || imagePlaceholder}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
          />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center">
            <CheckCircle size={16} className="text-white" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
              Administrator
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              Member since {formatDate(user?.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              {user?.emailVerified ? (
                <CheckCircle size={14} className="text-green-500" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              {user?.emailVerified ? "Email verified" : "Email not verified"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Profile Completion
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Profile completeness
            </span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {profileCompletion}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          {profileCompletion < 100 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Complete your profile to unlock additional features
            </p>
          )}
        </div>
      </div>

      {/* System Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProfileStatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={Users}
            colorTheme="blue"
            description="Registered users"
          />
          <ProfileStatCard
            title="Total Doctors"
            value={stats.totalDoctors || 0}
            icon={Stethoscope}
            colorTheme="green"
            description="Verified doctors"
          />
          <ProfileStatCard
            title="Total Pharmacies"
            value={stats.totalPharmacies || 0}
            icon={Building2}
            colorTheme="purple"
            description="Verified pharmacies"
          />
          <ProfileStatCard
            title="Applications Reviewed"
            value={stats.totalApplicationsReviewed || 0}
            icon={Award}
            colorTheme="orange"
            description="Applications processed"
          />
        </div>
      )}

      {/* System Health */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileStatCard
            title="System Uptime"
            value={`${stats.systemUptime || 0}%`}
            icon={Activity}
            colorTheme="green"
            description="System availability"
          />
          <ProfileStatCard
            title="Total Consultations"
            value={stats.totalConsultations || 0}
            icon={MessageSquare}
            colorTheme="indigo"
            description="Completed consultations"
          />
        </div>
      )}

      {/* Personal Information */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-white mt-1">
                {user?.name || "Not provided"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Mail size={16} className="text-gray-400" />
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
                {user?.emailVerified && (
                  <CheckCircle size={16} className="text-green-500" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Gender
              </label>
              <p className="text-gray-900 dark:text-white mt-1 capitalize">
                {user?.gender || "Not specified"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Date of Birth
              </label>
              <p className="text-gray-900 dark:text-white mt-1">
                {formatDate(user?.dob)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Address
              </label>
              <div className="flex items-start gap-2 mt-1">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <div className="text-gray-900 dark:text-white">
                  {user?.address?.street && <p>{user.address.street}</p>}
                  {user?.address?.city && user?.address?.country && (
                    <p>
                      {user.address.city}, {user.address.country}
                    </p>
                  )}
                  {!user?.address?.street && !user?.address?.city && (
                    <p>Not provided</p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Auth Provider
              </label>
              <p className="text-gray-900 dark:text-white mt-1 capitalize">
                {user?.authProvider || "local"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Account Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Shield size={20} className="text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Account Status
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Clock size={20} className="text-gray-600 dark:text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Last Login
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDate(stats?.lastLogin)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileOverview;

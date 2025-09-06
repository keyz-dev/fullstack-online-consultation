import React from "react";
import { ProfileStatCard } from "@/components/ui";
import {
  Activity,
  Users,
  Stethoscope,
  Building2,
  MessageSquare,
  Award,
  Clock,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertTriangle,
  FileText,
  Shield,
} from "lucide-react";

interface AdminProfileStatsProps {
  stats: unknown;
}

const AdminProfileStats: React.FC<AdminProfileStatsProps> = ({ stats }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Mock activity data for demonstration
  const recentActivities = [
    {
      id: 1,
      type: "application_reviewed",
      title: "Doctor application approved",
      description: "Approved Dr. Sarah Johnson's application",
      timestamp: "2024-01-15T10:30:00.000Z",
      status: "success",
    },
    {
      id: 2,
      type: "user_created",
      title: "New patient registered",
      description: "Patient John Doe registered successfully",
      timestamp: "2024-01-15T09:15:00.000Z",
      status: "success",
    },
    {
      id: 3,
      type: "system_alert",
      title: "System maintenance completed",
      description: "Scheduled maintenance completed successfully",
      timestamp: "2024-01-15T08:00:00.000Z",
      status: "info",
    },
    {
      id: 4,
      type: "security_alert",
      title: "Failed login attempt",
      description: "Multiple failed login attempts detected",
      timestamp: "2024-01-14T23:45:00.000Z",
      status: "warning",
    },
    {
      id: 5,
      type: "application_reviewed",
      title: "Pharmacy application rejected",
      description:
        "Rejected ABC Pharmacy application due to incomplete documents",
      timestamp: "2024-01-14T16:20:00.000Z",
      status: "error",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application_reviewed":
        return <Award size={16} />;
      case "user_created":
        return <Users size={16} />;
      case "system_alert":
        return <Shield size={16} />;
      case "security_alert":
        return <AlertTriangle size={16} />;
      default:
        return <Activity size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      case "warning":
        return "text-yellow-600 dark:text-yellow-400";
      case "info":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 dark:bg-green-900/20";
      case "error":
        return "bg-red-100 dark:bg-red-900/20";
      case "warning":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      case "info":
        return "bg-blue-100 dark:bg-blue-900/20";
      default:
        return "bg-gray-100 dark:bg-gray-700";
    }
  };

  return (
    <div className="p-3 md:p-6 space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <ProfileStatCard
          title="System Uptime"
          value={`${stats?.systemUptime || 0}%`}
          icon={Activity}
          colorTheme="green"
          description="Last 30 days"
        />
        <ProfileStatCard
          title="Active Users"
          value={stats?.totalUsers || 0}
          icon={Users}
          colorTheme="blue"
          description="Currently online"
        />
        <ProfileStatCard
          title="Pending Reviews"
          value="12"
          icon={FileText}
          colorTheme="orange"
          description="Applications awaiting review"
        />
        <ProfileStatCard
          title="Response Time"
          value="2.3s"
          icon={Clock}
          colorTheme="purple"
          description="Average API response"
        />
      </div>

      {/* Growth Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <TrendingUp size={20} />
          Growth Metrics
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={20} className="text-green-500" />
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                +15%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              User Growth
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              vs last month
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp size={20} className="text-blue-500" />
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                +8%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Doctor Growth
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              vs last month
            </p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown size={20} className="text-red-500" />
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                -3%
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              System Errors
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              vs last month
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 size={20} />
          Recent Activity
        </h3>

        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div
                className={`p-2 rounded-full ${getStatusBgColor(
                  activity.status
                )}`}
              >
                <div className={getStatusColor(activity.status)}>
                  {getActivityIcon(activity.type)}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar size={12} />
                  {formatDate(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
            View All Activity
          </button>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Shield size={20} />
          System Health
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Database Performance
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  75%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                API Response Time
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="w-14 h-2 bg-blue-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  87%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Server Load
              </span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="w-8 h-2 bg-yellow-500 rounded-full"></div>
                </div>
                <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                  50%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  All Systems Operational
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Last Backup: 2 hours ago
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  3 Pending Security Updates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <div className="flex items-center gap-3">
              <FileText size={20} className="text-blue-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Review Applications
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  12 pending
                </p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-green-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Manage Users
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  1,250 total
                </p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-purple-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  System Settings
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400">
                  Configure
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileStats;

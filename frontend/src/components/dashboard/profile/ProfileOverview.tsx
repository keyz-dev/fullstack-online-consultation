import React from "react";
import { UserProfile, UserStats } from "@/hooks/useProfile";
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { formatDate } from "@/utils/dateUtils";

interface ProfileOverviewProps {
  user: UserProfile | null;
  stats: UserStats | null;
  loading?: boolean;
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({
  user,
  stats,
  loading = false,
}) => {
  if (loading || !user) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "doctor":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "patient":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "pharmacy":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "pending_doctor":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "pending_pharmacy":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "admin":
        return "Administrator";
      case "doctor":
        return "Doctor";
      case "patient":
        return "Patient";
      case "pharmacy":
        return "Pharmacy";
      case "pending_doctor":
        return "Pending Doctor";
      case "pending_pharmacy":
        return "Pending Pharmacy";
      default:
        return role;
    }
  };

  const getRoleSpecificStats = () => {
    if (!stats) return [];

    const baseStats = [
      {
        title: "Member Since",
        value: formatDate(stats.memberSince),
        icon: "📅",
      },
      {
        title: "Last Login",
        value: formatDate(stats.lastLogin),
        icon: "🕒",
      },
    ];

    switch (user.role) {
      case "admin":
        return [
          ...baseStats,
          {
            title: "Total Users",
            value: stats.totalUsers?.toLocaleString() || "0",
            icon: "👥",
          },
          {
            title: "Total Doctors",
            value: stats.totalDoctors?.toLocaleString() || "0",
            icon: "👨‍⚕️",
          },
          {
            title: "Total Pharmacies",
            value: stats.totalPharmacies?.toLocaleString() || "0",
            icon: "🏥",
          },
          {
            title: "Applications Reviewed",
            value: stats.totalApplicationsReviewed?.toLocaleString() || "0",
            icon: "📋",
          },
        ];
      case "doctor":
        return [
          ...baseStats,
          {
            title: "Total Consultations",
            value: stats.totalConsultations?.toLocaleString() || "0",
            icon: "💬",
          },
          {
            title: "Average Rating",
            value: user.doctor?.averageRating
              ? `${user.doctor.averageRating.toFixed(1)}/5`
              : "N/A",
            icon: "⭐",
          },
          {
            title: "Total Reviews",
            value: user.doctor?.totalReviews?.toLocaleString() || "0",
            icon: "📝",
          },
          {
            title: "Experience",
            value: user.doctor?.experience
              ? `${user.doctor.experience} years`
              : "N/A",
            icon: "🎓",
          },
        ];
      case "patient":
        return [
          ...baseStats,
          {
            title: "Total Appointments",
            value: stats.totalOrders?.toLocaleString() || "0",
            icon: "📅",
          },
          {
            title: "Total Reviews",
            value: stats.totalReviews?.toLocaleString() || "0",
            icon: "📝",
          },
          {
            title: "Blood Group",
            value: user.patient?.bloodGroup || "Not specified",
            icon: "🩸",
          },
          {
            title: "Allergies",
            value: user.patient?.allergies?.length
              ? `${user.patient.allergies.length} allergies`
              : "None",
            icon: "⚠️",
          },
        ];
      case "pharmacy":
        return [
          ...baseStats,
          {
            title: "Total Orders",
            value: stats.totalOrders?.toLocaleString() || "0",
            icon: "📦",
          },
          {
            title: "Average Rating",
            value: user.pharmacy?.averageRating
              ? `${user.pharmacy.averageRating.toFixed(1)}/5`
              : "N/A",
            icon: "⭐",
          },
          {
            title: "Total Reviews",
            value: user.pharmacy?.totalReviews?.toLocaleString() || "0",
            icon: "📝",
          },
          {
            title: "Delivery Radius",
            value: user.pharmacy?.deliveryInfo?.deliveryRadius
              ? `${user.pharmacy.deliveryInfo.deliveryRadius}km`
              : "N/A",
            icon: "🚚",
          },
        ];
      default:
        return baseStats;
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-4">
            <Avatar
              src={user.avatar}
              alt={user.name}
              size="lg"
              className="h-20 w-20"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h2>
                <Badge className={getRoleBadgeColor(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {user.email}
              </p>
              {user.address && (
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  📍 {user.address.city}, {user.address.country}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Gender</div>
              <div className="font-medium text-gray-900 dark:text-white capitalize">
                {user.gender || "Not specified"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">
                Date of Birth
              </div>
              <div className="font-medium text-gray-900 dark:text-white">
                {user.dob ? formatDate(user.dob) : "Not specified"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">
                Email Verified
              </div>
              <div className="font-medium">
                {user.emailVerified ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Verified
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ✗ Not Verified
                  </span>
                )}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-500 dark:text-gray-400">Status</div>
              <div className="font-medium">
                {user.isActive ? (
                  <span className="text-green-600 dark:text-green-400">
                    ✓ Active
                  </span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">
                    ✗ Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role-specific Information */}
      {user.doctor && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Professional Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  License Number
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.doctor.licenseNumber}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Experience
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.doctor.experience} years
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Consultation Fee
                </label>
                <p className="text-gray-900 dark:text-white">
                  ${user.doctor.consultationFee}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Consultation Duration
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.doctor.consultationDuration} minutes
                </p>
              </div>
              {user.doctor.bio && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Bio
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {user.doctor.bio}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {user.patient && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Medical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Blood Group
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.patient.bloodGroup || "Not specified"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Allergies
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.patient.allergies?.length
                    ? user.patient.allergies.join(", ")
                    : "None"}
                </p>
              </div>
              {user.patient.emergencyContact && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Emergency Contact
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {user.patient.emergencyContact.name} (
                    {user.patient.emergencyContact.relationship}) -{" "}
                    {user.patient.emergencyContact.phoneNumber}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {user.pharmacy && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Pharmacy Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pharmacy Name
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.pharmacy.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  License Number
                </label>
                <p className="text-gray-900 dark:text-white">
                  {user.pharmacy.licenseNumber}
                </p>
              </div>
              {user.pharmacy.description && (
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Description
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {user.pharmacy.description}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getRoleSpecificStats().map((stat, index) => (
          <Card
            key={index}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{stat.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileOverview;

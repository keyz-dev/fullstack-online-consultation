import React, { useState } from "react";
import { Table, StatusPill, Button, DropdownMenu } from "@/components/ui";
import { User } from "@/api/users";
import {
  MoreVertical,
  Eye,
  Phone,
  Mail,
  MessageSquare,
  UserCheck,
  UserX,
} from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

interface UserListViewProps {
  users: User[];
  onViewDetails: (user: User) => void;
  onContactUser: (user: User) => void;
  onUpdateStatus: (userId: number, isActive: boolean) => void;
}

const UserListView: React.FC<UserListViewProps> = ({
  users,
  onViewDetails,
  onContactUser,
  onUpdateStatus,
}) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: number]: boolean;
  }>({});

  const handleStatusUpdate = async (userId: number, isActive: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: true }));
    try {
      await onUpdateStatus(userId, isActive);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const getContactInfo = (user: User) => {
    if (user.patient?.contactInfo) return user.patient.contactInfo;
    if (user.doctor?.contactInfo) return user.doctor.contactInfo;
    if (user.pharmacy?.contactInfo) return user.pharmacy.contactInfo;
    return null;
  };

  const getPhoneNumber = (user: User) => {
    const contactInfo = getContactInfo(user);
    if (contactInfo?.phone) return contactInfo.phone;
    if (user.patient?.phoneNumber) return user.patient.phoneNumber;
    return "N/A";
  };

  const getRoleDisplayName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      patient: "Patient",
      doctor: "Doctor",
      pharmacy: "Pharmacy",
      pending_doctor: "Pending Doctor",
      pending_pharmacy: "Pending Pharmacy",
      admin: "Admin",
    };
    return roleMap[role] || role;
  };

  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (user: User) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={user.avatar}
                alt={user.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "ROLE",
      render: (user: User) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {getRoleDisplayName(user.role)}
        </span>
      ),
    },
    {
      key: "status",
      label: "STATUS",
      render: (user: User) => (
        <div className="flex items-center space-x-2">
          <StatusPill
            status={user.isActive ? "active" : "inactive"}
            text={user.isActive ? "Active" : "Inactive"}
          />
          {user.emailVerified && (
            <StatusPill status="verified" text="Verified" size="sm" />
          )}
        </div>
      ),
    },
    {
      key: "phone",
      label: "PHONE",
      render: (user: User) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {getPhoneNumber(user)}
        </span>
      ),
    },
    {
      key: "joined",
      label: "JOINED",
      render: (user: User) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (user: User) => (
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
          items={[
            {
              label: "View Details",
              icon: Eye,
              onClick: () => onViewDetails(user),
            },
            {
              label: "Contact User",
              icon: MessageSquare,
              onClick: () => onContactUser(user),
            },
            {
              label: user.isActive ? "Deactivate" : "Activate",
              icon: user.isActive ? UserX : UserCheck,
              onClick: () => handleStatusUpdate(user.id, !user.isActive),
              disabled: loadingStates[user.id],
            },
          ]}
        />
      ),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <Table
        columns={columns}
        data={users}
        emptyMessage="No users found"
        className="min-h-[400px]"
      />
    </div>
  );
};

export default UserListView;

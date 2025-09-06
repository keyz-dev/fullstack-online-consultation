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
    // Check if contactInfo exists in any of the user types
    if (user.patient && "contactInfo" in user.patient)
      return (user.patient as unknown).contactInfo;
    if (user.doctor && "contactInfo" in user.doctor)
      return (user.doctor as unknown).contactInfo;
    if (user.pharmacy && "contactInfo" in user.pharmacy)
      return (user.pharmacy as unknown).contactInfo;
    return null;
  };

  const getPhoneNumber = (user: User) => {
    if (user.phoneNumber) return user.phoneNumber;
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
      Header: "NAME",
      accessor: "name",
      Cell: ({ row }: { row: User }) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {row.avatar ? (
              <img
                className="h-10 w-10 rounded-full object-cover"
                src={row.avatar}
                alt={row.name}
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {row.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {row.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      Header: "ROLE",
      accessor: "role",
      Cell: ({ row }: { row: User }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {getRoleDisplayName(row.role)}
        </span>
      ),
    },
    {
      Header: "STATUS",
      accessor: "status",
      Cell: ({ row }: { row: User }) => (
        <div className="flex items-center space-x-2">
          <StatusPill status={row.isActive ? "active" : "inactive"} />
          {row.emailVerified && <StatusPill status="verified" />}
        </div>
      ),
    },
    {
      Header: "PHONE",
      accessor: "phone",
      Cell: ({ row }: { row: User }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {getPhoneNumber(row)}
        </span>
      ),
    },
    {
      Header: "JOINED",
      accessor: "joined",
      Cell: ({ row }: { row: User }) => (
        <span className="text-sm text-gray-900 dark:text-white">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      Header: "",
      accessor: "actions",
      Cell: ({ row }: { row: User }) => (
        <DropdownMenu
          trigger={
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          }
          items={[
            {
              label: "View Details",
              icon: <Eye size={16} />,
              onClick: () => onViewDetails(row),
            },
            {
              label: "Contact User",
              icon: <MessageSquare size={16} />,
              onClick: () => onContactUser(row),
            },
            {
              label: row.isActive ? "Deactivate" : "Activate",
              icon: row.isActive ? (
                <UserX size={16} />
              ) : (
                <UserCheck size={16} />
              ),
              onClick: () => handleStatusUpdate(row.id, !row.isActive),
              disabled: loadingStates[row.id],
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
        emptyStateMessage="No users found"
      />
    </div>
  );
};

export default UserListView;

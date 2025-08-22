import React from "react";
import Image from "next/image";
import { Table, StatusPill, DropdownMenu } from "@/components/ui";
import { Specialty } from "@/api/specialties";
import { formatDate } from "@/utils/dateUtils";
import { Edit, Trash2 } from "lucide-react";

interface SpecialtyListViewProps {
  specialties: Specialty[];
  loading: boolean;
  onEdit: (specialty: Specialty) => void;
  onDelete: (specialty: Specialty) => void;
}

const SpecialtyListView: React.FC<SpecialtyListViewProps> = ({
  specialties,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }: { row: Specialty }) =>
          row.icon ? (
            <div className="w-12 h-12 relative">
              <Image
                src={row.icon}
                alt={row.name}
                fill
                className="object-cover rounded-full border border-gray-200 dark:border-gray-600"
                sizes="48px"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
              <span className="text-lg">🏥</span>
            </div>
          ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }: { row: Specialty }) => (
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.name}
          </span>
        ),
      },
      {
        Header: "Doctors",
        accessor: "doctorCount",
        Cell: ({ row }: { row: Specialty }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {row.stats?.doctorCount || 0}
          </span>
        ),
      },
      {
        Header: "Symptoms",
        accessor: "symptomCount",
        Cell: ({ row }: { row: Specialty }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {row.stats?.symptomCount || 0}
          </span>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }: { row: Specialty }) => (
          <StatusPill status={row.isActive ? "active" : "inactive"} />
        ),
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ row }: { row: Specialty }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        Cell: ({ row }: { row: Specialty }) => {
          const menuItems = [
            {
              label: "Edit Specialty",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: "Delete Specialty",
              icon: <Trash2 size={16} />,
              onClick: () => onDelete(row),
              isDestructive: true,
            },
          ];
          return <DropdownMenu items={menuItems} />;
        },
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <Table
      columns={columns as any}
      data={specialties}
      isLoading={loading}
      emptyStateMessage="No specialties found. Try adjusting your filters or adding a new specialty."
    />
  );
};

export default SpecialtyListView;

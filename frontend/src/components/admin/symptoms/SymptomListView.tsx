import React from "react";
import Image from "next/image";
import { Table, StatusPill, DropdownMenu } from "@/components/ui";
import { Symptom } from "@/api/symptoms";
import { formatDate } from "@/utils/dateUtils";
import { Edit, Trash2 } from "lucide-react";

interface SymptomListViewProps {
  symptoms: Symptom[];
  loading: boolean;
  onEdit: (symptom: Symptom) => void;
  onDelete: (symptom: Symptom) => void;
}

const SymptomListView: React.FC<SymptomListViewProps> = ({
  symptoms,
  loading,
  onEdit,
  onDelete,
}) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Image",
        accessor: "image",
        Cell: ({ row }: { row: Symptom }) =>
          row.iconUrl ? (
            <div className="w-12 h-12 relative">
              <Image
                src={row.iconUrl}
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
        Cell: ({ row }: { row: Symptom }) => (
          <span className="font-semibold text-gray-900 dark:text-white">
            {row.name}
          </span>
        ),
      },
      {
        Header: "Specialty",
        accessor: "specialty",
        Cell: ({ row }: { row: Symptom }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {row.specialty?.name || "Unassigned"}
          </span>
        ),
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ row }: { row: Symptom }) => (
          <span className="text-gray-600 dark:text-gray-300">
            {formatDate(row.createdAt)}
          </span>
        ),
      },
      {
        id: "actions",
        Cell: ({ row }: { row: Symptom }) => {
          const menuItems = [
            {
              label: "Edit Symptom",
              icon: <Edit size={16} />,
              onClick: () => onEdit(row),
            },
            {
              label: "Delete Symptom",
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
      data={symptoms}
      isLoading={loading}
      emptyStateMessage="No symptoms found. Try adjusting your filters or adding a new symptom."
    />
  );
};

export default SymptomListView;

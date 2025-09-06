import React from "react";
import { cn } from "@/lib/utils";

interface Column {
  Header: string;
  accessor: string;
  Cell?: ({ row }: { row: unknown }) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: unknown[];
  emptyStateMessage?: string;
  onRowClick?: (row: unknown) => void;
  clickableRows?: boolean;
  isLoading?: boolean;
}

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-4 align-middle [&:has([role=checkbox])]:pr-0 relative",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

export default function Table({
  columns,
  data,
  emptyStateMessage,
  onRowClick,
  clickableRows = false,
  isLoading = false,
}: TableProps) {
  if (isLoading) {
    return (
      <div className="p-6">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  {col.Header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {[...Array(5)].map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                  >
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        {emptyStateMessage || "No data available."}
      </div>
    );
  }

  return (
    <div className="">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((col, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "hover:bg-gray-50 dark:hover:bg-gray-800",
                clickableRows && onRowClick && "cursor-pointer"
              )}
              onClick={
                clickableRows && onRowClick ? () => onRowClick(row) : undefined
              }
            >
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300"
                >
                  {col.Cell ? col.Cell({ row }) : row[col.accessor]}
                </TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

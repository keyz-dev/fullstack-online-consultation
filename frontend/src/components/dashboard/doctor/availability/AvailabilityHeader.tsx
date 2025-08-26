"use client";

import React from "react";
import { Button, Badge } from "@/components/ui";
import { Calendar, RefreshCw, Save } from "lucide-react";

interface AvailabilityHeaderProps {
  totalSessions: number;
  onRefresh: () => void;
  onBulkSave: () => void;
}

export const AvailabilityHeader: React.FC<AvailabilityHeaderProps> = ({
  totalSessions,
  onRefresh,
  onBulkSave,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Availability Manager
          </h1>
        </div>
        <Badge
          variant="secondary"
          className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
        >
          {totalSessions} active sessions
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="flex items-center space-x-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkSave}
          className="flex items-center space-x-1"
        >
          <Save className="w-4 h-4" />
          <span>Save All</span>
        </Button>
      </div>
    </div>
  );
};
